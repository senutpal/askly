"use client";

import type { AiProviderDefinition } from "@workspace/backend/lib/aiProviders";
import { cn } from "@workspace/ui";
import { CheckCircle2 } from "lucide-react";

interface AiProviderCardProps {
	definition: AiProviderDefinition;
	isSelected: boolean;
	onSelect: () => void;
}

export const AiProviderCard = ({
	definition,
	isSelected,
	onSelect,
}: AiProviderCardProps) => {
	return (
		<button
			aria-pressed={isSelected}
			className={cn(
				"flex h-full flex-col items-start gap-2 rounded-2xl border p-5 text-left transition-colors",
				isSelected
					? "border-primary bg-primary/5"
					: "border-border/60 hover:bg-muted/40",
			)}
			onClick={onSelect}
			type="button"
		>
			<span className="flex w-full items-center justify-between gap-2">
				<span className="font-semibold">{definition.name}</span>
				{isSelected ? <CheckCircle2 className="size-4 text-primary" /> : null}
			</span>
			<span className="text-muted-foreground text-sm">
				{definition.description}
			</span>
		</button>
	);
};
