"use client";

import { Button } from "@workspace/ui";
import { WidgetHeader } from "../components/widget-header";
import {
  ChevronRightIcon,
  MessageSquareText,
  Mic,
  Phone,
  UserIcon,
} from "lucide-react";
import { useAtomValue, useSetAtom } from "jotai";
import {
  contactSessionIdAtomFamily,
  conversationIdAtom,
  errorMessageAtom,
  hasVapiSecretsAtom,
  organizationIdAtom,
  screenAtom,
  widgetSettingsAtom,
} from "../../atoms/widget-atoms";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { useState } from "react";
import { WidgetFooter } from "../components/widget-footer";

export const WidgetSelectionScreen = () => {
  const setScreen = useSetAtom(screenAtom);
  const setErrorMessage = useSetAtom(errorMessageAtom);
  const setConversationId = useSetAtom(conversationIdAtom);

  const organizationId = useAtomValue(organizationIdAtom);
  const widgetSettings = useAtomValue(widgetSettingsAtom);
  const hasVapiSecrets = useAtomValue(hasVapiSecretsAtom);
  const contactSessionId = useAtomValue(
    contactSessionIdAtomFamily(organizationId || "")
  );

  const createConversation = useMutation(api.public.conversations.create);
  const [isPending, setIsPending] = useState(false);

  const handleNewConversation = async () => {
    if (!organizationId) {
      setScreen("error");
      setErrorMessage("Missing organization Id");
      return;
    }
    if (!contactSessionId) {
      setScreen("auth");
      return;
    }
    setIsPending(true);
    try {
      const conversationId = await createConversation({
        contactSessionId,
        organizationId,
      });
      setConversationId(conversationId);
      setScreen("chat");
    } catch {
      setScreen("auth");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <WidgetHeader
        title="Hi there"
        subtitle="Let’s get you started"
        className="px-5"
      />
      <div className="flex flex-1 flex-col gap-y-6 mt-4 p-4 overflow-y-auto">
        <Button
          onClick={handleNewConversation}
          disabled={isPending}
          className="h-16 w-full justify-between"
          variant="outline"
        >
          <div className="flex items-center gap-x-2">
            <MessageSquareText className="size-4" />
            <span>Start Chat</span>
          </div>
          <ChevronRightIcon />
        </Button>

        {hasVapiSecrets && widgetSettings?.vapiSettings?.assistantId && (
          <Button
            onClick={() => {
              setScreen("voice");
            }}
            disabled={isPending}
            className="h-16 w-full justify-between"
            variant="outline"
          >
            <div className="flex items-center gap-x-2">
              <Mic className="size-4" />
              <span>Start Voice Call</span>
            </div>
            <ChevronRightIcon />
          </Button>
        )}
        {hasVapiSecrets && widgetSettings?.vapiSettings?.phoneNumber && (
          <Button
            onClick={() => {
              setScreen("contact");
            }}
            disabled={isPending}
            className="h-16 w-full justify-between"
            variant="outline"
          >
            <div className="flex items-center gap-x-2">
              <Phone className="size-4" />
              <span>Call Us</span>
            </div>
            <ChevronRightIcon />
          </Button>
        )}
      </div>

      <WidgetFooter />
    </>
  );
};
