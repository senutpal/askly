const ALLOWED_PROTOCOLS = ["http:", "https:"];

const DOH_ENDPOINTS = [
	"https://cloudflare-dns.com/dns-query",
	"https://dns.google/resolve",
] as const;
const DNS_CACHE_TTL_MS = 60_000;
const DNS_CACHE_MAX_ENTRIES = 500;
const DNS_LOOKUP_TIMEOUT_MS = 5_000;

type DnsCacheEntry = { expiresAt: number; addresses: string[] };
const dnsCache = new Map<string, DnsCacheEntry>();

const normalizeHostname = (hostname: string) =>
	hostname
		.toLowerCase()
		.replace(/^\[|\]$/g, "")
		.replace(/\.$/, "");

export function assertPublicHttpUrl(rawUrl: string): void {
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

	const hostname = normalizeHostname(url.hostname);

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

export async function assertPublicHostname(hostname: string): Promise<void> {
	const host = normalizeHostname(hostname);
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

export function isIpLiteral(hostname: string): boolean {
	return hostname.includes(":") || /^\d{1,3}(\.\d{1,3}){3}$/.test(hostname);
}

export function isBlockedIpv4(ip: string): boolean {
	const octets = ip.split(".").map(Number);
	if (
		octets.length !== 4 ||
		octets.some((o) => !Number.isInteger(o) || o < 0 || o > 255)
	) {
		return false;
	}
	const [a = 0, b = 0] = octets;

	return (
		a === 0 ||
		a === 10 ||
		(a === 100 && b >= 64 && b <= 127) ||
		a === 127 ||
		(a === 169 && b === 254) ||
		(a === 172 && b >= 16 && b <= 31) ||
		(a === 192 && b === 0) ||
		(a === 192 && b === 168) ||
		(a === 198 && (b === 18 || b === 19)) ||
		a >= 224
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
				groups.push(Number.parseInt(piece, 16));
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

export function isBlockedIpv6(ip: string): boolean {
	const groups = parseIpv6(ip);
	if (!groups) return false;

	if (groups.every((g) => g === 0)) return true;
	if (groups.slice(0, 7).every((g) => g === 0) && groups[7] === 1) return true;

	const [first = 0] = groups;
	if (first === 0xfc00 || first === 0xfd00) return true;
	if (first >= 0xfe80 && first <= 0xfeff) return true;

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
