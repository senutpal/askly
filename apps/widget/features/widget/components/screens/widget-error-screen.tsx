"use client";

import { useAtomValue } from "jotai";
import { AlertTriangleIcon } from "lucide-react";
import { errorMessageAtom } from "@/features/widget/atoms/widget-atoms";
import { WidgetHeader } from "@/features/widget/components/components/widget-header";

export const WidgetErrorScreen = () => {
	const errorMessage = useAtomValue(errorMessageAtom);

	return (
		<div className="flex h-full w-full flex-col items-center justify-center gap-y-6 bg-white p-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
			<div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-500 shadow-sm ring-1 ring-red-100">
				<AlertTriangleIcon className="h-8 w-8" strokeWidth={1.5} />
			</div>
			<div className="space-y-2 max-w-[260px]">
				<h3 className="text-lg font-semibold text-gray-900 tracking-tight">Something went wrong</h3>
				<p className="text-sm text-gray-500 leading-relaxed">
					{errorMessage || "We couldn't load the widget. Please try again."}
				</p>
			</div>
		</div>
	);
};
