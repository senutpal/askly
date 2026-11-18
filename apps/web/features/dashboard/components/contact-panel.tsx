"use client";

import type { Doc } from "@workspace/backend/_generated/dataModel";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
	Button,
	DiceBearAvatar,
} from "@workspace/ui";
import { ClockIcon, GlobeIcon, MailIcon, MonitorIcon } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { useMemo } from "react";

type InfoItem = {
	label: string;
	value: string | React.ReactNode;
	className?: string;
};

function formatTimezoneOffset(offsetMinutes: number): string {
	const sign = offsetMinutes <= 0 ? "+" : "-";
	const absMinutes = Math.abs(offsetMinutes);
	const hours = Math.floor(absMinutes / 60);
	const minutes = absMinutes % 60;
	return `UTC${sign}${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}

function formatDate(timestamp?: number) {
	if (!timestamp) return "Unknown";
	return new Date(timestamp).toLocaleString();
}

type InfoSection = {
	id: string;
	icon: React.ComponentType<{ className?: string }>;
	title: string;
	items: InfoItem[];
};

function parseUserAgent(userAgent?: string) {
	if (!userAgent) {
		return {
			browser: "Unknown",
			browserVersion: "",
			os: "Unknown",
			osVersion: "",
			device: "Unknown",
			deviceModel: "",
		};
	}

	let browser = "Unknown";
	let browserVersion = "";
	let os = "Unknown";
	let osVersion = "";
	let device = "desktop";

	if (/mobile/i.test(userAgent)) {
		device = "mobile";
	} else if (/tablet|ipad/i.test(userAgent)) {
		device = "tablet";
	}

	if (/windows nt 10/i.test(userAgent)) {
		os = "Windows";
		osVersion = "10/11";
	} else if (/windows nt/i.test(userAgent)) {
		os = "Windows";
	} else if (/mac os x ([\d_]+)/i.test(userAgent)) {
		os = "macOS";
		const match = userAgent.match(/mac os x ([\d_]+)/i);
		if (match?.[1]) {
			osVersion = match[1].replace(/_/g, ".");
		}
	} else if (/android ([\d.]+)/i.test(userAgent)) {
		os = "Android";
		const match = userAgent.match(/android ([\d.]+)/i);
		if (match?.[1]) {
			osVersion = match[1];
		}
	} else if (/iphone os ([\d_]+)/i.test(userAgent)) {
		os = "iOS";
		const match = userAgent.match(/iphone os ([\d_]+)/i);
		if (match?.[1]) {
			osVersion = match[1].replace(/_/g, ".");
		}
	} else if (/linux/i.test(userAgent)) {
		os = "Linux";
	}

	if (/edg\/([\d.]+)/i.test(userAgent)) {
		browser = "Microsoft Edge";
		browserVersion = userAgent.match(/edg\/([\d.]+)/i)?.[1] ?? "";
	} else if (
		/chrome\/([\d.]+)/i.test(userAgent) &&
		!/chromium/i.test(userAgent)
	) {
		browser = "Chrome";
		browserVersion = userAgent.match(/chrome\/([\d.]+)/i)?.[1] ?? "";
	} else if (
		/safari\/([\d.]+)/i.test(userAgent) &&
		!/chrome/i.test(userAgent)
	) {
		browser = "Safari";
		browserVersion = userAgent.match(/version\/([\d.]+)/i)?.[1] ?? "";
	} else if (/firefox\/([\d.]+)/i.test(userAgent)) {
		browser = "Firefox";
		browserVersion = userAgent.match(/firefox\/([\d.]+)/i)?.[1] ?? "";
	}

	return {
		browser,
		browserVersion,
		os,
		osVersion,
		device,
		deviceModel: "",
	};
}

export const ContactPanel = ({
	contactSession,
}: {
	contactSession: Doc<"contactSessions"> | null | undefined;
}) => {
	const userAgentInfo = useMemo(
		() => parseUserAgent(contactSession?.metadata?.userAgent),
		[contactSession?.metadata?.userAgent],
	);

	const accordionSections = useMemo<InfoSection[]>(() => {
		if (!contactSession?.metadata) {
			return [];
		}

		return [
			{
				id: "device-info",
				icon: MonitorIcon,
				title: "Device Information",
				items: [
					{
						label: "Browser",
						value: `${userAgentInfo.browser}${
							userAgentInfo.browserVersion
								? ` ${userAgentInfo.browserVersion}`
								: ""
						}`,
					},
					{
						label: "OS",
						value: `${userAgentInfo.os}${
							userAgentInfo.osVersion ? ` ${userAgentInfo.osVersion}` : ""
						}`,
					},
					{
						label: "Device",
						value: `${userAgentInfo.device}${
							userAgentInfo.deviceModel
								? ` ${userAgentInfo.deviceModel.toUpperCase()}`
								: ""
						}`,
						className: "capitalize",
					},
					{
						label: "Screen",
						value: contactSession.metadata.screenResolution,
					},
					{
						label: "Viewport",
						value: contactSession.metadata.viewportSize,
					},
					{
						label: "Cookies",
						value: contactSession.metadata.cookieEnabled
							? "Enabled"
							: "Disabled",
					},
				],
			},
			{
				id: "location-info",
				icon: GlobeIcon,
				title: "Location & Language",
				items: [
					{
						label: "Location",
						value: contactSession.metadata.timezone,
					},
					{
						label: "Language",
						value: contactSession.metadata.language,
					},
					{
						label: "Timezone",
						value:
							contactSession.metadata.timezoneOffset !== undefined
								? formatTimezoneOffset(contactSession.metadata.timezoneOffset)
								: "Unknown",
					},
				],
			},
			{
				id: "session-info",
				icon: ClockIcon,
				title: "Session Details",
				items: [
					{
						label: "Session ID",
						value: String(contactSession._id),
					},
					{
						label: "Created At",
						value: formatDate(contactSession._creationTime),
					},
				],
			},
		];
	}, [contactSession, userAgentInfo]);

	if (!contactSession) {
		return null;
	}

	return (
		<div className="flex h-full w-full flex-col bg-background text-foreground">
			<div className="flex flex-col gap-y-4 p-4">
				<div className="flex items-center gap-x-2">
					<DiceBearAvatar seed={contactSession._id} size={42} />
					<div className="flex-1 overflow-hidden">
						<div className="flex items-center gap-x-2">
							<h4 className="line-clamp-1 text-sm">{contactSession.name}</h4>
						</div>
						<p className="line-clamp-1 text-xs text-muted-foreground">
							{contactSession.email}
						</p>
					</div>
				</div>
				<Button asChild className="w-full" size="lg">
					<Link href={`mailto:${contactSession.email}`}>
						<MailIcon />
						<span>Send Email</span>
					</Link>
				</Button>
			</div>

			{contactSession.metadata && accordionSections.length > 0 && (
				<Accordion
					className="w-full rounded-none border-y border-gray-200 dark:border-gray-700"
					collapsible
					type="single"
				>
					{accordionSections.map((section) => (
						<AccordionItem
							className="rounded-none outline-none has-focus-visible:z-10 has-focus-visible:border-ring has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50"
							key={section.id}
							value={section.id}
						>
							<AccordionTrigger className="flex w-full flex-1 items-start justify-between gap-4 rounded-none bg-accent/50 px-5 py-4 text-left font-medium text-sm outline-none transition-all hover:no-underline disabled:pointer-events-none disabled:opacity-50">
								<div className="flex items-center gap-4 ">
									<section.icon className="size-4 shrink-0" />
									<span>{section.title}</span>
								</div>
							</AccordionTrigger>
							<AccordionContent className="px-5 py-4">
								<div className="space-y-2 text-sm">
									{section.items.map((item) => (
										<div
											className="flex justify-between"
											key={`${section.id}-${item.label}`}
										>
											<span className="text-muted-foreground font-medium">
												{item.label} :
											</span>
											<span className={item.className}>{item.value}</span>
										</div>
									))}
								</div>
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			)}
		</div>
	);
};
