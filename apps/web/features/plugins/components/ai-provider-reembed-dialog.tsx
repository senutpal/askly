"use client";

import {
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@workspace/ui";
import { Loader2, TriangleAlert } from "lucide-react";

interface AiProviderReembedDialogProps {
	currentEmbeddingLabel: string;
	isSaving: boolean;
	nextEmbeddingLabel: string;
	onConfirm: () => void;
	onOpenChange: (open: boolean) => void;
	open: boolean;
}

export const AiProviderReembedDialog = ({
	currentEmbeddingLabel,
	isSaving,
	nextEmbeddingLabel,
	onConfirm,
	onOpenChange,
	open,
}: AiProviderReembedDialogProps) => {
	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogContent className="border-border/50 bg-background/80 backdrop-blur-xl sm:rounded-3xl">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2 text-2xl">
						<TriangleAlert className="size-5 text-amber-500" />
						Re-embed your knowledge base?
					</DialogTitle>
					<DialogDescription>
						Switching embeddings changes how vectors are produced. Existing
						vectors were created with {currentEmbeddingLabel} and cannot be
						searched with {nextEmbeddingLabel}, so those files stay unavailable
						until they are re-embedded.
					</DialogDescription>
				</DialogHeader>
				<div className="mt-2 rounded-xl border border-amber-500/30 bg-amber-50/60 p-4 text-amber-900 text-sm dark:bg-amber-950/30 dark:text-amber-100">
					The new provider is saved first. Re-upload or re-embed your files
					afterwards, then clear the warning on the AI Provider page.
				</div>
				<DialogFooter className="mt-2">
					<Button
						className="rounded-xl"
						disabled={isSaving}
						onClick={() => onOpenChange(false)}
						variant="outline"
					>
						Cancel
					</Button>
					<Button
						className="rounded-xl"
						disabled={isSaving}
						onClick={onConfirm}
					>
						{isSaving ? <Loader2 className="size-4 animate-spin" /> : null}
						Save and continue
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
