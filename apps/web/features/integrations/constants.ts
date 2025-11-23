export const INTEGRATIONS = [
	{
		id: "html",
		title: "HTML",
		icon: "/languages/html5.svg",
		installSteps: [
			"Copy the script below.",
			"Paste it inside the <head> section of your HTML.",
			"Refresh your website to see the chat widget.",
		],
	},
	{
		id: "react",
		title: "React",
		icon: "/languages/react.svg",
		installSteps: [
			"Copy the import and component code below.",
			"Paste it inside your App.jsx or a Layout component.",
			"Restart your React server if needed.",
		],
	},
	{
		id: "nextjs",
		title: "Next.js",
		icon: "/languages/nextjs.svg",
		installSteps: [
			"Copy the code below.",
			"Add it inside your root layout (app/layout.tsx) or _app.js.",
			"Run your Next.js app to see the widget.",
		],
	},
	{
		id: "javascript",
		title: "Javascript",
		icon: "/languages/javascript.svg",
		installSteps: [
			"Copy the script below.",
			"Paste it inside your index.html OR dynamically load it in JS.",
			"Make sure this runs before your website finishes loading.",
		],
	},
] as const;

export type IntegrationId = (typeof INTEGRATIONS)[number]["id"];

export const HTML_SCRIPT = `<script src="https://askly-widget.vercel.app/widget.js" data-organization-id="{{ORGANIZATION_ID}}"></script>`;

export const JAVASCRIPT_SCRIPT = `<script>
  (function() {
    const s = document.createElement("script");
    s.src = "https://askly-widget.vercel.app/widget.js";
    s.dataset.organizationId = "{{ORGANIZATION_ID}}";
    document.head.appendChild(s);
  })();
</script>
`;

export const REACT_SCRIPT = `import { useEffect } from "react";
function AsklyChat() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://askly-widget.vercel.app/widget.js";
    script.dataset.organizationId = "{{ORGANIZATION_ID}}";
    document.head.appendChild(script);
  }, []);
  return null; // Widget attaches globally
}
export default AsklyChat;
`;

export const NEXTJS_SCRIPT = `"use client";
import { useEffect } from "react";
export default function AsklyChat() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://askly-widget.vercel.app/widget.js";
    script.dataset.organizationId = "{{ORGANIZATION_ID}}";
    document.head.appendChild(script);
  }, []);
  return null;
}
`;
