"use client";

import { api } from "@workspace/backend/_generated/api";
import { Separator } from "@workspace/ui";
import { useQuery } from "convex/react";
import { Loader2Icon } from "lucide-react";
import { motion } from "motion/react";

import { CustomizationForm } from "../customization-form";

export const CustomizationView = () => {
	const widgetSettings = useQuery(api.private.widgetSettings.getOne);
	const vapiPlugin = useQuery(api.private.plugins.getOne, { service: "vapi" });

	const isLoading = widgetSettings === undefined || vapiPlugin === undefined;

	if (isLoading) {
		return (
			<div className="flex min-h-screen flex-col items-center justify-center gap-y-2 bg-background p-8">
				<Loader2Icon className="animate-spin text-muted-foreground" />
				<p className="text-sm text-muted-foreground">Loading Settings...</p>
			</div>
		);
	}
	return (
		<div className="min-h-screen w-full bg-background dark:bg-neutral-900 p-6 md:p-12">
			<div className="mx-auto w-full max-w-6xl space-y-12">
				{/* Header Section */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="space-y-4"
				>
					<h1 className="text-4xl font-bold tracking-tight md:text-6xl mx-6">
						Make it <br />
						<span className="bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
							yours
						</span>
					</h1>
					<p className="max-w-md text-lg text-muted-foreground mx-6">
						Customize how your chat widget looks and behaves to match your brand
						perfectly.
					</p>
				</motion.div>

				<Separator className="bg-border/50" />

				<CustomizationForm
					initialData={widgetSettings}
					hasVapiPlugin={!!vapiPlugin}
				/>
			</div>
		</div>
	);
};
