import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";
import CryptoJS from "crypto-js";
import { parseHTML } from "linkedom";
import { assertPublicHostname, assertPublicHttpUrl } from "./publicUrl";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
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
export const assertPublicUrl = assertPublicHttpUrl;

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
