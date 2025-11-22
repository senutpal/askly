import { DocLayout } from "@/features/docs/components/DocLayout";
import { CodeBlock } from "@/features/docs/components/CodeBlock";

export default function ApiReferencePage() {
  return (
    <DocLayout
      title="API Reference"
      description="Complete API documentation for Askly widget and backend"
    >
      <div className="space-y-8">
        {/* Widget JavaScript API */}
        <section>
          <h2 className="text-3xl font-bold mb-4">Widget JavaScript API</h2>
          <p className="mb-6">
            The Askly widget exposes a global <code className="px-2 py-1 bg-muted rounded">window.AsklyWidget</code>{" "}
            object for programmatic control.
          </p>

          {/* init() */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-3">init(config)</h3>
            <div className="p-6 border rounded-lg">
              <p className="text-muted-foreground mb-4">
                Initialize or reinitialize the widget with configuration options.
              </p>
              <CodeBlock
                code={`window.AsklyWidget.init({
  organizationId: 'org_xxxxxxxx',
  position: 'bottom-right' // or 'bottom-left'
});`}
                language="javascript"
              />
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Parameters</h4>
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left py-2">Parameter</th>
                      <th className="text-left py-2">Type</th>
                      <th className="text-left py-2">Description</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b">
                      <td className="py-2">
                        <code className="px-1.5 py-0.5 bg-muted rounded">organizationId</code>
                      </td>
                      <td className="py-2">string</td>
                      <td className="py-2">Your Clerk organization ID (required)</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">
                        <code className="px-1.5 py-0.5 bg-muted rounded">position</code>
                      </td>
                      <td className="py-2">string</td>
                      <td className="py-2">"bottom-right" or "bottom-left" (optional)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* show() */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-3">show()</h3>
            <div className="p-6 border rounded-lg">
              <p className="text-muted-foreground mb-4">
                Opens the chat widget interface.
              </p>
              <CodeBlock code={`window.AsklyWidget.show();`} language="javascript" />
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">
                  <strong>Returns:</strong> void
                </p>
              </div>
            </div>
          </div>

          {/* hide() */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-3">hide()</h3>
            <div className="p-6 border rounded-lg">
              <p className="text-muted-foreground mb-4">
                Closes the chat widget interface.
              </p>
              <CodeBlock code={`window.AsklyWidget.hide();`} language="javascript" />
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">
                  <strong>Returns:</strong> void
                </p>
              </div>
            </div>
          </div>

          {/* destroy() */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-3">destroy()</h3>
            <div className="p-6 border rounded-lg">
              <p className="text-muted-foreground mb-4">
                Completely removes the widget from the page and cleans up resources.
              </p>
              <CodeBlock code={`window.AsklyWidget.destroy();`} language="javascript" />
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">
                  <strong>Returns:</strong> void
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  <strong>Note:</strong> After calling destroy(), you'll need to reload the script to
                  use the widget again.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Convex Backend API */}
        <section>
          <h2 className="text-3xl font-bold mb-4">Convex Backend API</h2>
          <p className="mb-6">
            The backend exposes various queries and mutations through Convex. These are typically
            called from the widget or dashboard apps.
          </p>

          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border-l-4 border-blue-500 rounded-r-lg mb-6">
            <p className="text-sm">
              <strong>Note:</strong> Direct backend API access requires authentication. The widget
              handles this automatically via Convex client.
            </p>
          </div>

          {/* Public Queries */}
          <h3 className="text-2xl font-semibold mb-4">Public Endpoints</h3>

          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-3">Get Widget Settings</h4>
            <div className="p-6 border rounded-lg">
              <CodeBlock
                code={`// Query widget settings for an organization
const settings = await convex.query(
  api.public.widgetSettings.get,
  { organizationId: "org_xxxxxxxx" }
);

// Returns:
{
  greetMessage: string;
  defaultSuggestions: {
    suggestion1?: string;
    suggestion2?: string;
    suggestion3?: string;
  };
  vapiSettings: {
    assistantId?: string;
    phoneNumber?: string;
  };
}`}
                language="javascript"
              />
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-3">Send Message</h4>
            <div className="p-6 border rounded-lg">
              <CodeBlock
                code={`// Send a user message
await convex.mutation(
  api.public.messages.send,
  {
    organizationId: "org_xxxxxxxx",
    threadId: "thread_abc123",
    content: "What are the admission requirements?",
    contactSessionId: "session_xyz"
  }
);`}
                language="javascript"
              />
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-3">Get Conversations</h4>
            <div className="p-6 border rounded-lg">
              <CodeBlock
                code={`// Get all conversations for an organization
const conversations = await convex.query(
  api.public.conversations.list,
  {
    organizationId: "org_xxxxxxxx",
    status: "unresolved" // optional: "unresolved" | "escalated" | "resolved"
  }
);

// Returns array of:
{
  _id: string;
  threadId: string;
  organizationId: string;
  contactSessionId: string;
  status: "unresolved" | "escalated" | "resolved";
  _creationTime: number;
}`}
                language="javascript"
              />
            </div>
          </div>
        </section>

        {/* Data Models */}
        <section>
          <h2 className="text-3xl font-bold mb-4">Data Models</h2>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">Conversation</h3>
            <div className="p-6 border rounded-lg">
              <CodeBlock
                code={`interface Conversation {
  _id: Id<"conversations">;
  threadId: string;
  organizationId: string;
  contactSessionId: Id<"contactSessions">;
  status: "unresolved" | "escalated" | "resolved";
  _creationTime: number;
}`}
                language="typescript"
              />
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">Contact Session</h3>
            <div className="p-6 border rounded-lg">
              <CodeBlock
                code={`interface ContactSession {
  _id: Id<"contactSessions">;
  name: string;
  email: string;
  organizationId: string;
  expiresAt: number;
  metadata?: {
    userAgent?: string;
    language?: string;
    platform?: string;
    screenResolution?: string;
    timezone?: string;
    // ... more metadata
  };
  _creationTime: number;
}`}
                language="typescript"
              />
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">Widget Settings</h3>
            <div className="p-6 border rounded-lg">
              <CodeBlock
                code={`interface WidgetSettings {
  _id: Id<"widgetSettings">;
  organizationId: string;
  greetMessage: string;
  defaultSuggestions: {
    suggestion1?: string;
    suggestion2?: string;
    suggestion3?: string;
  };
  vapiSettings: {
    assistantId?: string;
    phoneNumber?: string;
  };
  _creationTime: number;
}`}
                language="typescript"
              />
            </div>
          </div>
        </section>

        {/* Webhooks */}
        <section>
          <h2 className="text-3xl font-bold mb-4">Webhooks (Future)</h2>
          <div className="p-6 border rounded-lg">
            <p className="text-muted-foreground mb-4">
              Webhook support is planned for future releases. This will allow you to receive
              real-time notifications for events like:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground ml-4">
              <li>• New conversation created</li>
              <li>• Message sent/received</li>
              <li>• Conversation escalated</li>
              <li>• Conversation resolved</li>
            </ul>
          </div>
        </section>

        {/* Error Handling */}
        <section>
          <h2 className="text-3xl font-bold mb-4">Error Handling</h2>
          <div className="p-6 border rounded-lg">
            <p className="text-muted-foreground mb-4">
              All API calls should be wrapped in try-catch blocks:
            </p>
            <CodeBlock
              code={`try {
  await window.AsklyWidget.init({
    organizationId: 'org_xxxxxxxx'
  });
} catch (error) {
  console.error('Failed to initialize widget:', error);
  // Handle error appropriately
}`}
              language="javascript"
            />
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Common Errors</h4>
              <ul className="space-y-2 text-sm text-muted-foreground ml-4">
                <li>• Invalid organization ID</li>
                <li>• Network connectivity issues</li>
                <li>• Missing required parameters</li>
                <li>• Authentication failures</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Rate Limits */}
        <section>
          <h2 className="text-3xl font-bold mb-4">Rate Limits</h2>
          <div className="p-6 border rounded-lg">
            <p className="text-muted-foreground mb-4">
              Convex handles rate limiting automatically. For the free tier:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground ml-4">
              <li>• Standard API calls: handled by Convex limits</li>
              <li>• File uploads: subject to storage limits</li>
              <li>• AI requests: subject to provider rate limits</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-4">
              For production deployments with high traffic, consider upgrading your Convex plan.
            </p>
          </div>
        </section>
      </div>
    </DocLayout>
  );
}
