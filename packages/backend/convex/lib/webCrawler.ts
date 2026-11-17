import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";
import CryptoJS from "crypto-js";
import { parseHTML } from "linkedom";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_PROTOCOLS = ["http:", "https:"];
const CRAWL_TIMEOUT = 30000;
const REQUEST_DELAY = 500;
export const MAX_RESOURCES_PER_JOB = 100;
/** Hard ceiling so a crawl can never run away, whatever the caller asks for. */
export const MAX_PAGES_PER_CRAWL = 200;
/** Depth is clamped server-side; the UI never decides how far we walk. */
export const MAX_CRAWL_DEPTH = 3;
/** Upper bound on the pending-URL frontier to keep memory flat. */
const MAX_QUEUED_URLS = 2_000;
/** Keeps extracted text inside the single-document size limit. */
export const MAX_STORED_TEXT_CHARS = 200_000;
const MAX_REDIRECTS = 5;
/**
 * Leave headroom under the action timeout so a huge or slow site still ends
 * with a saved status and partial results instead of a stuck "crawling" job.
 */
const MAX_CRAWL_DURATION_MS = 8 * 60 * 1000;

const DOH_ENDPOINTS = [
	"https://cloudflare-dns.com/dns-query",
	"https://dns.google/resolve",
] as const;
const DNS_CACHE_TTL_MS = 60_000;
const DNS_CACHE_MAX_ENTRIES = 500;
const DNS_LOOKUP_TIMEOUT_MS = 5_000;

type DnsCacheEntry = { expiresAt: number; addresses: string[] };
const dnsCache = new Map<string, DnsCacheEntry>();

export class CrawlCancelledError extends Error {
	constructor() {
		super("Crawl cancelled");
		this.name = "CrawlCancelledError";
	}
}

export type CrawlControl = {
	/** Checked between pages so a cancelled job stops spending money. */
	isCancelled?: () => Promise<boolean>;
	/** Called periodically so the UI can show real progress. */
	onProgress?: (progress: {
		pagesVisited: number;
		resourcesFound: number;
	}) => Promise<void>;
};

/**
 * Reject any URL that could target internal infrastructure or local files.
 * Used for the seed URL, every discovered link/resource, and every redirect.
 */
export function assertPublicUrl(rawUrl: string): void {
	let url: URL;
	try {
		url = new URL(rawUrl);
	} catch {
		throw new Error("Invalid URL");
	}

	if (!ALLOWED_PROTOCOLS.includes(url.protocol)) {
		throw new Error("Only HTTP and HTTPS URLs are allowed");
	}

	if (url.username || url.password) {
		throw new Error("URLs containing credentials are not allowed");
	}

	// WHATWG URL normalises decimal/octal/hex IPv4 literals, so checking the
	// hostname covers those bypass attempts as well.
	const hostname = url.hostname
		.toLowerCase()
		.replace(/^\[|\]$/g, "")
		.replace(/\.$/, "");

	if (
		hostname === "localhost" ||
		hostname.endsWith(".localhost") ||
		hostname === "local" ||
		hostname.endsWith(".local") ||
		hostname === "internal" ||
		hostname.endsWith(".internal")
	) {
		throw new Error("URL host is not allowed");
	}

	if (isBlockedIpv4(hostname) || isBlockedIpv6(hostname)) {
		throw new Error("URL host is not allowed");
	}
}

/**
 * Resolve the hostname and reject it when *any* answer points at private
 * space. This closes the gap where a public-looking hostname maps to
 * 127.0.0.1 or 169.254.169.254 at request time.
 *
 * DNS is resolved over HTTPS (DoH) because the Convex runtime does not expose
 * the system resolver. There is a small residual TOCTOU window between this
 * lookup and the socket connect; the connection itself cannot be pinned from
 * this runtime, so private-network egress filtering at the platform level is
 * still recommended as defence in depth.
 */
