"use client";

import { useSetAtom } from "jotai";
import { useEffect } from "react";
import { widgetOpenAtom } from "../atoms/widget-atoms";
import { getParentOrigin, isAsklyMessage } from "../lib/widget-post-message";

/**
 * Listens for `askly:*` commands forwarded into the iframe by the embed
 * loader. Messages are accepted only from our own parent frame (and, when
 * available, only from the referrer origin).
 */
export const useAsklyParentMessages = () => {
	const setWidgetOpen = useSetAtom(widgetOpenAtom);

	useEffect(() => {
		const handleMessage = (event: MessageEvent) => {
			if (event.source !== window.parent) {
				return;
			}
			const expectedOrigin = getParentOrigin();
			if (expectedOrigin !== "*" && event.origin !== expectedOrigin) {
				return;
			}
			if (!isAsklyMessage(event.data)) {
				return;
			}

			switch (event.data.type) {
				case "askly:open":
					setWidgetOpen(true);
					break;
				case "askly:close":
					setWidgetOpen(false);
					break;
				case "askly:toggle":
					setWidgetOpen((open) => !open);
					break;
			}
		};

		window.addEventListener("message", handleMessage);
		return () => window.removeEventListener("message", handleMessage);
	}, [setWidgetOpen]);
};
