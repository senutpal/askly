"use client";

import { api } from "@workspace/backend/_generated/api";
import { useAction, useMutation, useQuery } from "convex/react";
import { useAtomValue, useSetAtom } from "jotai";
import { LoaderIcon } from "lucide-react";
import { useEffect, useState } from "react";
import {
	contactSessionIdAtomFamily,
	errorMessageAtom,
	loadingMessageAtom,
	organizationIdAtom,
	screenAtom,
	vapiSecretsAtom,
} from "@/features/widget/atoms/widget-atoms";
import { widgetSettingsAtom } from "../../atoms/widget-atoms";

type InitStep = "storage" | "org" | "session" | "settings" | "vapi" | "done";

export const WidgetLoadingScreen = ({
	organizationId,
}: {
	organizationId: string | null;
}) => {
	const [step, setStep] = useState<InitStep>("org");
	const [sessionValid, setSessionValid] = useState(false);
	const setorganizationId = useSetAtom(organizationIdAtom);
	const setErrorMessage = useSetAtom(errorMessageAtom);
	const loadingMessage = useAtomValue(loadingMessageAtom);
	const setLoadingMessage = useSetAtom(loadingMessageAtom);
	const setScreen = useSetAtom(screenAtom);
	const setWidgetSettings = useSetAtom(widgetSettingsAtom);
	const setVapiSecrets = useSetAtom(vapiSecretsAtom);
	const contactSessionId = useAtomValue(
		contactSessionIdAtomFamily(organizationId || ""),
	);

	const validateOrganization = useAction(api.public.organizations.validate);

	useEffect(() => {
		if (step !== "org") {
			return;
		}

		setLoadingMessage("Finding organization ID...");

		if (!organizationId) {
			setErrorMessage("Organization Id Required");
			setScreen("error");
			return;
		}
		setLoadingMessage("Verifying organization...");
		validateOrganization({ organizationId })
			.then((result) => {
				if (result.valid) {
					setorganizationId(organizationId);
					setStep("session");
				} else {
					setErrorMessage(result.reason || "Invalid Configuration");
					setScreen("error");
				}
			})
			.catch(() => {
				setErrorMessage("Unable to verify organization");
				setScreen("error");
			});
	}, [
		step,
		organizationId,
		setErrorMessage,
		setScreen,
		setorganizationId,
		validateOrganization,
		setLoadingMessage,
	]);

	const validateContactSession = useMutation(
		api.public.contactSessions.validate,
	);

	useEffect(() => {
		if (step !== "session") {
			return;
		}

		setLoadingMessage("Finding contact Session Id");
		if (!contactSessionId) {
			setSessionValid(false);
			setStep("settings");
			return;
		}
		setLoadingMessage("Validating Session");
		validateContactSession({
			contactSessionId,
		})
			.then((result) => {
				setSessionValid(result.valid);
				setStep("settings");
			})
			.catch(() => {
				setSessionValid(false);
				setStep("settings");
			});
	}, [step, contactSessionId, validateContactSession, setLoadingMessage]);

	const widgetSettings = useQuery(
		api.public.widgetSettings.getByOrganizationId,
		organizationId
			? {
					organizationId,
				}
			: "skip",
	);

	useEffect(() => {
		if (step !== "settings") {
			return;
		}

		setLoadingMessage("Loading Widget Settings");

		if (widgetSettings !== undefined) {
			setWidgetSettings(widgetSettings);
			setStep("vapi");
		}
	}, [step, widgetSettings, setWidgetSettings, setLoadingMessage]);

	const getVapiSecrets = useAction(api.public.secrets.getVapiSecrets);

	useEffect(() => {
		if (step !== "vapi") {
			return;
		}
		if (!organizationId) {
			setErrorMessage("Organization ID is required");
			setScreen("error");
			return;
		}
		setLoadingMessage("Loading Voice Features");
		getVapiSecrets({ organizationId })
			.then((secrets) => {
				setVapiSecrets(secrets);
				setStep("done");
			})
			.catch(() => {
				setVapiSecrets(null);
				setStep("done");
			});
	}, [
		step,
		organizationId,
		getVapiSecrets,
		setVapiSecrets,
		setLoadingMessage,
		setErrorMessage,
		setScreen,
	]);

	useEffect(() => {
		if (step !== "done") {
			return;
		}
		const hasValidSession = contactSessionId && sessionValid;
		setScreen(hasValidSession ? "selection" : "auth");
	}, [step, contactSessionId, sessionValid, setScreen]);
	return (
		<div className="flex h-full w-full flex-col items-center justify-center gap-y-6 bg-white p-6 text-center animate-in fade-in duration-700">
			<div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-black/[0.03] shadow-sm ring-1 ring-black/[0.05]">
				<LoaderIcon
					className="h-6 w-6 animate-spin text-black/70"
					strokeWidth={2}
				/>
			</div>
			<div className="space-y-2">
				<p className="text-sm font-medium text-black/50 animate-pulse tracking-wide">
					{loadingMessage || "Initializing..."}
				</p>
			</div>
		</div>
	);
};