async function assertPublicHostname(hostname: string): Promise<void> {
	const host = hostname
		.toLowerCase()
		.replace(/^\[|\]$/g, "")
		.replace(/\.$/, "");
	if (!host || isIpLiteral(host)) return;

	const addresses = await resolveHostAddresses(host);
	if (addresses.length === 0) {
		throw new Error("Could not resolve URL host");
	}

	for (const address of addresses) {
		if (isBlockedIpv4(address) || isBlockedIpv6(address)) {
			throw new Error("URL host resolves to a private address");
		}
	}
}

function isIpLiteral(hostname: string): boolean {
	return hostname.includes(":") || /^\d{1,3}(\.\d{1,3}){3}$/.test(hostname);
}

async function resolveHostAddresses(hostname: string): Promise<string[]> {
	const cached = dnsCache.get(hostname);
	if (cached && cached.expiresAt > Date.now()) {
		return cached.addresses;
	}

	for (const endpoint of DOH_ENDPOINTS) {
		try {
			const [ipv4, ipv6] = await Promise.all([
				queryDoh(endpoint, hostname, "A"),
				queryDoh(endpoint, hostname, "AAAA"),
			]);
			const addresses = [...new Set([...ipv4, ...ipv6])];
			if (addresses.length > 0) {
				if (dnsCache.size >= DNS_CACHE_MAX_ENTRIES) {
					const oldest = dnsCache.keys().next().value;
					if (oldest) dnsCache.delete(oldest);
				}
				dnsCache.set(hostname, {
					addresses,
					expiresAt: Date.now() + DNS_CACHE_TTL_MS,
				});
				return addresses;
			}
		} catch {
			// Try the next resolver.
		}
	}

	return [];
}

async function queryDoh(
	endpoint: string,
	hostname: string,
	type: "A" | "AAAA",
): Promise<string[]> {
	const url = `${endpoint}?name=${encodeURIComponent(hostname)}&type=${type}`;
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), DNS_LOOKUP_TIMEOUT_MS);
	try {
		const response = await fetch(url, {
			headers: { accept: "application/dns-json" },
			signal: controller.signal,
		});
		if (!response.ok) return [];

		const data = (await response.json()) as {
			Answer?: Array<{ type: number; data: string }>;
		};
		return (data.Answer ?? [])
			.filter((answer) => answer.type === 1 || answer.type === 28)
			.map((answer) => answer.data);
	} finally {
		clearTimeout(timeout);
	}
}

function isBlockedIpv4(ip: string): boolean {
	const octets = ip.split(".").map(Number);
	if (
		octets.length !== 4 ||
		octets.some((o) => !Number.isInteger(o) || o < 0 || o > 255)
	) {
		return false;
	}
	const [a = 0, b = 0] = octets;

	return (
		a === 0 || // 0.0.0.0/8 ("this" network)
		a === 10 || // 10/8
		(a === 100 && b >= 64 && b <= 127) || // 100.64/10 CGNAT
		a === 127 || // 127/8 loopback (incl. 127.0.0.1)
		(a === 169 && b === 254) || // 169.254/16 link-local (incl. 169.254.169.254 metadata)
		(a === 172 && b >= 16 && b <= 31) || // 172.16/12
		(a === 192 && b === 0) || // 192.0.0.0/16 reserved
		(a === 192 && b === 168) || // 192.168/16
		(a === 198 && (b === 18 || b === 19)) || // 198.18/15 benchmarking
		a >= 224 // 224/4 multicast + reserved
	);
}

