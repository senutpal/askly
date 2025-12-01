/**
 * Language configuration
 */

import type {
	LanguageConfig,
	SupportedLanguage,
} from "../types/common.types.js";

export const SUPPORTED_LANGUAGES: Record<SupportedLanguage, LanguageConfig> = {
	en: {
		code: "en",
		name: "English",
		nativeName: "English",
	},
	hi: {
		code: "hi",
		name: "Hindi",
		nativeName: "हिन्दी",
	},
	ta: {
		code: "ta",
		name: "Tamil",
		nativeName: "தமிழ்",
	},
	te: {
		code: "te",
		name: "Telugu",
		nativeName: "తెలుగు",
	},
	mr: {
		code: "mr",
		name: "Marathi",
		nativeName: "मराठी",
	},
	bn: {
		code: "bn",
		name: "Bengali",
		nativeName: "বাংলা",
	},
	gu: {
		code: "gu",
		name: "Gujarati",
		nativeName: "ગુજરાતી",
	},
	kn: {
		code: "kn",
		name: "Kannada",
		nativeName: "ಕನ್ನಡ",
	},
	ml: {
		code: "ml",
		name: "Malayalam",
		nativeName: "മലയാളം",
	},
	pa: {
		code: "pa",
		name: "Punjabi",
		nativeName: "ਪੰਜਾਬੀ",
	},
	or: {
		code: "or",
		name: "Odia",
		nativeName: "ଓଡ଼ିଆ",
	},
};

/**
 * Get language configuration by code
 */
export function getLanguageConfig(code: SupportedLanguage): LanguageConfig {
	return SUPPORTED_LANGUAGES[code];
}

/**
 * Get all available language codes
 */
export function getLanguageCodes(): SupportedLanguage[] {
	return Object.keys(SUPPORTED_LANGUAGES) as SupportedLanguage[];
}

/**
 * Get all language configurations as array
 */
export function getAllLanguages(): LanguageConfig[] {
	return Object.values(SUPPORTED_LANGUAGES);
}

/**
 * Check if a language code is supported
 */
export function isLanguageSupported(code: string): code is SupportedLanguage {
	return code in SUPPORTED_LANGUAGES;
}
