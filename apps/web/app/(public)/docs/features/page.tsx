import { DocLayout } from "@/features/docs/components/DocLayout";
import Link from "next/link";

export default function FeaturesPage() {
  return (
    <DocLayout
      title="Features"
      description="Explore all the powerful features Askly has to offer"
    >
      <div className="space-y-8">
        {/* For Students */}
        <section>
          <h2 className="text-3xl font-bold mb-6">For Students</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="p-6 border rounded-lg">
              <div className="text-3xl mb-3">⏰</div>
              <h3 className="text-xl font-semibold mb-2">24/7 Instant Support</h3>
              <p className="text-muted-foreground mb-4">
                Get answers anytime, anywhere. No more waiting for office hours or standing in long
                queues. Askly is always available to help.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Immediate responses to common questions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Available on weekends and holidays</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>No queue times or waiting periods</span>
                </li>
              </ul>
            </div>

            <div className="p-6 border rounded-lg">
              <div className="text-3xl mb-3">🌍</div>
              <h3 className="text-xl font-semibold mb-2">Multilingual Chat & Voice</h3>
              <p className="text-muted-foreground mb-4">
                Communicate in your preferred language through text or voice. Supports English,
                Hindi, and regional Indian languages.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Automatic language detection</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Real-time voice calls via Vapi</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Mix languages in same conversation</span>
                </li>
              </ul>
            </div>

            <div className="p-6 border rounded-lg">
              <div className="text-3xl mb-3">📱</div>
              <h3 className="text-xl font-semibold mb-2">Cross-Platform Access</h3>
              <p className="text-muted-foreground mb-4">
                Access Askly from any device - desktop, mobile, or tablet. The widget is fully
                responsive and works everywhere.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Web widget on campus website</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Future: WhatsApp integration</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Future: Telegram support</span>
                </li>
              </ul>
            </div>

            <div className="p-6 border rounded-lg">
              <div className="text-3xl mb-3">🧠</div>
              <h3 className="text-xl font-semibold mb-2">Context-Aware Conversations</h3>
              <p className="text-muted-foreground mb-4">
                Askly remembers your conversation history and provides contextual answers across
                multiple questions.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Multi-turn conversation support</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Follow-up questions handled naturally</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Context from previous messages</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* For Administrators */}
        <section>
          <h2 className="text-3xl font-bold mb-6">For Administrators</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="p-6 border rounded-lg">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="text-xl font-semibold mb-2">Real-Time Dashboard</h3>
              <p className="text-muted-foreground mb-4">
                Monitor all conversations, track metrics, and gain insights into student queries in
                real-time.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Live conversation monitoring</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Query volume and trends</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Response accuracy metrics</span>
                </li>
              </ul>
            </div>

            <div className="p-6 border rounded-lg">
              <div className="text-3xl mb-3">📚</div>
              <h3 className="text-xl font-semibold mb-2">Knowledge Base Management</h3>
              <p className="text-muted-foreground mb-4">
                Upload and manage institutional documents that power AI responses. Supports PDFs,
                websites, and more.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>PDF document upload and processing</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Website crawling for content extraction</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>RAG-powered intelligent retrieval</span>
                </li>
              </ul>
            </div>

            <div className="p-6 border rounded-lg">
              <div className="text-3xl mb-3">🔄</div>
              <h3 className="text-xl font-semibold mb-2">Smart Escalation</h3>
              <p className="text-muted-foreground mb-4">
                Complex queries are automatically escalated to human staff with complete conversation
                history for context.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Automatic escalation triggers</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Full conversation history transfer</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Manual escalation option</span>
                </li>
              </ul>
            </div>

            <div className="p-6 border rounded-lg">
              <div className="text-3xl mb-3">📈</div>
              <h3 className="text-xl font-semibold mb-2">Insights & Analytics</h3>
              <p className="text-muted-foreground mb-4">
                Understand student needs through detailed analytics on query patterns, popular
                questions, and satisfaction.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Most asked questions tracking</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Peak usage time analysis</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Knowledge gap identification</span>
                </li>
              </ul>
            </div>

            <div className="p-6 border rounded-lg">
              <div className="text-3xl mb-3">🏢</div>
              <h3 className="text-xl font-semibold mb-2">Organization Management</h3>
              <p className="text-muted-foreground mb-4">
                Multi-tenancy support with Clerk organizations. Each campus has isolated data and
                configurations.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Separate org for each campus</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Role-based access control</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Isolated knowledge bases</span>
                </li>
              </ul>
            </div>

            <div className="p-6 border rounded-lg">
              <div className="text-3xl mb-3">⚙️</div>
              <h3 className="text-xl font-semibold mb-2">Widget Customization</h3>
              <p className="text-muted-foreground mb-4">
                Customize widget appearance, greeting messages, default suggestions, and voice
                settings to match your brand.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Custom greeting messages</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Configurable quick suggestions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Voice assistant configuration</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Technical Features */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Technical Features</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 border rounded-lg">
              <span className="text-2xl">⚡</span>
              <div>
                <h4 className="font-semibold text-lg mb-1">Real-Time Communication</h4>
                <p className="text-muted-foreground">
                  Powered by Convex for instant message delivery and updates. No polling required,
                  true real-time experience with WebSocket connections.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 border rounded-lg">
              <span className="text-2xl">🎨</span>
              <div>
                <h4 className="font-semibold text-lg mb-1">Modern UI</h4>
                <p className="text-muted-foreground">
                  Built with Next.js 15, React 19, Tailwind CSS, and shadcn/ui components for a
                  beautiful, accessible interface.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 border rounded-lg">
              <span className="text-2xl">🔌</span>
              <div>
                <h4 className="font-semibold text-lg mb-1">Easy Integration</h4>
                <p className="text-muted-foreground">
                  Single script tag deployment. Embed on any website - WordPress, Drupal, static
                  HTML, React, Vue, or Angular applications.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 border rounded-lg">
              <span className="text-2xl">📈</span>
              <div>
                <h4 className="font-semibold text-lg mb-1">Scalable Architecture</h4>
                <p className="text-muted-foreground">
                  Serverless backend with Convex handles thousands of concurrent conversations.
                  Auto-scales based on demand.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 border rounded-lg">
              <span className="text-2xl">🔒</span>
              <div>
                <h4 className="font-semibold text-lg mb-1">Type-Safe Development</h4>
                <p className="text-muted-foreground">
                  Full TypeScript implementation across the entire stack. Catch errors at compile
                  time, not runtime.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Next Steps */}
        <section className="mt-12 p-8 border rounded-lg bg-muted/50">
          <h2 className="text-2xl font-bold mb-4">Ready to Experience These Features?</h2>
          <p className="mb-6 text-muted-foreground">
            Get started with Askly today and transform your campus communication.
          </p>
          <Link
            href="/docs/getting-started"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            Get Started →
          </Link>
        </section>
      </div>
    </DocLayout>
  );
}
