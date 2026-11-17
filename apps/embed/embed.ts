import { EMBED_CONFIG } from "./config";
import { chatBubbleIcon, closeIcon } from "./icons";

/** The complete (and only) postMessage command set shared with the widget. */
const ASKLY_MESSAGE_TYPES = [
	"askly:open",
	"askly:close",
	"askly:toggle",
] as const;

type AsklyMessageType = (typeof ASKLY_MESSAGE_TYPES)[number];

const isAsklyMessage = (data: unknown): data is { type: AsklyMessageType } => {
	if (typeof data !== "object" || data === null) {
		return false;
	}
	const type = (data as { type?: unknown }).type;
	return (
		typeof type === "string" &&
		(ASKLY_MESSAGE_TYPES as readonly string[]).includes(type)
	);
};

(() => {
	let iframe: HTMLIFrameElement | null = null;
	let container: HTMLDivElement | null = null;
	let button: HTMLButtonElement | null = null;
	let isOpen = false;
	let iframeLoaded = false;
	let visibilityTimer: ReturnType<typeof setTimeout> | null = null;
	let organizationId: string | null = null;
	let position: "bottom-right" | "bottom-left" = EMBED_CONFIG.DEFAULT_POSITION;

	const currentScript = document.currentScript as HTMLScriptElement;
	if (currentScript) {
		organizationId = currentScript.getAttribute("data-organization-id");
		position =
			(currentScript.getAttribute("data-position") as
				| "bottom-right"
				| "bottom-left") || EMBED_CONFIG.DEFAULT_POSITION;
	} else {
		const scripts = document.querySelectorAll('script[src*="embed"]');
		const embedScript = Array.from(scripts).find((script) =>
			script.hasAttribute("data-organization-id"),
		) as HTMLScriptElement;

		if (embedScript) {
			organizationId = embedScript.getAttribute("data-organization-id");
			position =
				(embedScript.getAttribute("data-position") as
					| "bottom-right"
					| "bottom-left") || EMBED_CONFIG.DEFAULT_POSITION;
		}
	}

	if (!organizationId) {
		console.error("Askly Widget: data-organization-id attribute is required");
		return;
	}

	function init() {
		if (document.readyState === "loading") {
			document.addEventListener("DOMContentLoaded", render);
		} else {
			render();
		}
	}

	function render() {
		button = document.createElement("button");
		button.id = "askly-widget-button";
		button.type = "button";
		button.setAttribute("aria-label", "Open Askly support chat");
		button.setAttribute("aria-expanded", "false");
		button.innerHTML = chatBubbleIcon;
		button.style.cssText = `
      position: fixed;
      ${position === "bottom-right" ? "right: 20px;" : "left: 20px;"}
      bottom: 20px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: #3b82f6;
      color: white;
      border: none;
      cursor: pointer;
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 24px rgba(59, 130, 246, 0.35);
      transition: all 0.2s ease;
    `;

		button.addEventListener("click", toggleWidget);
		button.addEventListener("mouseenter", () => {
			if (button) button.style.transform = "scale(1.05)";
		});
		button.addEventListener("mouseleave", () => {
			if (button) button.style.transform = "scale(1)";
		});

		document.body.appendChild(button);

		container = document.createElement("div");
		container.id = "askly-widget-container";
		container.style.cssText = `
      position: fixed;
      ${position === "bottom-right" ? "right: 20px;" : "left: 20px;"}
      bottom: 90px;
      width: 400px;
      height: 600px;
      max-width: calc(100vw - 40px);
      max-height: calc(100vh - 110px);
      z-index: 999998;
      border-radius: 32px;
      overflow: hidden;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
      display: none;
      opacity: 0;
      transform: translateY(10px);
      transition: all 0.3s ease;
    `;

		iframe = document.createElement("iframe");
		iframe.title = "Askly support chat";
		// Defer loading the widget bundle until the launcher is first opened.
		iframe.loading = "lazy";
		iframe.setAttribute(
			"sandbox",
			"allow-scripts allow-forms allow-same-origin allow-popups allow-downloads",
		);
		iframe.style.cssText = `
      width: 100%;
      height: 100%;
      border: none;
    `;
		iframe.allow = "microphone; clipboard-read; clipboard-write";

		container.appendChild(iframe);
		document.body.appendChild(container);

		window.addEventListener("message", handleMessage);
	}

	function buildWidgetUrl(): string {
		if (!organizationId) {
			throw new Error("Askly Widget: organization id is required");
		}
		const params = new URLSearchParams();
		params.append("organizationId", organizationId);
		return `${EMBED_CONFIG.WIDGET_URL}?${params.toString()}`;
	}

	function handleMessage(event: MessageEvent) {
		let widgetOrigin: string;
		try {
			widgetOrigin = new URL(EMBED_CONFIG.WIDGET_URL).origin;
		} catch (error) {
			console.error("Askly Widget: Invalid WIDGET_URL configuration", error);
			return;
		}

		// Commands may come from scripts on the host page (same origin as this
		// script) or from the widget iframe itself (e.g. its close button).
		const fromHost =
			event.origin === window.location.origin && event.source === window;
		const fromWidget =
			event.origin === widgetOrigin &&
			iframe !== null &&
			event.source === iframe.contentWindow;
		if (!fromHost && !fromWidget) {
			return;
		}

		if (!isAsklyMessage(event.data)) {
			return;
		}

		switch (event.data.type) {
			case "askly:open":
				show();
				break;
			case "askly:close":
				hide();
				break;
			case "askly:toggle":
				toggleWidget();
				break;
		}
	}

	/** Forward the current open/close state into the widget iframe. */
	function notifyWidget(type: AsklyMessageType) {
		if (!iframeLoaded || !iframe?.contentWindow) {
			return;
		}
		try {
			iframe.contentWindow.postMessage(
				{ type },
				new URL(EMBED_CONFIG.WIDGET_URL).origin,
			);
		} catch {
			// Ignore configuration/postMessage failures; the UI still works.
		}
	}

	function toggleWidget() {
		if (isOpen) {
			hide();
		} else {
			show();
		}
	}

	function show() {
		if (container && button) {
			isOpen = true;
			if (visibilityTimer) {
				clearTimeout(visibilityTimer);
				visibilityTimer = null;
			}
			if (!iframeLoaded && iframe) {
				iframe.src = buildWidgetUrl();
				iframeLoaded = true;
			}
			container.style.display = "block";
			visibilityTimer = setTimeout(() => {
				if (container) {
					container.style.opacity = "1";
					container.style.transform = "translateY(0)";
				}
			}, 10);
			button.innerHTML = closeIcon;
			button.setAttribute("aria-label", "Close Askly support chat");
			button.setAttribute("aria-expanded", "true");
			notifyWidget("askly:open");
		}
	}

	function hide() {
		if (container && button) {
			isOpen = false;
			if (visibilityTimer) {
				clearTimeout(visibilityTimer);
				visibilityTimer = null;
			}
			container.style.opacity = "0";
			container.style.transform = "translateY(10px)";
			visibilityTimer = setTimeout(() => {
				if (container) container.style.display = "none";
			}, 300);
			button.innerHTML = chatBubbleIcon;
			button.style.background = "#3b82f6";
			button.setAttribute("aria-label", "Open Askly support chat");
			button.setAttribute("aria-expanded", "false");
			notifyWidget("askly:close");
		}
	}

	function destroy() {
		window.removeEventListener("message", handleMessage);
		if (visibilityTimer) {
			clearTimeout(visibilityTimer);
			visibilityTimer = null;
		}
		if (container) {
			container.remove();
			container = null;
			iframe = null;
		}
		if (button) {
			button.remove();
			button = null;
		}
		iframeLoaded = false;
		isOpen = false;
	}

	function reinit(newConfig: {
		organizationId?: string;
		position?: "bottom-right" | "bottom-left";
	}) {
		destroy();

		if (newConfig.organizationId) {
			organizationId = newConfig.organizationId;
		}
		if (newConfig.position) {
			position = newConfig.position;
		}

		init();
	}

	const widgetApi = {
		init: reinit,
		show,
		hide,
		destroy,
	};
	(window as typeof window & { AsklyWidget: typeof widgetApi }).AsklyWidget =
		widgetApi;

	init();
})();
