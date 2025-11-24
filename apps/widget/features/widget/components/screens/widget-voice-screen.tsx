import {
	AIConversation,
	AIConversationContent,
	AIConversationScrollButton,
	AIMessage,
	AIMessageContent,
	Button,
	cn,
} from "@workspace/ui";
import { useSetAtom } from "jotai";
import { ArrowLeftIcon, Mic, MicOff } from "lucide-react";
import { screenAtom } from "../../atoms/widget-atoms";
import { useVapi } from "../../hooks/use-vapi";
import { WidgetHeader } from "../components/widget-header";

export const WidgetVoiceScreen = () => {
	const setScreen = useSetAtom(screenAtom);
	const {
		isConnected,
		isSpeaking,
		transcript,
		endCall,
		isConnecting,
		startCall,
	} = useVapi();

	return (
		<div className="flex h-full flex-col bg-white">
			<WidgetHeader className="px-4 py-4">
				<div className="flex items-center gap-x-3">
					<Button
						onClick={() => setScreen("selection")}
						variant="ghost"
						size="icon"
						className="h-8 w-8 rounded-full hover:bg-black/5"
					>
						<ArrowLeftIcon className="size-4 text-gray-600" />
					</Button>
					<span className="text-base font-semibold text-gray-900">Voice Call</span>
				</div>
			</WidgetHeader>
			{transcript.length > 0 ? (
				<AIConversation className="h-full bg-white">
					<AIConversationContent className="px-4 py-4 gap-y-4">
						{transcript.map((message, index) => (
							<AIMessage
								from={message.role}
								key={`${message.role}-${index}-${message.text}`}
								className="gap-3"
							>
								<AIMessageContent
									className={
										message.role === "user"
											? "bg-black text-white rounded-2xl rounded-tr-sm px-4 py-2.5 shadow-sm text-[15px] leading-relaxed"
											: "bg-gray-100 text-gray-900 rounded-2xl rounded-tl-sm px-4 py-2.5 text-[15px] leading-relaxed"
									}
								>
									{message.text}
								</AIMessageContent>
                
							</AIMessage>
						))}
					</AIConversationContent>
					<AIConversationScrollButton />
				</AIConversation>
			) : (
				<div className="flex flex-1 h-full flex-col items-center justify-center gap-y-8 p-6 animate-in fade-in zoom-in-95 duration-500">
					<div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-purple-50 shadow-sm ring-1 ring-purple-100">
						{isConnected && !isSpeaking && (
							<div className="absolute inset-0 rounded-full bg-purple-100/50 animate-pulse duration-[2s]" />
						)}
						{isSpeaking && (
							<div className="absolute inset-0 rounded-full bg-purple-200/50 animate-ping duration-[1.5s]" />
						)}
						<Mic className="size-12 text-purple-600 relative z-10" strokeWidth={1.5} />
					</div>
					<div className="text-center space-y-1">
						<p className="text-lg font-semibold text-gray-900">
							{isConnected
								? isSpeaking
									? "Assistant is speaking..."
									: "Listening..."
								: "Start a voice call"}
						</p>
						<p className="text-sm text-gray-500">
							{isConnected
								? "Speak naturally to interact"
								: "Talk to our AI assistant in real-time"}
						</p>
					</div>
				</div>
			)}
			<div className="border-t border-gray-100 bg-white p-6 pb-8">
				<div className="flex flex-col items-center gap-y-4">
					<div className="flex w-full justify-center">
						{isConnected ? (
							<Button
								className="w-full h-12 rounded-2xl bg-red-500 text-white shadow-lg shadow-red-500/20 hover:bg-red-600 hover:shadow-xl hover:shadow-red-500/30 active:scale-[0.98] transition-all"
								size="lg"
								onClick={() => endCall()}
							>
								<MicOff className="mr-2 size-4" />
								End Call
							</Button>
						) : (
							<Button
								disabled={isConnecting}
								size="lg"
								onClick={() => startCall()}
								className="w-full h-12 rounded-2xl bg-black text-white shadow-lg shadow-black/5 hover:bg-gray-900 hover:shadow-xl hover:shadow-black/10 active:scale-[0.98] transition-all"
							>
								{isConnecting ? (
									"Connecting..."
								) : (
									<>
										<Mic className="mr-2 size-4" />
										Start Call
									</>
								)}
							</Button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};
