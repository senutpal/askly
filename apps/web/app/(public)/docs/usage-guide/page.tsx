import { DocLayout } from "@/features/docs/components/DocLayout";

export default function UsageGuidePage() {
  return (
    <DocLayout
      title="Usage Guide"
      description="Complete guide for administrators to manage Askly"
    >
      <div className="space-y-8">
        {/* Getting Started */}
        <section>
          <h2 className="text-3xl font-bold mb-4">Administrator Guide</h2>
          <p className="text-lg mb-6">
            This guide covers everything you need to know to effectively manage Askly for your
            campus. From setting up your organization to monitoring conversations and analytics.
          </p>
        </section>

        {/* Creating Organization */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Creating Your Organization</h2>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Step 1: Sign Up</h4>
              <p className="text-sm text-muted-foreground">
                Navigate to your Askly dashboard and create an account using email or social login
                (Google, GitHub).
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Step 2: Create Organization</h4>
              <p className="text-sm text-muted-foreground">
                You'll be prompted to create or select an organization. Enter your campus/institution
                name and complete the setup.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Step 3: Get Organization ID</h4>
              <p className="text-sm text-muted-foreground">
                Go to Settings → Organization. Copy your organization ID - you'll need this for the
                widget embed code.
              </p>
            </div>
          </div>
        </section>

        {/* Managing Knowledge Base */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">2. Managing Knowledge Base</h2>
          <p className="mb-4">
            The knowledge base is the foundation of intelligent responses. Add comprehensive
            information to ensure accurate answers.
          </p>

          <h3 className="text-xl font-semibold mb-3 mt-6">Uploading Files</h3>
          <div className="space-y-3">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Navigate to Files</h4>
              <p className="text-sm text-muted-foreground">
                In the dashboard sidebar, click on "Files" to access the file management interface.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Upload Documents</h4>
              <ul className="space-y-2 text-sm text-muted-foreground ml-4">
                <li>• Click "Upload Files" button</li>
                <li>• Select PDF files or documents</li>
                <li>• Wait for processing to complete</li>
                <li>• Files are automatically indexed for AI</li>
              </ul>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border-l-4 border-blue-500 rounded-r-lg">
              <p className="text-sm">
                <strong>Tip:</strong> Upload admission brochures, fee structures, course catalogs,
                FAQs, policies, and any other frequently referenced documents.
              </p>
            </div>
          </div>

          <h3 className="text-xl font-semibold mb-3 mt-6">Web Crawling</h3>
          <div className="space-y-3">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Start a Crawl Job</h4>
              <ol className="space-y-2 text-sm text-muted-foreground ml-6">
                <li>1. Navigate to "Integrations" → "Web Crawling"</li>
                <li>2. Enter your website URL (e.g., https://yourcampus.edu)</li>
                <li>3. Set crawl depth (1-3 levels recommended)</li>
                <li>4. Select content types to crawl (text, images, PDFs)</li>
                <li>5. Click "Start Crawl"</li>
              </ol>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Monitor Progress</h4>
              <p className="text-sm text-muted-foreground">
                The crawl job status shows pages visited, resources found, and completion progress.
                This can take several minutes depending on your site size.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Review Results</h4>
              <p className="text-sm text-muted-foreground">
                After completion, review the crawled pages. Select which content to add to the
                knowledge base.
              </p>
            </div>
          </div>
        </section>

        {/* Widget Configuration */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">3. Configuring Widget Settings</h2>
          <p className="mb-4">
            Navigate to "Customization" to configure how your widget appears and behaves.
          </p>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Greeting Message</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Set a welcoming first message that users see when opening the chat:
              </p>
              <div className="p-3 bg-muted/50 rounded text-sm font-mono">
                "Hi! 👋 How can I help you today?"
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Quick Suggestions</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Add up to 3 quick suggestion buttons:
              </p>
              <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                <li>• "What are the admission requirements?"</li>
                <li>• "How do I pay my fees?"</li>
                <li>• "Where is the library?"</li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Voice Settings</h4>
              <p className="text-sm text-muted-foreground">
                Configure Vapi assistant ID and optional phone number for voice call integration.
              </p>
            </div>
          </div>
        </section>

        {/* Monitoring Conversations */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Monitoring Conversations</h2>
          <p className="mb-4">
            The Conversations page shows all student interactions in real-time.
          </p>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Conversation List</h4>
              <ul className="space-y-2 text-sm text-muted-foreground ml-4">
                <li>• View all conversations by status (unresolved, escalated, resolved)</li>
                <li>• Click on any conversation to view full message history</li>
                <li>• See student name, email, and session metadata</li>
                <li>• Real-time updates as new messages arrive</li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Conversation Details</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Click on a conversation to see:
              </p>
              <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                <li>• Complete message thread</li>
                <li>• Student information and metadata</li>
                <li>• Device and browser details</li>
                <li>• Timestamp for each message</li>
                <li>• AI confidence and sources used</li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Taking Over Conversations</h4>
              <p className="text-sm text-muted-foreground">
                For complex queries, staff can take over from the AI and respond manually. The
                conversation history is preserved.
              </p>
            </div>
          </div>
        </section>

        {/* Analytics */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Understanding Analytics</h2>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Conversation Metrics</h4>
              <ul className="space-y-2 text-sm text-muted-foreground ml-4">
                <li>• Total conversations over time</li>
                <li>• Average response time</li>
                <li>• Resolution rate (AI vs human escalation)</li>
                <li>• Peak usage hours and days</li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Popular Questions</h4>
              <p className="text-sm text-muted-foreground">
                Identify most frequently asked questions to improve knowledge base and add as quick
                suggestions.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Knowledge Gaps</h4>
              <p className="text-sm text-muted-foreground">
                Monitor questions where AI couldn't provide confident answers. This indicates missing
                information in the knowledge base.
              </p>
            </div>
          </div>
        </section>

        {/* Team Management */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Managing Team Members</h2>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Inviting Members</h4>
              <ol className="space-y-2 text-sm text-muted-foreground ml-6">
                <li>1. Go to Settings → Organization</li>
                <li>2. Click "Invite Members"</li>
                <li>3. Enter email addresses</li>
                <li>4. Assign roles (Admin or Member)</li>
                <li>5. Send invitations</li>
              </ol>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Roles & Permissions</h4>
              <ul className="space-y-2 text-sm text-muted-foreground ml-4">
                <li>
                  • <strong>Admin:</strong> Full access to all features including settings and billing
                </li>
                <li>
                  • <strong>Member:</strong> Can view conversations and analytics, limited settings
                  access
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Plugins */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">7. Managing Integrations & Plugins</h2>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Vapi Voice Integration</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Navigate to "Plugins" to configure voice integration:
              </p>
              <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                <li>• Add Vapi API keys</li>
                <li>• Keys are encrypted and stored securely</li>
                <li>• Used for voice call functionality</li>
              </ul>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border-l-4 border-blue-500 rounded-r-lg">
              <p className="text-sm">
                <strong>Security:</strong> All plugin secrets are encrypted using AES-256-GCM before
                storage. Only your organization can decrypt them.
              </p>
            </div>
          </div>
        </section>

        {/* Best Practices */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Best Practices</h2>
          <div className="space-y-3">
            <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-950/20 rounded-r-lg">
              <p className="text-sm">
                <strong>✓ Regular Knowledge Base Updates:</strong> Add new policies, announcements,
                and information as they become available
              </p>
            </div>
            <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-950/20 rounded-r-lg">
              <p className="text-sm">
                <strong>✓ Monitor Daily:</strong> Check conversations regularly to identify issues and
                opportunities for improvement
              </p>
            </div>
            <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-950/20 rounded-r-lg">
              <p className="text-sm">
                <strong>✓ Use Analytics:</strong> Review weekly analytics to understand student needs
                and peak usage patterns
              </p>
            </div>
            <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-950/20 rounded-r-lg">
              <p className="text-sm">
                <strong>✓ Respond to Escalations:</strong> When AI escalates complex queries, respond
                promptly to maintain student trust
              </p>
            </div>
            <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-950/20 rounded-r-lg">
              <p className="text-sm">
                <strong>✓ Update Suggestions:</strong> Periodically refresh quick suggestions based on
                current trends and seasons
              </p>
            </div>
          </div>
        </section>
      </div>
    </DocLayout>
  );
}
