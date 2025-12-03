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
	Form,
	FormControl,
	FormField,
	FormItem,
	Input,
	Label,
	Separator,
} from "@workspace/ui";
import { useMutation } from "convex/react";
import { useQuery } from "convex-helpers/react/cache/hooks";
import { Brain, FileText, MessageSquare, Search } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { GoogleAIConnectedView } from "../google-ai-connected-view";
import { type Feature, PluginCard } from "../plugins-card";

const googleAIFeatures: Feature[] = [
	{
		icon: Brain,
		label: "Advanced AI Models",
		description: "Access to Gemini Pro and Flash models",
	},
	{
		icon: MessageSquare,
		label: "Natural Conversations",
		description: "Intelligent chat and response generation",
	},
	{
		icon: FileText,
		label: "Document Processing",
		description: "Extract text from PDFs and images",
	},
	{
		icon: Search,
		label: "Knowledge Search",
		description: "Semantic search with embeddings",
	},
];

const formSchema = z.object({
	apiKey: z.string().min(1, { message: "API Key is required" }),
});

const GoogleAIPluginForm = ({
	open,
	setOpen,
}: {
	open: boolean;
	setOpen: (value: boolean) => void;
}) => {
	const upsertSecret = useMutation(api.private.secrets.upsert);
	const form = useForm<z.infer<typeof formSchema>>({
		defaultValues: {
			apiKey: "",
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			await upsertSecret({
				service: "google-ai",
				value: values.apiKey,
			});
			setOpen(false);
			toast.success("Gemini API key saved successfully!");
		} catch (err) {
			console.error(err);
			toast.error("Something went wrong");
		}
	};

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogContent className="border-border/50 bg-background/80 backdrop-blur-xl sm:rounded-3xl">
				<DialogHeader>
					<DialogTitle className="text-2xl">Enable Gemini</DialogTitle>
					<DialogDescription>
						Your API key is safely encrypted and stored.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						className="flex flex-col gap-y-6 mt-4"
						onSubmit={form.handleSubmit(onSubmit)}
					>
						<FormField
							control={form.control}
							name="apiKey"
							render={({ field }) => (
								<FormItem>
									<Label>Gemini API Key</Label>
									<FormControl>
										<Input
											{...field}
											placeholder="Your Gemini API Key"
											type="password"
											className="h-12 rounded-xl bg-muted/50"
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<div className="rounded-xl bg-blue-50/50 dark:bg-blue-950/20 p-4 border border-blue-200/50 dark:border-blue-800/50">
							<p className="text-sm text-blue-900 dark:text-blue-100">
								<strong>How to get your API key:</strong>
								<br />
								1. Visit{" "}
								<a
									href="https://makersuite.google.com/app/apikey"
									target="_blank"
									rel="noopener noreferrer"
									className="underline hover:text-blue-700"
								>
									Google AI Studio
								</a>
								<br />
								2. Click "Get API Key" or "Create API Key"
								<br />
								3. Copy and paste it above
							</p>
						</div>
						<DialogFooter>
							<Button
								disabled={form.formState.isSubmitting}
								type="submit"
								size="lg"
								className="w-full rounded-xl text-base"
							>
								{form.formState.isSubmitting
									? "Connecting..."
									: "Connect Gemini"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

const GoogleAIPluginRemoveForm = ({
	open,
	setOpen,
}: {
	open: boolean;
	setOpen: (value: boolean) => void;
}) => {
	const removePlugin = useMutation(api.private.plugins.remove);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const onSubmit = async () => {
		try {
			setIsSubmitting(true);
			await removePlugin({
				service: "google-ai",
			});
			setOpen(false);
			toast.success("Gemini Plugin Removed");
		} catch (err) {
			console.error(err);
			toast.error("Something went wrong");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogContent className="border-border/50 bg-neutral-200 dark:bg-neutral-800 backdrop-blur-xl sm:rounded-3xl">
				<DialogHeader>
					<DialogTitle className="text-2xl">Disable Gemini</DialogTitle>
					<DialogDescription>
						Are you sure you want to disconnect the Gemini plugin? This will
						stop all AI capabilities.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="mt-4">
					<Button
						variant="outline"
						onClick={() => setOpen(false)}
						className="rounded-xl"
					>
						Cancel
					</Button>
					<Button
						onClick={onSubmit}
						variant="destructive"
						disabled={isSubmitting}
						className="rounded-xl"
					>
						{isSubmitting ? "Disconnecting..." : "Disconnect"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export const GoogleAIView = () => {
	const googleAIPlugin = useQuery(api.private.plugins.getOne, {
		service: "google-ai",
	});
	const [connectOpen, setConnectOpen] = useState(false);
	const [removeOpen, setRemoveOpen] = useState(false);

	const handleSubmit = () => {
		if (googleAIPlugin) {
			setRemoveOpen(true);
		} else {
			setConnectOpen(true);
		}
	};

	return (
		<>
			<GoogleAIPluginForm open={connectOpen} setOpen={setConnectOpen} />
			<GoogleAIPluginRemoveForm open={removeOpen} setOpen={setRemoveOpen} />

			<div className="min-h-screen w-full bg-background dark:bg-neutral-900 p-6 md:p-12">
				<div className="mx-auto w-full max-w-6xl space-y-12">
					{/* Header Section */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className="space-y-4"
					>
						<h1 className="text-4xl font-bold tracking-tight md:text-6xl">
							Power your <br />
							<span className="bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
								intelligence
							</span>
						</h1>
						<p className="max-w-md text-lg text-muted-foreground">
							Connect Gemini to unlock advanced language models and intelligent
							capabilities.
						</p>
					</motion.div>

					<Separator className="bg-border/50" />

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
					>
						{googleAIPlugin ? (
							<GoogleAIConnectedView onDisconnect={handleSubmit} />
						) : (
							<PluginCard
								onSubmit={handleSubmit}
								isDisabled={googleAIPlugin === undefined}
								features={googleAIFeatures}
								serviceName="Gemini"
								serviceImage="/gemini.svg"
							/>
						)}
					</motion.div>
				</div>
			</div>
		</>
	);
};
