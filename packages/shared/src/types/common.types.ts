/**
 * Common types used across Askly applications
 */

/** Message types */
export type MessageRole = "user" | "assistant" | "system";

export type MessageStatus = "sending" | "sent" | "error";

export interface BaseMessage {
	id: string;
	role: MessageRole;
	content: string;
	createdAt: number;
	status?: MessageStatus;
}

/** User and Organization types */
export type UserRole = "admin" | "member" | "viewer";

export interface BaseUser {
	id: string;
	name: string;
	email: string;
	imageUrl?: string;
}

export interface BaseOrganization {
	id: string;
	name: string;
	slug: string;
	imageUrl?: string;
}

/** Language types */
export type SupportedLanguage =
	| "en" // English
	| "hi" // Hindi
	| "ta" // Tamil
	| "te" // Telugu
	| "mr" // Marathi
	| "bn" // Bengali
	| "gu" // Gujarati
	| "kn" // Kannada
	| "ml" // Malayalam
	| "pa" // Punjabi
	| "or"; // Odia

export interface LanguageConfig {
	code: SupportedLanguage;
	name: string;
	nativeName: string;
	rtl?: boolean;
}

/** Theme and Customization types */
export interface ColorScheme {
	primary: string;
	secondary: string;
	accent: string;
	background: string;
	foreground: string;
}

export type ThemeMode = "light" | "dark";

export interface CustomizationConfig {
	theme: ThemeMode;
	colors: ColorScheme;
	brandName?: string;
	brandLogo?: string;
}

/** API Response types */
export interface ApiResponse<T = unknown> {
	success: boolean;
	data?: T;
	error?: {
		message: string;
		code?: string;
	};
}

export interface PaginatedResponse<T> {
	items: T[];
	total: number;
	page: number;
	pageSize: number;
	hasMore: boolean;
}

/** File types */
export type FileType = "pdf" | "doc" | "docx" | "txt" | "md";

export interface FileMetadata {
	id: string;
	name: string;
	type: FileType;
	size: number;
	uploadedAt: number;
	uploadedBy: string;
}

/** Conversation types */
export type ConversationStatus = "active" | "resolved" | "escalated";

export interface BaseConversation {
	id: string;
	organizationId: string;
	status: ConversationStatus;
	createdAt: number;
	updatedAt: number;
	messageCount: number;
}

/** Generic utility types */
export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
	T,
	Exclude<keyof T, Keys>
> &
	{
		[K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
	}[Keys];

export type DeepPartial<T> = {
	[P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
