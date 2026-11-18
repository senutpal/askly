export const SITE_URL = "https://asklyxsen.vercel.app";

export const LANDING_TITLE = "Askly";

export const LANDING_DESCRIPTION =
	"Askly answers from your docs in your customer’s language and sends the full conversation to your team when needed.";

export const LANDING_OG_IMAGE = `${SITE_URL}/og/og-hero.jpg`;

export const LANDING_OG_IMAGE_ALT =
	"Askly: Support that reads your docs. A path winds through green hills.";

export const LANDING_LINKS = {
	signUp: "/sign-up",
	signIn: "/sign-in",
	docs: "/docs",
	features: "/docs/features",
	setup: "/docs/integration",
	demo: "#demo",
	top: "#top",
	github: "https://github.com/senutpal/askly",
} as const;

export const SETUP_STEPS = [
	{
		title: "Add your help content",
		detail:
			"Upload PDFs and images, or let Askly crawl the pages you already have.",
	},
	{
		title: "Embed the chat widget",
		detail:
			"Add one script tag to your site. Set the greeting and suggested questions in Askly.",
	},
	{
		title: "Take over in your inbox",
		detail:
			"When someone asks for a person, your team can pick up the conversation with its history.",
	},
];

export type DemoExample = {
	name: string;
	question: string;
	reply: string;
	lang: string;
	source?: string;
	status?: string;
};

export const DEMO_EXAMPLES: DemoExample[] = [
	{
		name: "From the docs",
		question: "How do I track my order?",
		reply: "Open Orders in your account and select Track order.",
		lang: "en",
		source: "Order help · Tracking",
	},
	{
		name: "In Hindi",
		question: "मैं अपना ऑर्डर कैसे ट्रैक करूँ?",
		reply: "अपने खाते में Orders खोलें और Track order चुनें।",
		lang: "hi",
		source: "Order help · Tracking",
	},
	{
		name: "Human handoff",
		question: "Can I speak to a person?",
		reply:
			"I’ll send this conversation to our support team so you don’t have to start over.",
		lang: "en",
		status: "Conversation sent to support",
	},
	{
		name: "Voice",
		question: "Can we talk through my order?",
		reply: "Yes. You can start a voice call from the widget.",
		lang: "en",
		status: "Voice example · Transcript only",
	},
];
