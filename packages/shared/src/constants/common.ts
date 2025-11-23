/**
 * Shared constants used across Askly applications
 */

/** File upload constraints */
export const MAX_FILE_SIZE_MB = 10;

export const ALLOWED_FILE_TYPES = ["pdf", "doc", "docx", "txt", "md"] as const;

export const ALLOWED_IMAGE_TYPES = [
	"jpg",
	"jpeg",
	"png",
	"gif",
	"webp",
	"svg",
] as const;

/** Pagination */
export const DEFAULT_PAGE_SIZE = 20;

export const MAX_PAGE_SIZE = 100;

/** Message constraints */
export const MAX_MESSAGE_LENGTH = 4000;

export const MAX_CONVERSATION_MESSAGES = 1000;

/** API endpoints (relative paths) */
export const API_ROUTES = {
	WEBHOOKS: {
		CLERK: "/api/webhooks/clerk",
		VAPI: "/api/webhooks/vapi",
	},
	CONVERSATIONS: "/api/conversations",
	MESSAGES: "/api/messages",
	FILES: "/api/files",
	ORGANIZATIONS: "/api/organizations",
} as const;

/** Local storage keys */
export const STORAGE_KEYS = {
	THEME: "askly-theme",
	LANGUAGE: "askly-language",
	WIDGET_POSITION: "askly-widget-position",
	COLLAPSED_SIDEBAR: "askly-sidebar-collapsed",
} as const;

/** Widget positions */
export const WIDGET_POSITIONS = {
	BOTTOM_RIGHT: "bottom-right",
	BOTTOM_LEFT: "bottom-left",
} as const;

/** Animation durations (ms) */
export const ANIMATION_DURATION = {
	FAST: 150,
	NORMAL: 300,
	SLOW: 500,
} as const;

/** Debounce/Throttle defaults (ms) */
export const DEBOUNCE_DELAY = 300;

export const THROTTLE_DELAY = 500;

/** Status codes */
export const HTTP_STATUS = {
	OK: 200,
	CREATED: 201,
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	INTERNAL_SERVER_ERROR: 500,
} as const;
