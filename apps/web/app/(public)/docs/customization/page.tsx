import { DocLayout } from "@/modules/docs/components/DocLayout";

export default function CustomizationPage() {
  return (
    <DocLayout
      title="Customization"
      description="Customize widget appearance, behavior, and configuration"
    >
      <div className="space-y-8">
        {/* Widget Settings */}
        <section>
          <h2 className="text-3xl font-bold mb-4">Widget Settings</h2>
          <p className="mb-4">
            Customize your Askly widget from the dashboard to match your brand and requirements.
            Navigate to <strong>Customization</strong> in your dashboard to access these settings.
          </p>
        </section>

        {/* Greeting Message */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Greeting Message</h2>
          <div className="p-6 border rounded-lg">
            <p className="mb-4 text-muted-foreground">
              The first message users see when they open the widget. Make it welcoming and helpful!
            </p>
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold mb-2">Examples</h4>
                <div className="space-y-2">
                  <div className="p-3 bg-muted/50 rounded text-sm">
                    "Hi! 👋 I'm here to help answer your questions about our campus. What would you
                    like to know?"
                  </div>
                  <div className="p-3 bg-muted/50 rounded text-sm">
                    "नमस्ते! मैं आपकी सहायता के लिए यहाँ हूँ। आप क्या जानना चाहेंगे?" (Hindi)
                  </div>
                  <div className="p-3 bg-muted/50 rounded text-sm">
                    "Welcome to campus support! Ask me anything about admissions, courses, fees, or
                    facilities."
                  </div>
                </div>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border-l-4 border-blue-500 rounded-r-lg">
                <p className="text-sm">
                  <strong>Tip:</strong> Keep it concise (1-2 sentences) and indicate what kinds of
                  questions can be asked.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Suggestions */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Quick Suggestions</h2>
          <div className="p-6 border rounded-lg">
            <p className="mb-4 text-muted-foreground">
              Pre-defined question buttons that appear in the chat. Great for guiding users to
              commonly asked questions.
            </p>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Configuration</h4>
                <ul className="space-y-2 text-sm text-muted-foreground ml-4">
                  <li>• You can configure up to 3 suggestions</li>
                  <li>• Suggestions appear as clickable buttons</li>
                  <li>• Users can click to instantly send that question</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Example Suggestions</h4>
                <div className="space-y-2">
                  <div className="p-3 bg-muted/50 rounded text-sm">
                    "What are the admission requirements?"
                  </div>
                  <div className="p-3 bg-muted/50 rounded text-sm">
                    "How do I pay my fees?"
                  </div>
                  <div className="p-3 bg-muted/50 rounded text-sm">
                    "Where is the library located?"
                  </div>
                </div>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-950/20 border-l-4 border-green-500 rounded-r-lg">
                <p className="text-sm">
                  <strong>Best Practice:</strong> Use your analytics to identify the most common
                  questions and add them as suggestions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Voice Assistant */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Voice Assistant Configuration</h2>
          <div className="p-6 border rounded-lg">
            <p className="mb-4 text-muted-foreground">
              Configure voice call functionality powered by Vapi. This allows students to call and
              speak with the AI assistant.
            </p>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Required: Vapi Assistant ID</h4>
                <ul className="space-y-2 text-sm text-muted-foreground ml-4">
                  <li>• Create an assistant in your Vapi dashboard</li>
                  <li>• Configure voice, language, and prompt</li>
                  <li>• Copy the Assistant ID</li>
                  <li>• Paste it in Askly customization settings</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Optional: Phone Number</h4>
                <p className="text-sm text-muted-foreground">
                  If you have a Vapi phone number configured, users can also call it directly. Add
                  the phone number in the customization settings.
                </p>
              </div>
              <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border-l-4 border-yellow-500 rounded-r-lg">
                <p className="text-sm">
                  <strong>Note:</strong> Voice calls require a Vapi subscription. The widget will
                  hide the voice call button if no assistant ID is configured.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Knowledge Base */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Knowledge Base Management</h2>
          <p className="mb-4">
            The quality of AI responses depends on the knowledge base. Add comprehensive information
            about your campus.
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="p-6 border rounded-lg">
              <h4 className="font-semibold mb-3">📄 File Uploads</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Upload PDFs, documents, and other files containing campus information.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground ml-4">
                <li>• Admission brochures</li>
                <li>• Fee structures</li>
                <li>• Course catalogs</li>
                <li>• Campus maps</li>
                <li>• FAQs and policies</li>
              </ul>
            </div>

            <div className="p-6 border rounded-lg">
              <h4 className="font-semibold mb-3">🌐 Web Crawling</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Automatically extract content from your campus website.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground ml-4">
                <li>• Enter website URL</li>
                <li>• Set crawl depth</li>
                <li>• Choose content types</li>
                <li>• AI indexes all pages</li>
              </ul>
            </div>
          </div>

          <div className="mt-4 p-4 bg-green-50 dark:bg-green-950/20 border-l-4 border-green-500 rounded-r-lg">
            <p className="text-sm">
              <strong>Pro Tip:</strong> The more comprehensive your knowledge base, the better the AI
              responses. Regularly update it with new information.
            </p>
          </div>
        </section>

        {/* Organization Branding */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Organization Settings</h2>
          <div className="p-6 border rounded-lg">
            <p className="mb-4 text-muted-foreground">
              Configure organization-level settings in Clerk dashboard:
            </p>
            <div className="space-y-3">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-2">Organization Name</h4>
                <p className="text-sm text-muted-foreground">
                  The name of your campus/institution. This appears in the dashboard and helps
                  identify your organization.
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-2">Team Members</h4>
                <p className="text-sm text-muted-foreground">
                  Invite staff members to access the dashboard. Manage conversations, view analytics,
                  and configure settings together.
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-2">Roles & Permissions</h4>
                <p className="text-sm text-muted-foreground">
                  Use Clerk's role-based access control to grant different permissions to team
                  members (admin, member, etc.).
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Widget Positioning */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Widget Positioning</h2>
          <div className="p-6 border rounded-lg">
            <p className="mb-4 text-muted-foreground">
              Control where the widget appears on your website using the{" "}
              <code className="px-1.5 py-0.5 bg-muted rounded">data-position</code> attribute in the
              embed script:
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-2">Bottom Right</h4>
                <p className="text-sm text-muted-foreground mb-2">Default position, recommended for most sites.</p>
                <code className="text-xs">data-position="bottom-right"</code>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-2">Bottom Left</h4>
                <p className="text-sm text-muted-foreground mb-2">Use if right side is occupied.</p>
                <code className="text-xs">data-position="bottom-left"</code>
              </div>
            </div>
          </div>
        </section>

        {/* Advanced Customization */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Advanced Customization</h2>
          <div className="space-y-4">
            <div className="p-6 border rounded-lg">
              <h4 className="font-semibold mb-3">Custom CSS (Future)</h4>
              <p className="text-sm text-muted-foreground">
                Currently, the widget uses default styling. Custom CSS support is planned for future
                releases, allowing you to match your brand colors and design.
              </p>
            </div>

            <div className="p-6 border rounded-lg">
              <h4 className="font-semibold mb-3">Multi-Language Support</h4>
              <p className="text-sm text-muted-foreground">
                Askly automatically detects the user's language and responds accordingly. The AI
                supports English, Hindi, and major regional Indian languages out of the box.
              </p>
            </div>

            <div className="p-6 border rounded-lg">
              <h4 className="font-semibold mb-3">Custom AI Prompts (Backend)</h4>
              <p className="text-sm text-muted-foreground mb-2">
                For advanced users, you can customize the AI system prompts by editing the backend
                code:
              </p>
              <code className="text-xs">packages/backend/convex/private/chat.ts</code>
            </div>
          </div>
        </section>

        {/* Testing Changes */}
        <section className="mt-12 p-6 bg-muted/50 border rounded-lg">
          <h3 className="text-xl font-semibold mb-3">Testing Your Customizations</h3>
          <p className="text-muted-foreground mb-4">
            After making changes:
          </p>
          <ol className="space-y-2 text-sm ml-6">
            <li>1. Save settings in the dashboard</li>
            <li>2. Open your website with the embedded widget</li>
            <li>3. Refresh the page (may need to clear cache)</li>
            <li>4. Click the widget to see updated greeting and suggestions</li>
            <li>5. Test voice call if configured</li>
          </ol>
        </section>
      </div>
    </DocLayout>
  );
}