function parseIpv6(ip: string): number[] | null {
	const raw = ip.split("%")[0] ?? "";
	if (!raw.includes(":")) return null;

	const halves = raw.split("::");
	if (halves.length > 2) return null;

	const parseGroups = (part: string): number[] | null => {
		if (!part) return [];
		const groups: number[] = [];
		for (const piece of part.split(":")) {
			if (piece.includes(".")) {
				const octets = piece.split(".").map(Number);
				if (
					octets.length !== 4 ||
					octets.some((o) => !Number.isInteger(o) || o < 0 || o > 255)
				) {
					return null;
				}
				const [o1 = 0, o2 = 0, o3 = 0, o4 = 0] = octets;
				groups.push((o1 << 8) | o2, (o3 << 8) | o4);
			} else {
				if (!/^[0-9a-f]{1,4}$/i.test(piece)) return null;
				groups.push(parseInt(piece, 16));
			}
		}
		return groups;
	};

	const left = parseGroups(halves[0] ?? "");
	const right = halves.length === 2 ? parseGroups(halves[1] ?? "") : [];
	if (!left || !right) return null;

	const missing = 8 - left.length - right.length;
	if (halves.length === 2 ? missing < 1 : missing !== 0) return null;

	return [...left, ...Array<number>(missing).fill(0), ...right];
}

function isBlockedIpv6(ip: string): boolean {
	const groups = parseIpv6(ip);
	if (!groups) return false;

	// :: (unspecified) and ::1 (loopback)
	if (groups.every((g) => g === 0)) return true;
	if (groups.slice(0, 7).every((g) => g === 0) && groups[7] === 1) return true;

	const [first = 0] = groups;
	// fc00::/7 unique local
	if (first === 0xfc00 || first === 0xfd00) return true;
	// fe80::/10 link-local and fec0::/10 site-local
	if (first >= 0xfe80 && first <= 0xfeff) return true;

	// IPv4-mapped (::ffff:a.b.c.d) and IPv4-compatible (::a.b.c.d) forms must
	// be checked against the IPv4 rules too.
	const mapped =
		groups.slice(0, 5).every((g) => g === 0) && groups[5] === 0xffff;
	const compatible =
		groups.slice(0, 6).every((g) => g === 0) &&
		(groups[6] !== 0 || groups[7] !== 0);
	if (mapped || compatible) {
		const g6 = groups[6] ?? 0;
		const g7 = groups[7] ?? 0;
		const v4 = [g6 >> 8, g6 & 0xff, g7 >> 8, g7 & 0xff].join(".");
		return isBlockedIpv4(v4);
	}

	return false;
}

/**
 * axios follows redirects automatically, which would bypass URL validation on
 * each hop. Disable automatic redirects, re-validate every target manually,
 * and verify the resolved address of every host before connecting.
 */
export async function fetchPublicUrl(
	url: string,
	options: Omit<AxiosRequestConfig, "maxRedirects" | "validateStatus"> = {},
): Promise<AxiosResponse> {
	let currentUrl = url;

	for (let redirects = 0; redirects <= MAX_REDIRECTS; redirects++) {
		assertPublicUrl(currentUrl);
		const parsed = new URL(currentUrl);
		await assertPublicHostname(parsed.hostname);

		const response = await axios.get(currentUrl, {
			...options,
			// Force the fetch adapter so `redirect: "manual"` is honoured. The
			// XHR adapter follows redirects transparently, which would skip the
			// per-hop URL validation below.
			adapter: "fetch",
			maxRedirects: 0,
			fetchOptions: { redirect: "manual" },
			validateStatus: (status) =>
				(status >= 200 && status < 300) || (status >= 300 && status < 400),
		});

		const location = response.headers?.location;
		if (response.status >= 300 && response.status < 400 && location) {
			try {
				currentUrl = new URL(String(location), currentUrl).href;
			} catch {
				throw new Error("Invalid redirect URL");
			}
			continue;
		}

		return response;
	}

	throw new Error("Too many redirects");
}

export type CrawlOptions = {
	url: string;
	maxDepth: number;
	includeImages: boolean;
	includePdfs: boolean;
	includeText: boolean;
};

