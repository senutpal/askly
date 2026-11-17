"use client";

/**
 * Minimal, typed postMessage protocol shared with the embed loader.
 * Only these three control messages are recognised on either side.
 */
export const ASKLY_MESSAGE_TYPES = [
	"askly:open",
	"askly:close",
	"askly:toggle",
] as const;

export type AsklyMessageType = (typeof ASKLY_MESSAGE_TYPES)[number];

export interface AsklyMessage {
	type: AsklyMessageType;
}

export const isAsklyMessage = (data: unknown): data is AsklyMessage => {
	if (typeof data !== "object" || data === null) {
		return false;
	}
	const type = (data as { type?: unknown }).type;
	return (
		typeof type === "string" &&
		(ASKLY_MESSAGE_TYPES as readonly string[]).includes(type)
	);
};

/** Best-effort origin of the embedding page for use as a postMessage target. */
export const getParentOrigin = (): string => {
	try {
		if (document.referrer) {
			return new URL(document.referrer).origin;
		}
	} catch {
		// Fall through to a wildcard target; the payload carries no secrets.
	}
	return "*";
};

/** Ask the host page's embed loader to open/close/toggle the widget. */
export const postToParent = (type: AsklyMessageType): void => {
	if (typeof window === "undefined" || window.parent === window) {
		return;
	}
	window.parent.postMessage({ type } satisfies AsklyMessage, getParentOrigin());
};
