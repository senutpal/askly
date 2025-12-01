"use client";

import { Button } from "@workspace/ui";
import { MessageCircle, Send, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { FormSchema } from "./customization-form";

interface WidgetPreviewProps {
	data: Partial<FormSchema>;
}

export const WidgetPreview = ({ data }: WidgetPreviewProps) => {
	const [isOpen, setIsOpen] = useState(true);
	const [messages, setMessages] = useState<
		{ role: "agent" | "user"; content: string }[]
	>([]);

	useEffect(() => {
		if (data.greetMessage && data.greetMessage.trim().length > 0) {
			setMessages([{ role: "agent", content: data.greetMessage }]);
		} else {
			setMessages([]);
		}
	}, [data.greetMessage]);

	return (
		<div className="relative mx-auto h-[600px] w-[350px]">
			<div className="relative flex h-full flex-col">
				<AnimatePresence>
					{isOpen && (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 20 }}
							className="absolute bottom-8 right-4 z-10 flex w-[300px] flex-col overflow-hidden rounded-2xl border bg-background shadow-xl"
						>
							<div className="flex items-center justify-between bg-gradient-to-b from-blue-400 to-blue-600 p-4">
								<div className="flex items-center gap-2">
									<div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
										<Image
											src="/logo.svg"
											alt="logo"
											width={24}
											height={24}
											className="invert"
										/>
									</div>
									<div>
										<p className="font-semibold text-sm text-white">Askly</p>
									</div>
								</div>
								<button
									onClick={() => setIsOpen(false)}
									className="text-white/80 hover:text-white"
								>
									<X className="h-5 w-5" />
								</button>
							</div>

							<div className="flex h-[300px] flex-col gap-4 overflow-y-auto p-4">
								{messages.map((msg, idx) => (
									<div
										key={idx}
										className={`max-w-[80%] rounded-2xl p-3 text-sm ${
											msg.role === "agent"
												? "bg-muted text-foreground rounded-tl-none"
												: "bg-primary text-primary-foreground ml-auto rounded-tr-none"
										}`}
									>
										{msg.content}
									</div>
								))}
							</div>

							{/* Suggestions */}
							<div className="flex flex-col gap-2 overflow-x-auto p-2 px-4 pb-0 scrollbar-hide">
								{Object.values(data.defaultSuggestions || {}).map(
									(suggestion, idx) =>
										suggestion && (
											<button
												key={idx}
												className="whitespace-nowrap rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground hover:bg-muted"
											>
												{suggestion}
											</button>
										),
								)}
							</div>

							{/* Input Area */}
							<div className="p-4">
								<div className="flex items-center gap-2 rounded-full border bg-background p-1 pl-4">
									<input
										className="flex-1 bg-transparent text-sm outline-none"
										placeholder="Type a message..."
										disabled
									/>
									<Button size="icon" className="h-8 w-8 rounded-full">
										<Send className="h-4 w-4" />
									</Button>
								</div>
							</div>
						</motion.div>
					)}
				</AnimatePresence>

				{/* Toggle Button */}
			</div>
			{!isOpen && (
				<motion.button
					initial={{ scale: 0 }}
					animate={{ scale: 1 }}
					whileHover={{ scale: 1.1 }}
					onClick={() => setIsOpen(true)}
					className="absolute bottom-0 right-0 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg"
				>
					<MessageCircle className="h-7 w-7" />
				</motion.button>
			)}
		</div>
	);
};
