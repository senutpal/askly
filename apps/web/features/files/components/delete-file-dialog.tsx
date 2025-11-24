"use client";

import { api } from "@workspace/backend/_generated/api";
import type { PublicFile } from "@workspace/backend/private/files";
import {
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@workspace/ui";
import { useMutation } from "convex/react";
import { AlertTriangle, FileIcon, Trash2 } from "lucide-react";
import { useState } from "react";

interface DeleteFileDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	file: PublicFile | null;
	onDeleted?: () => void;
}

export const DeleteFileDialog = ({
	open,
	onOpenChange,
	file,
	onDeleted,
}: DeleteFileDialogProps) => {
	const deleteFile = useMutation(api.private.files.deleteFile);

	const [isDeleting, setIsDeleting] = useState(false);

	const handleDelete = async () => {
		if (!file) {
			return;
		}

		setIsDeleting(true);

		try {
			await deleteFile({ entryId: file.id });
			onDeleted?.();
			onOpenChange(false);
		} catch (error) {
			console.error(error);
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogContent className="border-border/50 bg-background/80 dark:bg-zinc-800 backdrop-blur-xl sm:max-w-md sm:rounded-3xl">
				<DialogHeader>
					<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
						<Trash2 className="h-6 w-6" />
					</div>
					<DialogTitle className="text-2xl">Delete File</DialogTitle>
					<DialogDescription className="text-base">
						Are you sure you want to delete this file? This action cannot be
						undone.
					</DialogDescription>
				</DialogHeader>
				{file && (
					<div className="py-4">
						<div className="flex items-center gap-4 rounded-xl border border-border/50 bg-muted/30 p-4">
							<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background shadow-sm">
								<FileIcon className="h-5 w-5 text-muted-foreground" />
							</div>
							<div className="flex-1 overflow-hidden">
								<p className="truncate font-medium">{file.name}</p>
								<p className="text-xs text-muted-foreground">
									{file.type.toUpperCase()} • {file.size}
								</p>
							</div>
						</div>
						<div className="mt-4 flex items-start gap-3 rounded-xl bg-destructive/5 p-3 text-destructive">
							<AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
							<p className="text-sm font-medium">
								This file will be permanently removed from your knowledge base.
							</p>
						</div>
					</div>
				)}

				<DialogFooter className="gap-2">
					<Button
						disabled={isDeleting}
						onClick={() => onOpenChange(false)}
						variant="outline"
						className="h-11 rounded-xl"
					>
						Cancel
					</Button>
					<Button
						disabled={isDeleting || !file}
						onClick={handleDelete}
						variant="destructive"
						className="h-11 rounded-xl shadow-lg shadow-destructive/20"
					>
						{isDeleting ? "Deleting..." : "Delete File"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