export type CrawledResource = {
	url: string;
	type: "text" | "image" | "pdf";
	title: string;
	description?: string;
	size?: number;
	sourceUrl: string;
	contentHash: string;
	/** Extracted text for HTML pages, so importing does not re-fetch them. */
	text?: string;
};

export type CrawlResult = {
	resources: CrawledResource[];
	pagesVisited: number;
	error?: string;
};

export async function crawlWebsite(
	options: CrawlOptions,
	control?: CrawlControl,
): Promise<CrawlResult> {
	const { url, includeImages, includePdfs, includeText } = options;
	const maxDepth = Math.max(
		0,
		Math.min(MAX_CRAWL_DEPTH, Math.floor(options.maxDepth)),
	);

	assertPublicUrl(url);
	const baseUrl = new URL(url);
	const robots = await fetchRobotsRules(baseUrl.origin);

	if (!isAllowedByRobots(robots, `${baseUrl.pathname}${baseUrl.search}`)) {
		throw new Error("This site's robots.txt does not allow crawling this URL");
	}

	const resources: CrawledResource[] = [];
	const visitedUrls = new Set<string>();
	const urlsToVisit: { url: string; depth: number }[] = [
		{ url: baseUrl.href, depth: 0 },
	];
	const deadline = Date.now() + MAX_CRAWL_DURATION_MS;

	while (
		urlsToVisit.length &&
		visitedUrls.size < MAX_PAGES_PER_CRAWL &&
		resources.length < MAX_RESOURCES_PER_JOB &&
		Date.now() < deadline
	) {
		if (control?.isCancelled && (await control.isCancelled())) {
			throw new CrawlCancelledError();
		}

		const current = urlsToVisit.shift();
		if (!current || current.depth > maxDepth) continue;

		const normalized = normalizeUrl(current.url);
		if (visitedUrls.has(normalized)) continue;
		visitedUrls.add(normalized);

		const path = `${new URL(current.url).pathname}${new URL(current.url).search}`;
		if (!isAllowedByRobots(robots, path)) continue;

		if (visitedUrls.size > 1) await delay(REQUEST_DELAY);

		let response: AxiosResponse;
		try {
			response = await fetchPublicUrl(current.url, {
				timeout: CRAWL_TIMEOUT,
				responseType: "arraybuffer",
				maxContentLength: MAX_FILE_SIZE,
				headers: { "User-Agent": "AsklyBot/1.0 (+https://askly.app/bot)" },
			});
		} catch {
			continue;
		}

		const contentType = String(response.headers["content-type"] || "");
		const data = new Uint8Array(response.data);
		const size = data.byteLength;

		if (contentType.includes("text/html")) {
			const html = decodeBody(data, contentType);
			const pageResources = await extractResourcesFromHtml(html, current.url, {
				includeImages,
				includePdfs,
				includeText,
				baseUrl: baseUrl.origin,
			});
			resources.push(...pageResources);

			if (current.depth < maxDepth) {
				for (const link of extractLinks(html, current.url, baseUrl.origin)) {
					// Bound the frontier so a page with a huge link list cannot
					// grow memory without limit.
					if (urlsToVisit.length >= MAX_QUEUED_URLS) break;
					if (!visitedUrls.has(normalizeUrl(link))) {
						urlsToVisit.push({ url: link, depth: current.depth + 1 });
					}
				}
			}
		} else if (contentType.includes("application/pdf") && includePdfs) {
			const hash = hashString(current.url);
			resources.push({
				url: current.url,
				type: "pdf",
				title: getFilenameFromUrl(current.url),
				contentHash: hash,
				sourceUrl: current.url,
				size,
			});
		} else if (contentType.startsWith("image/") && includeImages) {
			const hash = hashString(current.url);
			resources.push({
				url: current.url,
				type: "image",
				title: getFilenameFromUrl(current.url),
				contentHash: hash,
				sourceUrl: current.url,
				size,
			});
		}

		if (control?.onProgress && visitedUrls.size % 5 === 0) {
			await control.onProgress({
				pagesVisited: visitedUrls.size,
				resourcesFound: deduplicateResources(resources).length,
			});
		}
	}

	return {
		resources: deduplicateResources(resources),
		pagesVisited: visitedUrls.size,
	};
}

