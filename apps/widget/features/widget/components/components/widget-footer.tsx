import { Button, cn } from "@workspace/ui";
import { useAtomValue, useSetAtom } from "jotai";
import { HomeIcon, InboxIcon } from "lucide-react";
import { screenAtom } from "../../atoms/widget-atoms";

export const WidgetFooter = () => {
	const screen = useAtomValue(screenAtom);
	const setScreen = useSetAtom(screenAtom);
	return (
		<footer className="flex items-center justify-around border-t border-black/5 bg-white/80 backdrop-blur-xl p-2">
			<Button
				className={cn(
					"h-12 w-12 rounded-xl transition-all duration-300",
					screen === "selection"
						? "bg-black text-white shadow-md shadow-black/10"
						: "text-gray-400 hover:bg-gray-100 hover:text-gray-600",
				)}
				onClick={() => setScreen("selection")}
				size="icon"
				variant="ghost"
			>
				<HomeIcon
					className="size-5"
					strokeWidth={screen === "selection" ? 2.5 : 2}
				/>
			</Button>

			<Button
				className={cn(
					"h-12 w-12 rounded-xl transition-all duration-300",
					screen === "inbox"
						? "bg-black text-white shadow-md shadow-black/10"
						: "text-gray-400 hover:bg-gray-100 hover:text-gray-600",
				)}
				onClick={() => setScreen("inbox")}
				size="icon"
				variant="ghost"
			>
				<InboxIcon
					className="size-5"
					strokeWidth={screen === "inbox" ? 2.5 : 2}
				/>
			</Button>
		</footer>
	);
};
