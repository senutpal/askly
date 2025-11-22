import { Button } from "@workspace/ui";
import { useInfiniteScroll } from "@workspace/ui";
import { WidgetHeader } from "@/features/widget";
import { ArrowLeft, Menu } from "lucide-react";
import { useAtomValue, useSetAtom } from "jotai";
import {
  contactSessionIdAtomFamily,
  conversationIdAtom,
  organizationIdAtom,
  screenAtom,
  widgetSettingsAtom,
} from "@/features/widget";
import { useAction, useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { toUIMessages, useThreadMessages } from "@convex-dev/agent/react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AIConversation,
  AIConversationContent,
} from "@workspace/ui";
import {
  AIMessage,
  AIMessageContent,
} from "@workspace/ui";
import { AIResponse } from "@workspace/ui";
import { Form, FormField } from "@workspace/ui";
import {
  AIInput,
  AIInputSubmit,
  AIInputTextarea,
  AIInputToolbar,
  AIInputTools,
} from "@workspace/ui";
import { InfiniteScrollTrigger } from "@workspace/ui";
import { DiceBearAvatar } from "@workspace/ui";
import { useMemo } from "react";
import {
  AISuggestion,
  AISuggestions,
} from "@workspace/ui";

const formSchema = z.object({
  message: z.string().min(1, "Message is required"),
});

export default function WidgetChatScreen() {
  const setScreen = useSetAtom(screenAtom);
  const setConversationId = useSetAtom(conversationIdAtom);

  const widgetSettings = useAtomValue(widgetSettingsAtom);
  const conversationId = useAtomValue(conversationIdAtom);
  const organizationId = useAtomValue(organizationIdAtom);
  const contactSessionId = useAtomValue(
    contactSessionIdAtomFamily(organizationId || "")
  );

  const suggestions = useMemo(() => {
    if (!widgetSettings) {
      return;
    }
    return Object.keys(widgetSettings.defaultSuggestions).map((key) => {
      return widgetSettings.defaultSuggestions[
        key as keyof typeof widgetSettings.defaultSuggestions
      ];
    });
  }, [widgetSettings]);

  const conversation = useQuery(
    api.public.conversations.getOne,
    conversationId && contactSessionId
      ? { conversationId, contactSessionId }
      : "skip"
  );

  const messages = useThreadMessages(
    api.public.messages.getMany,
    conversation?.threadId && contactSessionId
      ? {
          threadId: conversation.threadId,
          contactSessionId,
        }
      : "skip",
    { initialNumItems: 20 }
  );

  const { topElementRef, handleLoadMore, canLoadMore, isLoadingMore } =
    useInfiniteScroll({
      status: messages.status,
      loadMore: messages.loadMore,
      loadSize: 10,
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
    mode: "onChange",
  });

  const onBack = () => {
    setConversationId(null);
    setScreen("selection");
  };

  const createMessage = useAction(api.public.messages.create);
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!conversation || !contactSessionId) {
      return;
    }
    form.reset();
    await createMessage({
      threadId: conversation.threadId,
      prompt: values.message,
      contactSessionId,
    });
  };

  return (
    <>
      <WidgetHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-2">
            <Button onClick={onBack} variant="transparent" size="icon">
              <ArrowLeft />
            </Button>
          </div>

          <Button variant="transparent" size="icon">
            <Menu />
          </Button>
        </div>
      </WidgetHeader>
      <AIConversation >
        <AIConversationContent>
          <InfiniteScrollTrigger
            canLoadMore={canLoadMore}
            isLoadingMore={isLoadingMore}
            onLoadMore={handleLoadMore}
            ref={topElementRef}
          />
          {toUIMessages(messages.results ?? [])?.map((message) => {
            const hasText = !!(message.text && message.text.trim().length > 0);
            const isLoading =
              message.role === "assistant" &&
              !hasText &&
              (message.status === "streaming" || message.status === "pending");
            const shouldShow = hasText || isLoading;
            if (!shouldShow) return null;

            return (
              <AIMessage
                from={message.role === "user" ? "user" : "assistant"}
                key={message.id}
              >
                <AIMessageContent>
                  {isLoading ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                      </div>
                      <span>AI is thinking...</span>
                    </div>
                  ) : (
                    <AIResponse>{message.text}</AIResponse>
                  )}
                </AIMessageContent>
                {message.role === "assistant" && (
                  <DiceBearAvatar
                    imageUrl="/logo.svg"
                    seed="assistant"
                    size={32}
                  />
                )}
              </AIMessage>
            );
          })}
        </AIConversationContent>
      </AIConversation>

      {toUIMessages(messages.results ?? [])?.length === 1 && (
        <AISuggestions className="flex w-full flex-col items-end p-2">
          {suggestions?.map((suggestion) => {
            if (!suggestion) {
              return null;
            }

            return (
              <AISuggestion
                key={suggestion}
                onClick={() => {
                  form.setValue("message", suggestion, {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true,
                  });
                  form.handleSubmit(onSubmit)();
                }}
                suggestion={suggestion}
              />
            );
          })}
        </AISuggestions>
      )}
      <Form {...form}>
        <AIInput
          className="rounded-none border-x-0 border-b-0"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            disabled={conversation?.status === "resolved"}
            name="message"
            render={({ field }) => (
              <AIInputTextarea
                disabled={conversation?.status === "resolved"}
                onChange={field.onChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    form.handleSubmit(onSubmit)();
                  }
                }}
                placeholder={
                  conversation?.status === "resolved"
                    ? "This conversation has been resolved"
                    : "Type your message..."
                }
                value={field.value}
              />
            )}
          />
          <AIInputToolbar>
            <AIInputTools />
            <AIInputSubmit
              disabled={
                conversation?.status === "resolved" || !form.formState.isValid
              }
              status="ready"
              type="submit"
            />
          </AIInputToolbar>
        </AIInput>
      </Form>
    </>
  );
}