type RobotsRules = { allow: string[]; disallow: string[] };

async function fetchRobotsRules(origin: string): Promise<RobotsRules> {
	try {
		const response = await fetchPublicUrl(`${origin}/robots.txt`, {
			timeout: 5000,
			responseType: "text",
			headers: { "User-Agent": "AsklyBot/1.0 (+https://askly.app/bot)" },
		});
		if (typeof response.data !== "string") {
			return { allow: [], disallow: [] };
		}
		return parseRobots(response.data);
	} catch {
		// No robots.txt (or it is unreachable): treat the site as crawlable.
		return { allow: [], disallow: [] };
	}
}

function parseRobots(text: string): RobotsRules {
	const groups: Array<{
		agents: string[];
		rules: Array<{ allow: boolean; path: string }>;
	}> = [];
	let current: (typeof groups)[number] | null = null;
	let groupHasRules = false;

	for (const rawLine of text.split(/\r?\n/)) {
		const line = (rawLine.split("#")[0] ?? "").trim();

		if (!line) {
			current = null;
			groupHasRules = false;
			continue;
		}

		const separator = line.indexOf(":");
		if (separator === -1) continue;

		const key = line.slice(0, separator).trim().toLowerCase();
		const value = line.slice(separator + 1).trim();

		if (key === "user-agent") {
			// A user-agent line after rules starts the next group.
			if (!current || groupHasRules) {
				current = { agents: [], rules: [] };
				groups.push(current);
				groupHasRules = false;
			}
			current.agents.push(value.toLowerCase());
			continue;
		}

		if (!current) continue;

		if (key === "allow" || key === "disallow") {
			groupHasRules = true;
			// An empty value carries no path and no meaning.
			if (!value) continue;
			current.rules.push({ allow: key === "allow", path: value });
		}
	}

	const isOurAgent = (agent: string) =>
		agent !== "*" && agent.includes("asklybot");
	const specific = groups.filter((group) =>
		group.agents.some((agent) => isOurAgent(agent)),
	);
	const wildcard = groups.filter((group) => group.agents.includes("*"));
	const active = specific.length > 0 ? specific : wildcard;

	const allow: string[] = [];
	const disallow: string[] = [];
	for (const group of active) {
		for (const rule of group.rules) {
			if (rule.allow) {
				allow.push(rule.path);
			} else {
				disallow.push(rule.path);
			}
		}
	}

	return { allow, disallow };
}

function isAllowedByRobots(rules: RobotsRules, path: string): boolean {
	let bestMatchLength = -1;
	let allowed = true;

	for (const rule of rules.allow) {
		if (path.startsWith(rule) && rule.length >= bestMatchLength) {
			bestMatchLength = rule.length;
			allowed = true;
		}
	}

	for (const rule of rules.disallow) {
		if (path.startsWith(rule) && rule.length > bestMatchLength) {
			bestMatchLength = rule.length;
			allowed = false;
		}
	}

	return allowed;
}

