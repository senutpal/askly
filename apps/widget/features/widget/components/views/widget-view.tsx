"use client";

import { useAtomValue } from "jotai";
import { screenAtom } from "@/features/widget/atoms/widget-atoms";
import WidgetAuthScreen from "@/features/widget/components/screens/widget-auth-screen";
import { WidgetErrorScreen } from "@/features/widget/components/screens/widget-error-screen";
import { WidgetLoadingScreen } from "@/features/widget/components/screens/widget-loading-screen";
import WidgetChatScreen from "../screens/widget-chat-screen";
import { WidgetContactScreen } from "../screens/widget-contact-screen";
import { WidgetInboxScreen } from "../screens/widget-inbox-screen";
import { WidgetSelectionScreen } from "../screens/widget-selection-screen";
import { WidgetVoiceScreen } from "../screens/widget-voice-screen";

interface Props {
	organizationId: string;
}

export const WidgetView = ({ organizationId }: Props) => {
	const screen = useAtomValue(screenAtom);

	const screenComponents = {
		loading: <WidgetLoadingScreen organizationId={organizationId} />,
		error: <WidgetErrorScreen />,
		selection: <WidgetSelectionScreen />,
		voice: <WidgetVoiceScreen />,
		auth: <WidgetAuthScreen />,
		inbox: <WidgetInboxScreen />,
		chat: <WidgetChatScreen />,
		contact: <WidgetContactScreen />,
	};

	return (
		<main className="flex h-full w-full flex-col overflow-hidden rounded-xl border bg-muted">
			{screenComponents[screen]}
		</main>
	);
};
