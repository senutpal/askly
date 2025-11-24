import { toUIMessages, useThreadMessages } from "@convex-dev/agent/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@workspace/backend/_generated/api";
import {
	AIConversation,
	AIConversationContent,
	AIInput,
	AIInputSubmit,
	AIInputTextarea,
	AIInputToolbar,
	AIInputTools,
	AIMessage,
	AIMessageContent,
	AIResponse,
	AISuggestion,
	AISuggestions,
	Button,
	DiceBearAvatar,
	Form,
	FormField,
	InfiniteScrollTrigger,
	useInfiniteScroll,
} from "@workspace/ui";
import { useAction, useQuery } from "convex/react";
import { useAtomValue, useSetAtom } from "jotai";
import { ArrowLeft, Menu } from "lucide-react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
	contactSessionIdAtomFamily,
	conversationIdAtom,
	organizationIdAtom,
	screenAtom,
	WidgetHeader,
	widgetSettingsAtom,
} from "@/features/widget";

const formSchema = z.object({
	message: z.string().min(1, "Message is required"),
});

export default function WidgetChatScreen() {
	const setScreen = useSetAtom(screenAtom);
	const setConversationId = useSetAtom(conversationIdAtom);

	const widgetSettings = useAtomValue(widgetSettingsAtom);
	const conversationId = useAtomValue(conversationIdAtom);
	const organizationId = useAtomValue(organizationIdAtom);
	const contactSessionId = useAtomValue(
		contactSessionIdAtomFamily(organizationId || ""),
	);

	const suggestions = useMemo(() => {
		if (!widgetSettings) {
			return;
		}
		return Object.keys(widgetSettings.defaultSuggestions).map((key) => {
			return widgetSettings.defaultSuggestions[
				key as keyof typeof widgetSettings.defaultSuggestions
			];
		});
	}, [widgetSettings]);

	const conversation = useQuery(
		api.public.conversations.getOne,
		conversationId && contactSessionId
			? { conversationId, contactSessionId }
			: "skip",
	);

	const messages = useThreadMessages(
		api.public.messages.getMany,
		conversation?.threadId && contactSessionId
			? {
					threadId: conversation.threadId,
					contactSessionId,
				}
			: "skip",
		{ initialNumItems: 20 },
	);

	const { topElementRef, handleLoadMore, canLoadMore, isLoadingMore } =
		useInfiniteScroll({
			status: messages.status,
			loadMore: messages.loadMore,
			loadSize: 10,
		});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			message: "",
		},
		mode: "onChange",
	});

	const onBack = () => {
		setConversationId(null);
		setScreen("selection");
	};

	const createMessage = useAction(api.public.messages.create);
	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		if (!conversation || !contactSessionId) {
			return;
		}
		form.reset();
		await createMessage({
			threadId: conversation.threadId,
			prompt: values.message,
			contactSessionId,
		});
	};

	return (
		<div className="flex h-full flex-col bg-white">
			<WidgetHeader className="px-4 py-3  bg-white/90 backdrop-blur-md sticky top-0 z-20">
				<div className="flex items-center justify-between w-full">
					<div className="flex items-center gap-x-2">
						<Button
							onClick={onBack}
							variant="ghost"
							size="icon"
							className="h-9 w-9 rounded-full hover:bg-black/5 transition-colors"
						>
							<ArrowLeft className="size-5 text-gray-700" />
						</Button>
						<div className="flex items-center">
							<span className="text-sm font-semibold text-gray-900 mr-2">Askly</span>
							<span className="text-[10px] font-medium text-green-500 flex items-center gap-1">
								<span className="block h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
								Online
							</span>
						</div>
					</div>

					<Button
						variant="ghost"
						size="icon"
						className="h-9 w-9 rounded-full hover:bg-black/5 transition-colors"
					>
						<Menu className="size-5 text-gray-700" />
					</Button>
				</div>
			</WidgetHeader>
			<AIConversation className="bg-white">
				<AIConversationContent className="px-4 py-4 gap-y-6">
					<InfiniteScrollTrigger
						canLoadMore={canLoadMore}
						isLoadingMore={isLoadingMore}
						onLoadMore={handleLoadMore}
						ref={topElementRef}
					/>
					{toUIMessages(messages.results ?? [])?.map((message) => {
						const hasText = !!(message.text && message.text.trim().length > 0);
						const isLoading =
							message.role === "assistant" &&
							!hasText &&
							(message.status === "streaming" || message.status === "pending");
						const shouldShow = hasText || isLoading;
						if (!shouldShow) return null;

						return (
							<AIMessage
								from={message.role === "user" ? "user" : "assistant"}
								key={message.id}
								className="gap-3"
							>
								
								<AIMessageContent
									className={
										message.role === "user"
											? "bg-black text-white rounded-2xl rounded-tr-sm px-4 py-2.5 shadow-sm text-[15px] leading-relaxed"
											: "bg-gray-100 text-gray-900 rounded-2xl rounded-tl-sm px-4 py-2.5 text-[15px] leading-relaxed"
									}
								>
									{isLoading ? (
										<div className="flex items-center gap-2 text-gray-500">
											<div className="flex space-x-1">
												<div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.3s]" />
												<div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.15s]" />
												<div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" />
											</div>
										</div>
									) : (
										<AIResponse>{message.text}</AIResponse>
									)}
                </AIMessageContent>
                {message.role === "assistant" && (
									<div className="mt-1">
										<DiceBearAvatar
											imageUrl="/logo.svg"
											seed="assistant"
											size={32}
											className="h-8 w-8 rounded-full bg-gray-100 ring-2 ring-white"
										/>
									</div>
								)}
							</AIMessage>
						);
					})}
				</AIConversationContent>
			</AIConversation>

			{toUIMessages(messages.results ?? [])?.length === 1 && (
				<AISuggestions className="flex w-full flex-col items-end p-4 gap-2">
					{suggestions?.map((suggestion) => {
						if (!suggestion) {
							return null;
						}

						return (
							<AISuggestion
								key={suggestion}
								onClick={() => {
									form.setValue("message", suggestion, {
										shouldValidate: true,
										shouldDirty: true,
										shouldTouch: true,
									});
									form.handleSubmit(onSubmit)();
								}}
								suggestion={suggestion}
								className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 rounded-xl px-4 py-2 text-sm shadow-sm transition-all"
							/>
						);
					})}
				</AISuggestions>
			)}
			<div className="p-4 bg-white/80 backdrop-blur-md border-t border-gray-100">
				<Form {...form}>
					<AIInput
						className="rounded-2xl border border-gray-200 bg-white shadow-lg shadow-black/5 focus-within:border-black/10 focus-within:ring-4 focus-within:ring-black/[0.03] transition-all overflow-hidden"
						onSubmit={form.handleSubmit(onSubmit)}
					>
						<FormField
							control={form.control}
							disabled={conversation?.status === "resolved"}
							name="message"
							render={({ field }) => (
								<AIInputTextarea
									disabled={conversation?.status === "resolved"}
									onChange={field.onChange}
									onKeyDown={(e) => {
										if (e.key === "Enter" && !e.shiftKey) {
											form.handleSubmit(onSubmit)();
										}
									}}
									placeholder={
										conversation?.status === "resolved"
											? "This conversation has been resolved"
											: "Type a message..."
									}
									value={field.value}
									className="min-h-[44px] py-3 px-4 text-[15px] placeholder:text-gray-400"
								/>
							)}
						/>
						<AIInputToolbar className="pr-2 pb-2">
							<AIInputTools className="text-gray-400 hover:text-gray-600" />
							<AIInputSubmit
								disabled={
									conversation?.status === "resolved" || !form.formState.isValid
								}
								status="ready"
								type="submit"
								className="bg-black text-white hover:bg-gray-800 rounded-xl h-8 w-8 p-0 flex items-center justify-center transition-colors"
							/>
						</AIInputToolbar>
					</AIInput>
				</Form>
			</div>
		</div>
	);
}
