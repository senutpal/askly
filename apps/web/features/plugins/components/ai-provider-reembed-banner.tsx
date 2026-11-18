"use client";

import { api } from "@workspace/backend/_generated/api";
import {
	Alert,
	AlertDescription,
	AlertTitle,
	Button,
	Spinner,
} from "@workspace/ui";
import { useMutation } from "convex/react";
import { TriangleAlert } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { getErrorMessage } from "../lib/convex-error";

export const AiProviderReembedBanner = () => {
	const confirmReembed = useMutation(api.private.aiSettings.confirmReembed);
	const [isConfirming, setIsConfirming] = useState(false);

	const onConfirm = async () => {
		try {
			setIsConfirming(true);
			await confirmReembed({});
			toast.success("Re-embed warning cleared");
		} catch (error) {
			toast.error(getErrorMessage(error, "Something went wrong"));
		} finally {
			setIsConfirming(false);
		}
	};

	return (
		<Alert className="border-amber-500/40 bg-amber-50/60 text-amber-900 dark:bg-amber-950/30 dark:text-amber-100">
			<TriangleAlert />
			<AlertTitle>Knowledge base re-embedding required</AlertTitle>
			<AlertDescription className="text-amber-800 dark:text-amber-200">
				<p>
					The embedding model changed. Knowledge base search keeps using the
					previous vectors, so new files may not be found until the knowledge
					base is re-embedded.
				</p>
				<Button
					className="mt-2 border-amber-500/40 text-amber-900 hover:bg-amber-100/60 dark:text-amber-100 dark:hover:bg-amber-900/40"
					disabled={isConfirming}
					onClick={onConfirm}
					size="sm"
					variant="outline"
				>
					{isConfirming ? <Spinner /> : null}
					Mark as re-embedded
				</Button>
			</AlertDescription>
		</Alert>
	);
};
