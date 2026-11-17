import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";
import CryptoJS from "crypto-js";
import { parseHTML } from "linkedom";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_PROTOCOLS = ["http:", "https:"];
const CRAWL_TIMEOUT = 30000;
const REQUEST_DELAY = 500;
const MAX_RESOURCES_PER_JOB = 100;
const MAX_REDIRECTS = 5;

/**
 * Reject any URL that could target internal infrastructure or local files.
 * Used for the seed URL, every discovered link/resource, every redirect hop,
 * and in private/webCrawl.ts before fetching stored resource URLs.
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
		(a === 192 && b === 0) || // 192.0.0.0/16 reserved (incl. 192.0.0/24, 192.0.2/24)
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
 * each hop. Disable automatic redirects and re-validate every target manually.
 */
export async function fetchPublicUrl(
	url: string,
	options: Omit<AxiosRequestConfig, "maxRedirects" | "validateStatus"> = {},
): Promise<AxiosResponse> {
	let currentUrl = url;

	for (let redirects = 0; redirects <= MAX_REDIRECTS; redirects++) {
		assertPublicUrl(currentUrl);

		const response = await axios.get(currentUrl, {
			...options,
			maxRedirects: 0,
			// axios' fetch adapter ignores maxRedirects; this makes fetch return
			// the 3xx response so each hop can be validated before following it.
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
};

export type CrawlResult = {
	resources: CrawledResource[];
	pagesVisited: number;
	error?: string;
};

export async function crawlWebsite(
	options: CrawlOptions,
): Promise<CrawlResult> {
	const { url, maxDepth, includeImages, includePdfs, includeText } = options;

	assertPublicUrl(url);
	const baseUrl = new URL(url);

	const resources: CrawledResource[] = [];
	const visitedUrls = new Set<string>();
	const urlsToVisit: { url: string; depth: number }[] = [
		{ url: baseUrl.href, depth: 0 },
	];

	while (urlsToVisit.length && resources.length < MAX_RESOURCES_PER_JOB) {
		const current = urlsToVisit.shift();
		if (!current || current.depth > maxDepth) continue;

		const normalized = normalizeUrl(current.url);
		if (visitedUrls.has(normalized)) continue;
		visitedUrls.add(normalized);

		if (visitedUrls.size > 1) await delay(REQUEST_DELAY);

		let response: AxiosResponse;
		try {
			response = await fetchPublicUrl(current.url, {
				timeout: CRAWL_TIMEOUT,
				responseType: "arraybuffer",
				maxContentLength: MAX_FILE_SIZE,
				headers: { "User-Agent": "AsklyBot/1.0" },
			});
		} catch {
			continue;
		}

		const contentType = response.headers["content-type"] || "";
		const data = new Uint8Array(response.data);
		const size = data.byteLength;

		if (contentType.includes("text/html")) {
			const html = new TextDecoder().decode(data);
			const pageResources = await extractResourcesFromHtml(html, current.url, {
				includeImages,
				includePdfs,
				includeText,
				baseUrl: baseUrl.origin,
			});
			resources.push(...pageResources);

			if (current.depth < maxDepth) {
				for (const link of extractLinks(html, current.url, baseUrl.origin)) {
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
	}

	return {
		resources: deduplicateResources(resources),
		pagesVisited: visitedUrls.size,
	};
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
			const contentHash = hashString(content);
			resources.push({
				url: pageUrl,
				type: "text",
				title,
				contentHash,
				sourceUrl: pageUrl,
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
		try {
			const full = new URL(a.getAttribute("href")!, pageUrl);
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

function _hashBytes(arr: Uint8Array): string {
	const wordArray = CryptoJS.lib.WordArray.create(arr);
	return CryptoJS.SHA256(wordArray).toString(CryptoJS.enc.Hex);
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
