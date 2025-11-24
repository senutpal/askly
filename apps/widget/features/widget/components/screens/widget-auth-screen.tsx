import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@workspace/backend/_generated/api";
import type { Doc } from "@workspace/backend/_generated/dataModel";
import {
	Button,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
} from "@workspace/ui";
import { useMutation } from "convex/react";
import { useAtomValue, useSetAtom } from "jotai";
import { useForm } from "react-hook-form";
import z from "zod";
import { WidgetHeader } from "@/features/widget/components/components/widget-header";
import {
	contactSessionIdAtomFamily,
	organizationIdAtom,
	screenAtom,
} from "../../atoms/widget-atoms";

const formSchema = z.object({
	name: z.string().min(1, "Name is required"),
	email: z.email("Invalid email address"),
});

export default function WidgetAuthScreen() {
	const setScreen = useSetAtom(screenAtom);
	const organizationId = useAtomValue(organizationIdAtom);
	const setContactSessionId = useSetAtom(
		contactSessionIdAtomFamily(organizationId || ""),
	);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			email: "",
		},
	});

	const createContactSession = useMutation(api.public.contactSessions.create);

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		if (!organizationId) {
			console.warn("No organizationId, skipping");
			return;
		}

		const metadata: Doc<"contactSessions">["metadata"] =
			typeof window !== "undefined"
				? {
						userAgent: navigator.userAgent,
						language: navigator.language,
						languages: navigator.languages?.join(","),
						platform: navigator.platform,
						vendor: navigator.vendor,
						screenResolution: `${screen.width}×${screen.height}`,
						viewportSize: `${window.innerWidth}×${window.innerHeight}`,
						timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
						timezoneOffset: new Date().getTimezoneOffset(),
						cookieEnabled: navigator.cookieEnabled,
						referrer: document.referrer || "direct",
						currentUrl: window.location.href,
					}
				: {};

		try {
			console.log("Creating contact session...");
			const contactSessionId = await createContactSession({
				...values,
				organizationId,
				metadata,
			});

			setContactSessionId(contactSessionId);
			setScreen("selection");
		} catch (err) {
			console.error("Failed to create contact session:", err);
		}
	};

	return (
		<div className="flex h-full flex-col bg-white">
			<WidgetHeader
				title="Welcome to Askly"
				subtitle="Please enter your details to continue"
			/>
			<div className="flex-1 overflow-y-auto p-6">
				<Form {...form}>
					<form
						className="flex flex-col gap-y-5 animate-in fade-in slide-in-from-bottom-4 duration-700"
						onSubmit={form.handleSubmit(onSubmit)}
					>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem className="space-y-1.5">
									<FormLabel className="text-xs font-medium text-gray-500 ml-1">
										Name
									</FormLabel>
									<FormControl>
										<Input
											className="h-11 rounded-2xl border-gray-200 bg-gray-50 px-4 text-sm transition-all focus:border-black/10 focus:bg-white focus:ring-4 focus:ring-black/[0.03]"
											placeholder="John Doe"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem className="space-y-1.5">
									<FormLabel className="text-xs font-medium text-gray-500 ml-1">
										Email
									</FormLabel>
									<FormControl>
										<Input
											className="h-11 rounded-2xl border-gray-200 bg-gray-50 px-4 text-sm transition-all focus:border-black/10 focus:bg-white focus:ring-4 focus:ring-black/[0.03]"
											placeholder="john@example.com"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button
							type="submit"
							size="lg"
							disabled={form.formState.isSubmitting}
							className="mt-4 h-11 w-full rounded-2xl bg-black text-sm font-medium text-white shadow-lg shadow-black/5 hover:bg-gray-900 hover:shadow-xl hover:shadow-black/10 active:scale-[0.98] transition-all"
						>
							{form.formState.isSubmitting ? "Connecting..." : "Continue"}
						</Button>
					</form>
				</Form>
			</div>
		</div>
	);
}
