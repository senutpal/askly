"use client";

import { api } from "@workspace/backend/_generated/api";
import { Button } from "@workspace/ui";
import { useMutation } from "convex/react";
import { useAtomValue, useSetAtom } from "jotai";
import { ChevronRightIcon, MessageSquareText, Mic, Phone } from "lucide-react";
import { useState } from "react";
import {
	contactSessionIdAtomFamily,
	conversationIdAtom,
	errorMessageAtom,
	hasVapiSecretsAtom,
	organizationIdAtom,
	screenAtom,
	widgetSettingsAtom,
} from "../../atoms/widget-atoms";
import { WidgetFooter } from "../components/widget-footer";
import { WidgetHeader } from "../components/widget-header";

export const WidgetSelectionScreen = () => {
	const setScreen = useSetAtom(screenAtom);
	const setErrorMessage = useSetAtom(errorMessageAtom);
	const setConversationId = useSetAtom(conversationIdAtom);

	const organizationId = useAtomValue(organizationIdAtom);
	const widgetSettings = useAtomValue(widgetSettingsAtom);
	const hasVapiSecrets = useAtomValue(hasVapiSecretsAtom);
	const contactSessionId = useAtomValue(
		contactSessionIdAtomFamily(organizationId || ""),
	);

	const createConversation = useMutation(api.public.conversations.create);
	const [isPending, setIsPending] = useState(false);

	const handleNewConversation = async () => {
		if (!organizationId) {
			setScreen("error");
			setErrorMessage("Missing organization Id");
			return;
		}
		if (!contactSessionId) {
			setScreen("auth");
			return;
		}
		setIsPending(true);
		try {
			const conversationId = await createConversation({
				contactSessionId,
				organizationId,
			});
			setConversationId(conversationId);
			setScreen("chat");
		} catch {
			setScreen("auth");
		} finally {
			setIsPending(false);
		}
	};

	return (
		<>
			<WidgetHeader
				title="Hi there"
				subtitle="Let’s get you started"
				className="px-5"
			/>
			<div className="flex flex-1 flex-col gap-8 pt-5 px-6 overflow-y-auto bg-gray-50/50">
				<Button
					onClick={handleNewConversation}
					disabled={isPending}
					className="group relative flex h-auto w-full items-start gap-3 rounded-3xl border border-white bg-white p-5 shadow-sm transition-all hover:scale-[1.02] hover:shadow-md hover:shadow-black/5 active:scale-[0.98]"
					variant="ghost"
				>
					<div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-100">
						<MessageSquareText className="size-5" strokeWidth={2.5} />
					</div>
					<div className="flex w-full items-center justify-between">
						<div className="flex flex-col items-start gap-0.5">
							<span className="text-base font-semibold text-gray-900">Start Chat</span>
							<span className="text-xs font-medium text-gray-400">Chat with our AI assistant</span>
						</div>
						<ChevronRightIcon className="size-5 text-gray-300 transition-transform group-hover:translate-x-1 group-hover:text-gray-400" />
					</div>
				</Button>

				{hasVapiSecrets && widgetSettings?.vapiSettings?.assistantId && (
					<Button
						onClick={() => {
							setScreen("voice");
						}}
						disabled={isPending}
						className="group relative flex h-auto w-full  items-start gap-3 rounded-3xl border border-white bg-white p-5 shadow-sm transition-all hover:scale-[1.02] hover:shadow-md hover:shadow-black/5 active:scale-[0.98]"
						variant="ghost"
					>
						<div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 transition-colors group-hover:bg-purple-100">
							<Mic className="size-5" strokeWidth={2.5} />
						</div>
						<div className="flex w-full items-center justify-between">
							<div className="flex flex-col items-start gap-0.5">
								<span className="text-base font-semibold text-gray-900">Voice Call</span>
								<span className="text-xs font-medium text-gray-400">Talk to us directly</span>
							</div>
							<ChevronRightIcon className="size-5 text-gray-300 transition-transform group-hover:translate-x-1 group-hover:text-gray-400" />
						</div>
					</Button>
				)}
				{hasVapiSecrets && widgetSettings?.vapiSettings?.phoneNumber && (
					<Button
						onClick={() => {
							setScreen("contact");
						}}
						disabled={isPending}
						className="group relative flex h-auto w-full items-start gap-3 rounded-3xl border border-white bg-white p-5 shadow-sm transition-all hover:scale-[1.02] hover:shadow-md hover:shadow-black/5 active:scale-[0.98]"
						variant="ghost"
					>
						<div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-green-50 text-green-600 transition-colors group-hover:bg-green-100">
							<Phone className="size-5" strokeWidth={2.5} />
						</div>
						<div className="flex w-full items-center justify-between">
							<div className="flex flex-col items-start gap-0.5">
								<span className="text-base font-semibold text-gray-900">Call Us</span>
								<span className="text-xs font-medium text-gray-400">Reach our support team</span>
							</div>
							<ChevronRightIcon className="size-5 text-gray-300 transition-transform group-hover:translate-x-1 group-hover:text-gray-400" />
						</div>
					</Button>
				)}
			</div>

			<WidgetFooter />
		</>
	);
};
