import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
	build: {
		lib: {
			entry: resolve(__dirname, "embed.ts"),
			name: "AsklyWidget",
			fileName: "widget",
			formats: ["iife"],
		},
		rollupOptions: {
			output: {
				extend: true,
			},
		},
	},
	server: {
		port: 3002,
		open: "/index.html",
	},
});
