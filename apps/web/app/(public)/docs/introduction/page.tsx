import { DocLayout } from "@/modules/docs/components/DocLayout";
import Link from "next/link";

export default function IntroductionPage() {
  return (
    <DocLayout
      title="Introduction to Askly"
      description="Learn what Askly is and how it transforms campus communication"
    >
      <div className="space-y-8">
        {/* Overview */}
        <section>
          <h2 className="text-3xl font-bold mb-4">What is Askly?</h2>
          <p className="text-lg mb-4">
            Askly is an innovative <strong>multilingual conversational AI platform</strong> designed
            to transform campus communication by eliminating language barriers in Indian educational
            institutions. It provides <strong>24/7 automated student support</strong> in English,
            Hindi, and regional languages through both chat and voice interfaces.
          </p>
          <p className="text-lg">
            Built with modern technologies like Next.js 15, React 19, and Convex, Askly is a
            production-ready, open-source solution that can handle thousands of concurrent
            conversations while maintaining a seamless user experience.
          </p>
        </section>

        {/* The Problem */}
        <section>
          <h2 className="text-3xl font-bold mb-4">The Problem We Solve</h2>
          <p className="mb-4">
            Campus offices across India face significant challenges in student communication:
          </p>
          <div className="bg-muted/50 border-l-4 border-primary p-6 rounded-r-lg mb-4">
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-primary mr-3 mt-1">❌</span>
                <span>
                  <strong>Language Barriers:</strong> Most systems only support English, creating
                  accessibility issues for students who prefer regional languages
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-3 mt-1">❌</span>
                <span>
                  <strong>Information Scattered:</strong> Important information exists in PDFs and
                  circulars but lacks easy accessibility
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-3 mt-1">❌</span>
                <span>
                  <strong>Repetitive Queries:</strong> Staff handle thousands of the same questions
                  daily, leading to burnout
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-3 mt-1">❌</span>
                <span>
                  <strong>Limited Availability:</strong> Students need help 24/7, but offices have
                  fixed hours
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* The Solution */}
        <section>
          <h2 className="text-3xl font-bold mb-4">How Askly Solves This</h2>
          <div className="grid gap-6 md:grid-cols-2 mb-6">
            <div className="p-6 border rounded-lg">
              <div className="text-3xl mb-3">🌍</div>
              <h3 className="text-xl font-semibold mb-2">Multilingual Support</h3>
              <p className="text-muted-foreground">
                Instant answers in native languages including Hindi, Tamil, Telugu, and more.
                Students communicate naturally in their preferred language.
              </p>
            </div>

            <div className="p-6 border rounded-lg">
              <div className="text-3xl mb-3">🧠</div>
              <h3 className="text-xl font-semibold mb-2">Context-Aware AI</h3>
              <p className="text-muted-foreground">
                Remembers conversation history across multiple turns, providing intelligent,
                contextual responses powered by advanced RAG technology.
              </p>
            </div>

            <div className="p-6 border rounded-lg">
              <div className="text-3xl mb-3">🎤</div>
              <h3 className="text-xl font-semibold mb-2">Voice & Text</h3>
              <p className="text-muted-foreground">
                Support for both text chat and voice calls via Vapi integration, making it
                accessible for all students.
              </p>
            </div>

            <div className="p-6 border rounded-lg">
              <div className="text-3xl mb-3">📈</div>
              <h3 className="text-xl font-semibold mb-2">Smart Escalation</h3>
              <p className="text-muted-foreground">
                Automatically escalates complex queries to staff with full conversation history,
                ensuring nothing falls through the cracks.
              </p>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-950/20 border-l-4 border-green-500 p-6 rounded-r-lg">
            <p className="text-lg font-semibold mb-2">🎯 Impact</p>
            <p>
              Askly delivers a <strong>70% reduction in repetitive queries</strong>, freeing staff to
              focus on complex issues while students get instant, accurate answers anytime they need.
            </p>
          </div>
        </section>

        {/* Core Capabilities */}
        <section>
          <h2 className="text-3xl font-bold mb-4">Core Capabilities</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 border rounded-lg">
              <span className="text-2xl">✨</span>
              <div>
                <h4 className="font-semibold text-lg mb-1">Multilingual Communication</h4>
                <p className="text-muted-foreground">
                  Native support for English, Hindi, and regional languages with automatic language
                  detection
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 border rounded-lg">
              <span className="text-2xl">🤖</span>
              <div>
                <h4 className="font-semibold text-lg mb-1">Intelligent Query Processing</h4>
                <p className="text-muted-foreground">
                  AI-powered understanding with context management across conversation turns
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 border rounded-lg">
              <span className="text-2xl">📚</span>
              <div>
                <h4 className="font-semibold text-lg mb-1">Knowledge Integration</h4>
                <p className="text-muted-foreground">
                  RAG-powered responses from institutional documents including PDFs, websites, and
                  uploaded files
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 border rounded-lg">
              <span className="text-2xl">🎙️</span>
              <div>
                <h4 className="font-semibold text-lg mb-1">Voice Support</h4>
                <p className="text-muted-foreground">
                  Real-time voice calls via Vapi integration for natural conversations
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 border rounded-lg">
              <span className="text-2xl">📊</span>
              <div>
                <h4 className="font-semibold text-lg mb-1">Analytics Dashboard</h4>
                <p className="text-muted-foreground">
                  Real-time insights, conversation logs, and analytics to understand student needs
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 border rounded-lg">
              <span className="text-2xl">🔒</span>
              <div>
                <h4 className="font-semibold text-lg mb-1">Enterprise Security</h4>
                <p className="text-muted-foreground">
                  Encrypted communications with Clerk authentication and multi-tenancy support
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 border rounded-lg">
              <span className="text-2xl">🔌</span>
              <div>
                <h4 className="font-semibold text-lg mb-1">Easy Integration</h4>
                <p className="text-muted-foreground">
                  Embeddable widget with single script tag deployment on any website
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Technology Stack */}
        <section>
          <h2 className="text-3xl font-bold mb-4">Built with Modern Tech</h2>
          <p className="mb-4">
            Askly is built using cutting-edge technologies to ensure scalability, performance, and
            developer experience:
          </p>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Frontend</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Next.js 15 (React 19)</li>
                <li>• Tailwind CSS + shadcn/ui</li>
                <li>• TypeScript 5.7</li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Backend</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Convex (Serverless)</li>
                <li>• OpenAI, Gemini, Claude</li>
                <li>• Vapi (Voice AI)</li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">DevOps</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Turborepo (Monorepo)</li>
                <li>• pnpm 10.4.1</li>
                <li>• Vercel Deployment</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Next Steps */}
        <section className="mt-12 p-8 border rounded-lg bg-muted/50">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="mb-6 text-muted-foreground">
            Explore the features in detail or jump straight into the installation guide to set up
            Askly for your campus.
          </p>
          <div className="flex gap-4">
            <Link
              href="/docs/features"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg border font-medium hover:bg-accent transition-colors"
            >
              Explore Features →
            </Link>
            <Link
              href="/docs/getting-started"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              Get Started →
            </Link>
          </div>
        </section>
      </div>
    </DocLayout>
  );
}
