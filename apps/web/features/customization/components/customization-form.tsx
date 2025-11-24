"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@workspace/backend/_generated/api";
import type { Doc } from "@workspace/backend/_generated/dataModel";
import {
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	Separator,
	Textarea,
	useForm,
} from "@workspace/ui";
import { useMutation } from "convex/react";
import { motion } from "motion/react";
import { MessageSquare, Sparkles, Wand2 } from "lucide-react";
import { toast } from "sonner";
import z from "zod";
import { VapiFormField } from "./vapi-form-fields";
import { WidgetPreview } from "./widget-preview";

export const widgetSettingsSchema = z.object({
	greetMessage: z.string().min(1, "Greeting message is required"),
	defaultSuggestions: z.object({
		suggestion1: z.string().optional(),
		suggestion2: z.string().optional(),
		suggestion3: z.string().optional(),
	}),
	vapiSettings: z.object({
		assistantId: z.string().optional(),
		phoneNumber: z.string().optional(),
	}),
});

type widgetSettings = Doc<"widgetSettings">;
export type FormSchema = z.infer<typeof widgetSettingsSchema>;

interface CustomisationFormProps {
	initialData?: widgetSettings | null;
	hasVapiPlugin: boolean;
}

export const CustomizationForm = ({
	initialData,
	hasVapiPlugin,
}: CustomisationFormProps) => {
	const upsertWidgetSettings = useMutation(api.private.widgetSettings.upsert);

	const form = useForm<FormSchema>({
		resolver: zodResolver(widgetSettingsSchema),
		defaultValues: {
			greetMessage:
				initialData?.greetMessage || "Hi, How can I help you today ?",
			defaultSuggestions: {
				suggestion1: initialData?.defaultSuggestions?.suggestion1 ?? "",
				suggestion2: initialData?.defaultSuggestions?.suggestion2 ?? "",
				suggestion3: initialData?.defaultSuggestions?.suggestion3 ?? "",
			},
			vapiSettings: {
				assistantId: initialData?.vapiSettings?.assistantId ?? "",
				phoneNumber: initialData?.vapiSettings?.phoneNumber ?? "",
			},
		},
	});

	const watchedValues = form.watch();

	const onSubmit = async (values: FormSchema) => {
		try {
			const vapiSettings: widgetSettings["vapiSettings"] = {
				assistantId:
					values.vapiSettings.assistantId === "none"
						? ""
						: values.vapiSettings.assistantId,
				phoneNumber:
					values.vapiSettings.phoneNumber === "none"
						? ""
						: values.vapiSettings.phoneNumber,
			};

			await upsertWidgetSettings({
				greetMessage: values.greetMessage,
				defaultSuggestions: values.defaultSuggestions,
				vapiSettings,
			});
			toast.success("Widget settings saved");
		} catch (error) {
			console.error(error);
			toast.error("Something went wrong");
		}
	};

	return (
		<div className="grid gap-8 lg:grid-cols-2">
			{/* Left Column: Form */}
			<motion.div
				initial={{ opacity: 0, x: -20 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ duration: 0.5 }}
				className="space-y-6"
			>
				<Form {...form}>
					<form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
						{/* General Settings Card */}
						<div className="rounded-3xl border border-white/10 bg-white/5 p-1 backdrop-blur-xl dark:bg-black/20">
							<div className="rounded-[1.4rem] bg-background/50 p-6">
								<div className="mb-6 flex items-center gap-3">
									<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
										<MessageSquare className="h-5 w-5" />
									</div>
									<div>
										<h3 className="font-semibold text-lg">Chat Configuration</h3>
										<p className="text-sm text-muted-foreground">
											Customize the welcome experience
										</p>
									</div>
								</div>

								<div className="space-y-6">
									<FormField
										control={form.control}
										name="greetMessage"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Greeting Message</FormLabel>
												<FormControl>
													<Textarea
														{...field}
														placeholder="Welcome message..."
														rows={3}
														className="resize-none rounded-xl border-border/50 bg-background/50 focus:ring-primary/20"
													/>
												</FormControl>
												<FormDescription>
													The first message users see when opening the chat.
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</div>
						</div>

						{/* Suggestions Card */}
						<div className="rounded-3xl border border-white/10 bg-white/5 p-1 backdrop-blur-xl dark:bg-black/20">
							<div className="rounded-[1.4rem] bg-background/50 p-6">
								<div className="mb-6 flex items-center gap-3">
									<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
										<Sparkles className="h-5 w-5" />
									</div>
									<div>
										<h3 className="font-semibold text-lg">Quick Suggestions</h3>
										<p className="text-sm text-muted-foreground">
											Help users get started faster
										</p>
									</div>
								</div>

								<div className="space-y-4">
									{[1, 2, 3].map((num) => (
										<FormField
											key={num}
											control={form.control}
											name={`defaultSuggestions.suggestion${num}` as any}
											render={({ field }) => (
												<FormItem>
													<FormLabel>Suggestion {num}</FormLabel>
													<FormControl>
														<Input
															{...field}
															placeholder={`e.g. Question ${num}`}
															className="rounded-xl border-border/50 bg-background/50 focus:ring-primary/20"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									))}
								</div>
							</div>
						</div>

						{/* Voice Settings Card */}
						{hasVapiPlugin && (
							<div className="rounded-3xl border border-white/10 bg-white/5 p-1 backdrop-blur-xl dark:bg-black/20">
								<div className="rounded-[1.4rem] bg-background/50 p-6">
									<div className="mb-6 flex items-center gap-3">
										<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
											<Wand2 className="h-5 w-5" />
										</div>
										<div>
											<h3 className="font-semibold text-lg">Voice Settings</h3>
											<p className="text-sm text-muted-foreground">
												Powered by Vapi
											</p>
										</div>
									</div>

									<div className="space-y-6">
										<VapiFormField form={form} />
									</div>
								</div>
							</div>
						)}

						<div className="flex justify-end pt-4">
							<Button
								disabled={form.formState.isSubmitting}
								type="submit"
								size="lg"
								className="w-full rounded-xl text-base sm:w-auto"
							>
								{form.formState.isSubmitting ? "Saving..." : "Save Changes"}
							</Button>
						</div>
					</form>
				</Form>
			</motion.div>

			{/* Right Column: Preview */}
			<div className="relative hidden lg:block">
				<div className="sticky top-15">
					<WidgetPreview data={watchedValues} />
				</div>
			</div>
		</div>
	);
};