function decodeBody(data: Uint8Array, contentType: string): string {
	const headerCharset = /charset=([^;]+)/i
		.exec(contentType)?.[1]
		?.trim()
		.replace(/["']/g, "");

	let charset = headerCharset;
	if (!charset) {
		const head = new TextDecoder("utf-8").decode(data.subarray(0, 2048));
		charset = /<meta[^>]+charset=["']?([\w-]+)/i.exec(head)?.[1];
	}

	try {
		return new TextDecoder(charset || "utf-8").decode(data);
	} catch {
		return new TextDecoder("utf-8").decode(data);
	}
}

async function extractResourcesFromHtml(
	html: string,
	pageUrl: string,
	opts: {
		includeImages: boolean;
		includePdfs: boolean;
		includeText: boolean;
		baseUrl: string;
	},
): Promise<CrawledResource[]> {
	const resources: CrawledResource[] = [];
	const { document } = parseHTML(html);
	if (opts.includeText) {
		const title =
			document.querySelector("title")?.textContent?.trim() || "Untitled Page";
		const content = extractText(document);
		if (content.length > 50) {
			const storedText = content.slice(0, MAX_STORED_TEXT_CHARS);
			const contentHash = hashString(storedText);
			resources.push({
				url: pageUrl,
				type: "text",
				title,
				contentHash,
				sourceUrl: pageUrl,
				text: storedText,
			});
		}
	}

	if (opts.includeImages) {
		for (const img of Array.from(document.querySelectorAll("img[src]"))) {
			const src = img.getAttribute("src");
			if (!src || src.startsWith("data:") || src.endsWith(".svg")) {
				continue;
			}

			let imageUrl: string;
			try {
				imageUrl = new URL(src, pageUrl).href;
				assertPublicUrl(imageUrl);
			} catch {
				continue;
			}
			const contentHash = hashString(imageUrl);
			resources.push({
				url: imageUrl,
				type: "image",
				title: getFilenameFromUrl(imageUrl),
				contentHash,
				sourceUrl: pageUrl,
			});
		}
	}

	if (opts.includePdfs) {
		for (const a of Array.from(document.querySelectorAll("a[href]"))) {
			const href = a.getAttribute("href");
			if (!href?.toLowerCase().includes(".pdf")) {
				continue;
			}

			let pdfUrl: string;
			try {
				pdfUrl = new URL(href, pageUrl).href;
				assertPublicUrl(pdfUrl);
			} catch {
				continue;
			}
			const contentHash = hashString(pdfUrl);
			resources.push({
				url: pdfUrl,
				type: "pdf",
				title: getFilenameFromUrl(pdfUrl),
				contentHash,
				sourceUrl: pageUrl,
			});
		}
	}
	return resources;
}

function extractText(doc: Document): string {
	const clone = doc.cloneNode(true) as Document;

	for (const el of Array.from(
		clone.querySelectorAll("script,style,nav,footer,header,aside,iframe"),
	)) {
		el.remove();
	}

	const body = clone.querySelector("body");
	const rawText = body?.textContent ?? "";
	const cleaned = rawText.replace(/\s+/g, " ").trim();
	return cleaned;
}

function extractLinks(html: string, pageUrl: string, origin: string): string[] {
	const { document } = parseHTML(html);
	const links: string[] = [];
	for (const a of Array.from(document.querySelectorAll("a[href]"))) {
		const href = a.getAttribute("href");
		if (!href) continue;
		try {
			const full = new URL(href, pageUrl);
			if (full.origin === origin) {
				full.hash = "";
				assertPublicUrl(full.href);
				links.push(full.href);
			}
		} catch {}
	}
	return links;
}
function hashString(str: string): string {
	return CryptoJS.SHA256(str).toString(CryptoJS.enc.Hex);
}

function normalizeUrl(url: string): string {
	const u = new URL(url);
	u.hash = "";
	if (u.pathname.endsWith("/") && u.pathname !== "/") {
		u.pathname = u.pathname.slice(0, -1);
	}
	return u.href;
}

function getFilenameFromUrl(url: string): string {
	const path = new URL(url).pathname;
	return decodeURIComponent(path.split("/").pop() || "file");
}

function deduplicateResources(arr: CrawledResource[]): CrawledResource[] {
	const map = new Map<string, CrawledResource>();
	for (const r of arr) {
		if (!map.has(r.contentHash)) map.set(r.contentHash, r);
	}
	return [...map.values()];
}

function delay(ms: number): Promise<void> {
	return new Promise((res) => setTimeout(res, ms));
}
