/**
 * Theme configuration
 */

import type { ColorScheme, ThemeMode } from "../types/index.js";

/** Default color schemes */
export const DEFAULT_LIGHT_COLORS: ColorScheme = {
	primary: "#6366f1", // Indigo
	secondary: "#8b5cf6", // Purple
	accent: "#ec4899", // Pink
	background: "#ffffff", // White
	foreground: "#0f172a", // Slate 900
};

export const DEFAULT_DARK_COLORS: ColorScheme = {
	primary: "#818cf8", // Indigo 400
	secondary: "#a78bfa", // Purple 400
	accent: "#f472b6", // Pink 400
	background: "#0f172a", // Slate 900
	foreground: "#f8fafc", // Slate 50
};

/**
 * Get default colors for a theme mode
 */
export function getDefaultColors(mode: ThemeMode): ColorScheme {
	return mode === "dark" ? DEFAULT_DARK_COLORS : DEFAULT_LIGHT_COLORS;
}

/**
 * Validate color hex format
 */
export function isValidHexColor(color: string): boolean {
	return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}

/**
 * Convert hex color to RGB
 */
export function hexToRgb(
	hex: string,
): { r: number; g: number; b: number } | null {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	const r = result?.[1];
	const g = result?.[2];
	const b = result?.[3];
	if (r === undefined || g === undefined || b === undefined) {
		return null;
	}
	return {
		r: parseInt(r, 16),
		g: parseInt(g, 16),
		b: parseInt(b, 16),
	};
}
