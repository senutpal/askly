"use client";

import { api } from "@workspace/backend/_generated/api";
import {
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	Dropzone,
	DropzoneContent,
	DropzoneEmptyState,
	Input,
	Label,
} from "@workspace/ui";
import { useAction } from "convex/react";
import { CloudUpload, FileText, Tag } from "lucide-react";
import { useState } from "react";

interface UploadDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onFileUploaded?: () => void;
}

export const UploadDialog = ({
	open,
	onOpenChange,
	onFileUploaded,
}: UploadDialogProps) => {
	const addFile = useAction(api.private.files.addFile);
	const [uploadError, setUploadError] = useState<string | null>(null);
	const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
	const [isUploading, setIsUploading] = useState(false);
	const [uploadForm, setUploadForm] = useState({
		category: "",
		filename: "",
	});

	const handleFileDrop = (acceptedFiles: File[]) => {
		const file = acceptedFiles[0];
		if (file) {
			setUploadedFiles([file]);
			if (!uploadForm.filename) {
				setUploadForm((prev) => ({
					...prev,
					filename: file.name,
				}));
			}
		}
	};

	const handleUpload = async () => {
		setIsUploading(true);
		setUploadError(null);
		try {
			const blob = uploadedFiles[0];
			if (!blob) {
				setIsUploading(false);
				return;
			}

			const filename = uploadForm.filename || blob.name;

			await addFile({
				bytes: await blob.arrayBuffer(),
				filename,
				mimeType: blob.type || "",
				category: uploadForm.category,
			});

			onFileUploaded?.();
			handleCancel();
		} catch (error) {
			console.error(error);
			setUploadError(error instanceof Error ? error.message : "Upload failed");
		} finally {
			setIsUploading(false);
		}
	};

	const handleCancel = () => {
		onOpenChange(false);
		setUploadedFiles([]);
		setUploadForm({
			category: "",
			filename: "",
		});
	};

	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogContent className="border-border/50 bg-background/80 dark:bg-zinc-800 backdrop-blur-xl sm:max-w-lg sm:rounded-3xl">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2 text-2xl">
						<CloudUpload className="h-6 w-6 text-primary" />
						Upload Files
					</DialogTitle>
					<DialogDescription>
						Upload documents to your knowledge base for AI-Powered search and
						retrieval
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-6 py-4">
					<div className="space-y-2">
						<Label htmlFor="category" className="flex items-center gap-2">
							<Tag className="h-4 w-4 text-muted-foreground" />
							Category
						</Label>
						<Input
							className="h-12 rounded-xl bg-muted/50"
							id="category"
							onChange={(e) =>
								setUploadForm((prev) => ({
									...prev,
									category: e.target.value,
								}))
							}
							placeholder="e.g., Documentation, Support, Product"
							type="text"
							value={uploadForm.category}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="filename" className="flex items-center gap-2">
							<FileText className="h-4 w-4 text-muted-foreground" />
							Filename{" "}
							<span className="text-xs text-muted-foreground">(optional)</span>
						</Label>
						<Input
							className="h-12 rounded-xl bg-muted/50"
							id="filename"
							onChange={(e) =>
								setUploadForm((prev) => ({
									...prev,
									filename: e.target.value,
								}))
							}
							placeholder="Override default filename"
							type="text"
							value={uploadForm.filename}
						/>
					</div>
					<div className="overflow-hidden rounded-2xl border border-dashed border-border/50 bg-muted/30">
						<Dropzone
							accept={{
								"application/pdf": [".pdf"],
								"text/csv": [".csv"],
								"text/plain": [".txt"],
								"application/vnd.openxmlformats-officedocument.wordprocessingml.document":
									[".docx"],
								"image/jpeg": [".jpg", ".jpeg"],
								"image/png": [".png"],
								"image/webp": [".webp"],
								"image/gif": [".gif"],
							}}
							disabled={isUploading}
							maxFiles={1}
							onDrop={handleFileDrop}
							src={uploadedFiles}
							className="transition-colors hover:bg-muted/50"
						>
							<DropzoneEmptyState />
							<DropzoneContent />
						</Dropzone>
					</div>
				</div>
				{uploadError && (
					<p className="text-right text-sm text-destructive">{uploadError}</p>
				)}
				<DialogFooter className="gap-2">
					<Button
						disabled={isUploading}
						onClick={handleCancel}
						variant="outline"
						className="h-11 rounded-xl"
					>
						Cancel
					</Button>
					<Button
						onClick={handleUpload}
						disabled={
							uploadedFiles.length === 0 || isUploading || !uploadForm.category
						}
						className="h-11 rounded-xl shadow-lg shadow-primary/20"
					>
						{isUploading ? "Uploading..." : "Upload File"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
