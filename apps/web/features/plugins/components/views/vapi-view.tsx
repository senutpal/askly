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
import { useMutation, useQuery } from "convex/react";
import { motion } from "motion/react";
import { Globe2, Phone, PhoneCall, Sparkles, Workflow } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { type Feature, PluginCard } from "../plugins-card";
import { VapiConnectedView } from "../vapi-connected-view";

const vapiFeatures: Feature[] = [
	{
		icon: Globe2,
		label: "Web Voice Calls",
		description: "Voice chat directly in your app",
	},
	{
		icon: Phone,
		label: "Phone Numbers",
		description: "Get dedicated business lines",
	},
	{
		icon: PhoneCall,
		label: "Outbound Calls",
		description: "Automated customer outreach",
	},
	{
		icon: Workflow,
		label: "Workflows",
		description: "Custom conversation flows",
	},
];

const formSchema = z.object({
	publicApiKey: z.string().min(1, { message: "Public API Key is required" }),
	privateApiKey: z.string().min(1, { message: "Private API Key is required" }),
});

const VapiPluginForm = ({
	open,
	setOpen,
}: {
	open: boolean;
	setOpen: (value: boolean) => void;
}) => {
	const upsertSecret = useMutation(api.private.secrets.upsert);
	const form = useForm<z.infer<typeof formSchema>>({
		defaultValues: {
			publicApiKey: "",
			privateApiKey: "",
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			await upsertSecret({
				service: "vapi",
				value: {
					publicApiKey: values.publicApiKey,
					privateApiKey: values.privateApiKey,
				},
			});
			setOpen(false);
			toast.success("API keys saved successfully!");
		} catch (err) {
			console.error(err);
			toast.error("Something went wrong");
		}
	};
	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogContent className="border-border/50 bg-background/80 backdrop-blur-xl sm:rounded-3xl">
				<DialogHeader>
					<DialogTitle className="text-2xl">Enable Vapi</DialogTitle>
					<DialogDescription>
						Your API keys are safely encrypted and stored.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						className="flex flex-col gap-y-6 mt-4"
						onSubmit={form.handleSubmit(onSubmit)}
					>
						<FormField
							control={form.control}
							name="publicApiKey"
							render={({ field }) => (
								<FormItem>
									<Label>Public API Key</Label>
									<FormControl>
										<Input
											{...field}
											placeholder="Your Public API Key"
											type="password"
											className="h-12 rounded-xl bg-muted/50"
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="privateApiKey"
							render={({ field }) => (
								<FormItem>
									<Label>Private API Key</Label>
									<FormControl>
										<Input
											{...field}
											placeholder="Your Private API Key"
											type="password"
											className="h-12 rounded-xl bg-muted/50"
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<DialogFooter>
							<Button
								disabled={form.formState.isSubmitting}
								type="submit"
								size="lg"
								className="w-full rounded-xl text-base"
							>
								{form.formState.isSubmitting ? "Connecting..." : "Connect Vapi"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

const VapiPluginRemoveForm = ({
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
				service: "vapi",
			});
			setOpen(false);
			toast.success("Vapi Plugin Removed");
		} catch (err) {
			console.error(err);
			toast.error("Something went wrong");
		} finally {
			setIsSubmitting(false);
		}
	};
	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogContent className="border-border/50 bg-background/80 dark:bg-neutral-900 backdrop-blur-xl sm:rounded-3xl">
				<DialogHeader>
					<DialogTitle className="text-2xl">Disable Vapi</DialogTitle>
					<DialogDescription>
						Are you sure you want to disconnect the Vapi plugin? This will stop
						all voice capabilities.
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

export const VapiView = () => {
	const vapiPlugin = useQuery(api.private.plugins.getOne, {
		service: "vapi",
	});
	const [connectOpen, setConnectOpen] = useState(false);
	const [removeOpen, setRemoveOpen] = useState(false);

	const handleSubmit = () => {
		if (vapiPlugin) {
			setRemoveOpen(true);
		} else {
			setConnectOpen(true);
		}
	};

	return (
		<>
			<VapiPluginForm open={connectOpen} setOpen={setConnectOpen} />
			<VapiPluginRemoveForm open={removeOpen} setOpen={setRemoveOpen} />

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
							Extend your <br />
							<span className="bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
								capabilities
							</span>
						</h1>
						<p className="max-w-md text-lg text-muted-foreground">
							Connect powerful third-party services to enhance your agent's
							functionality.
						</p>
					</motion.div>

					<Separator className="bg-border/50" />

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
					>
						{vapiPlugin ? (
							<VapiConnectedView onDisconnect={handleSubmit} />
						) : (
							<PluginCard
								onSubmit={handleSubmit}
								isDisabled={vapiPlugin === undefined}
								features={vapiFeatures}
								serviceName="Vapi"
								serviceImage="/vapi.jpg"
							/>
						)}
					</motion.div>
				</div>
			</div>
		</>
	);
};
