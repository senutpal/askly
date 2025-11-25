import { Button } from "@workspace/ui";
import { useAtomValue, useSetAtom } from "jotai";
import { ArrowLeftIcon, CheckIcon, CopyIcon, PhoneIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { screenAtom, widgetSettingsAtom } from "../../atoms/widget-atoms";
import { WidgetHeader } from "../components/widget-header";

export const WidgetContactScreen = () => {
	const setScreen = useSetAtom(screenAtom);
	const widgetSettings = useAtomValue(widgetSettingsAtom);

	const phoneNumber = widgetSettings?.vapiSettings.phoneNumber;

	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		if (!phoneNumber) {
			return (
				<div className="flex h-full flex-col items-center justify-center">
					<p className="text-muted-foreground">Phone number not configured</p>
				</div>
			);
		}
		try {
			await navigator.clipboard.writeText(phoneNumber);
			setCopied(true);
		} catch (error) {
			console.error(error);
		} finally {
			setTimeout(() => {
				setCopied(false);
			}, 2000);
		}
	};

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
					<span className="text-base font-semibold text-gray-900">Contact Us</span>
				</div>
			</WidgetHeader>
			<div className="flex flex-1 flex-col items-center justify-center gap-y-6 p-6 animate-in fade-in zoom-in-95 duration-500">
				<div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-green-50 shadow-sm ring-1 ring-green-100">
					<div className="absolute inset-0 rounded-full bg-green-100/50 animate-ping duration-[3s]" />
					<PhoneIcon className="size-10 text-green-600 relative z-10" strokeWidth={1.5} />
				</div>
				<div className="text-center space-y-1">
					<p className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full inline-block">
						Available 24/7
					</p>
					<p className="text-3xl font-bold text-gray-900 tracking-tight pt-2">
						{phoneNumber}
					</p>
					<p className="text-sm text-gray-500">Call us directly for immediate support</p>
				</div>
			</div>
			<div className="border-t border-gray-100 bg-white p-6 pb-8">
				<div className="flex flex-col items-center gap-y-3">
					<Button
						asChild
						className="w-full h-12 rounded-2xl bg-black text-white shadow-lg shadow-black/5 hover:bg-gray-900 hover:shadow-xl hover:shadow-black/10 active:scale-[0.98] transition-all"
						size="lg"
					>
						<Link href={`tel:${phoneNumber}`}>
							<PhoneIcon className="mr-2 size-4" />
							Call Now
						</Link>
					</Button>
					<Button
						className="w-full h-12 rounded-2xl border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all"
						onClick={handleCopy}
						size="lg"
						variant="outline"
					>
						{copied ? (
							<>
								<CheckIcon className="mr-2 size-4 text-green-600" />
								<span className="text-green-600 font-medium">Copied!</span>
							</>
						) : (
							<>
								<CopyIcon className="mr-2 size-4" />
								Copy Number
							</>
						)}
					</Button>
				</div>
			</div>
		</div>
	);
};
