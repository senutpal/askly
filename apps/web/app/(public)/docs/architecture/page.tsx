import { DocLayout } from "@/features/docs/components/DocLayout";

export default function ArchitecturePage() {
  return (
    <DocLayout
      title="Architecture"
      description="Understand how Askly works under the hood"
    >
      <div className="space-y-8">
        {/* High-Level Overview */}
        <section>
          <h2 className="text-3xl font-bold mb-4">High-Level Architecture</h2>
          <p className="text-lg mb-6">
            Askly is built as a modern, scalable monorepo with three main applications and a
            serverless backend. Here's how everything fits together:
          </p>
          
          <div className="p-6 border rounded-lg bg-muted/50 mb-6">
            <pre className="text-sm overflow-x-auto">
{`┌─────────────────────────────────────────────────────────────┐
│                    User's Website                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Embed Script (Vite)                          │   │
│  │  • Single script tag integration                     │   │
│  │  • Loads widget in iframe                            │   │
│  └────────────────┬─────────────────────────────────────┘   │
└───────────────────┼─────────────────────────────────────────┘
                    │
                    ├─────────────────────────┐
                    ▼                         ▼
          ┌─────────────────┐       ┌─────────────────┐
          │  Widget App     │       │  Web Dashboard  │
          │  (Next.js)      │       │  (Next.js)      │
          ├─────────────────┤       ├─────────────────┤
          │ • Chat UI       │       │ • Admin Panel   │
          │ • Voice calls   │       │ • Analytics     │
          │ • Sessions      │       │ • Settings      │
          └────────┬────────┘       └────────┬────────┘
                   │                         │
                   └────────┬────────────────┘
                            │
                            ▼
                  ┌──────────────────┐
                  │  Convex Backend  │
                  │  (Serverless)    │
                  ├──────────────────┤
                  │ • Real-time DB   │
                  │ • AI Functions   │
                  │ • RAG System     │
                  │ • Auth (Clerk)   │
                  └────────┬─────────┘
                           │
            ┌──────────────┼──────────────┐
            ▼              ▼              ▼
    ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
    │   Gemini    │ │    Vapi     │ │   Clerk     │
    │     AI      │ │   (Voice)   │ │   (Auth)    │
    └─────────────┘ └─────────────┘ └─────────────┘`}
            </pre>
          </div>
        </section>

        {/* Components */}
        <section>
          <h2 className="text-3xl font-bold mb-4">Core Components</h2>
          <div className="space-y-6">
            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-semibold mb-3">🌐 Embed Script (apps/embed)</h3>
              <p className="text-muted-foreground mb-3">
                A lightweight Vite-built script that can be added to any website with a single{" "}
                <code className="px-1.5 py-0.5 bg-muted rounded">&lt;script&gt;</code> tag.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground ml-4">
                <li>• Creates iframe pointing to widget app</li>
                <li>• Handles configuration (org ID, position)</li>
                <li>• Provides JavaScript API (show/hide/destroy)</li>
                <li>• Minimal footprint (~10KB gzipped)</li>
              </ul>
            </div>

            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-semibold mb-3">💬 Widget App (apps/widget)</h3>
              <p className="text-muted-foreground mb-3">
                The actual chat interface loaded in an iframe. Built with Next.js for performance
                and SEO.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground ml-4">
                <li>• Real-time chat interface</li>
                <li>• Voice call integration (Vapi)</li>
                <li>• Message streaming</li>
                <li>• Session management</li>
                <li>• Multilingual support</li>
              </ul>
            </div>

            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-semibold mb-3">📊 Web Dashboard (apps/web)</h3>
              <p className="text-muted-foreground mb-3">
                Admin interface for managing conversations,knowledge base, and settings.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground ml-4">
                <li>• Conversation monitoring and management</li>
                <li>• Real-time analytics and insights</li>
                <li>• Knowledge base upload and management</li>
                <li>• Widget customization settings</li>
                <li>• Organization and team management</li>
              </ul>
            </div>

            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-semibold mb-3">⚡ Convex Backend (packages/backend)</h3>
              <p className="text-muted-foreground mb-3">
                Serverless backend handling all business logic, database, and AI processing.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground ml-4">
                <li>• Real-time database with instant sync</li>
                <li>• AI conversation processing</li>
                <li>• RAG (Retrieval Augmented Generation) system</li>
                <li>• Document indexing and search</li>
                <li>• Secure API endpoints</li>
                <li>• Multi-tenancy with org isolation</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Data Flow */}
        <section>
          <h2 className="text-3xl font-bold mb-4">Data Flow</h2>
          <div className="space-y-4">
            <div className="p-6 border rounded-lg">
              <h4 className="font-semibold mb-3">1. User Sends Message</h4>
              <ol className="space-y-2 text-sm text-muted-foreground ml-6">
                <li>• User types message in widget chat interface</li>
                <li>• Widget sends message to Convex backend via mutation</li>
                <li>• Message stored in conversations table with metadata</li>
              </ol>
            </div>

            <div className="p-6 border rounded-lg">
              <h4 className="font-semibold mb-3">2. AI Processing</h4>
              <ol className="space-y-2 text-sm text-muted-foreground ml-6">
                <li>• Backend retrieves conversation history</li>
                <li>• RAG system searches knowledge base for relevant context</li>
                <li>• Context + history sent to AI model (Gemini)</li>
                <li>• AI generates response based on context</li>
              </ol>
            </div>

            <div className="p-6 border rounded-lg">
              <h4 className="font-semibold mb-3">3. Response Streaming</h4>
              <ol className="space-y-2 text-sm text-muted-foreground ml-6">
                <li>• AI response streamed back in real-time</li>
                <li>• Convex streams updates to widget via WebSocket</li>
                <li>• User sees response appear progressively</li>
                <li>• Final response stored in database</li>
              </ol>
            </div>

            <div className="p-6 border rounded-lg">
              <h4 className="font-semibold mb-3">4. Dashboard Sync</h4>
              <ol className="space-y-2 text-sm text-muted-foreground ml-6">
                <li>• Admin dashboard subscribes to conversations</li>
                <li>• Real-time updates via Convex reactive queries</li>
                <li>• Admins see new messages instantly</li>
                <li>• Can intervene or escalate if needed</li>
              </ol>
            </div>
          </div>
        </section>

        {/* Technology Stack */}
        <section>
          <h2 className="text-3xl font-bold mb-4">Technology Stack</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="p-6 border rounded-lg">
              <h4 className="font-semibold mb-3">Frontend</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <strong>Next.js 15:</strong> React framework with App Router
                </li>
                <li>
                  <strong>React 19:</strong> Latest React with new features
                </li>
                <li>
                  <strong>TypeScript 5.7:</strong> Type-safe development
                </li>
                <li>
                  <strong>Tailwind CSS 4:</strong> Utility-first styling
                </li>
                <li>
                  <strong>shadcn/ui:</strong> Accessible component library
                </li>
                <li>
                  <strong>Jotai:</strong> Lightweight state management
                </li>
              </ul>
            </div>

            <div className="p-6 border rounded-lg">
              <h4 className="font-semibold mb-3">Backend</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <strong>Convex:</strong> Real-time serverless backend
                </li>
                <li>
                  <strong>Google Gemini:</strong> AI language model
                </li>
                <li>
                  <strong>Clerk:</strong> Authentication & organizations
                </li>
                <li>
                  <strong>Vapi:</strong> Voice AI integration
                </li>
              </ul>
            </div>

            <div className="p-6 border rounded-lg">
              <h4 className="font-semibold mb-3">DevOps</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <strong>Turborepo:</strong> Monorepo build system
                </li>
                <li>
                  <strong>pnpm:</strong> Fast, disk-efficient package manager
                </li>
                <li>
                  <strong>Vite:</strong> Lightning-fast build tool (embed)
                </li>
                <li>
                  <strong>Vercel:</strong> Deployment platform
                </li>
              </ul>
            </div>

            <div className="p-6 border rounded-lg">
              <h4 className="font-semibold mb-3">Development</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <strong>ESLint:</strong> Code linting
                </li>
                <li>
                  <strong>Prettier:</strong> Code formatting
                </li>
                <li>
                  <strong>React Hook Form:</strong> Form management
                </li>
                <li>
                  <strong>Zod:</strong> Schema validation
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* RAG System */}
        <section>
          <h2 className="text-3xl font-bold mb-4">RAG (Retrieval Augmented Generation)</h2>
          <div className="p-6 border rounded-lg">
            <p className="mb-4 text-muted-foreground">
              Askly uses RAG to provide accurate, context-aware responses based on your institutional
              knowledge base:
            </p>
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-2">1. Document Indexing</h4>
                <p className="text-sm text-muted-foreground">
                  PDFs and web content are processed, chunked, and embedded using vector embeddings.
                  Stored in Convex vector database.
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-2">2. Semantic Search</h4>
                <p className="text-sm text-muted-foreground">
                  When a user asks a question, it's converted to a vector embedding. System searches
                  for most relevant document chunks using cosine similarity.
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-2">3. Context Injection</h4>
                <p className="text-sm text-muted-foreground">
                  Retrieved chunks are injected into the AI prompt as context. AI generates response
                  based on actual institutional data.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Multi-Tenancy */}
        <section>
          <h2 className="text-3xl font-bold mb-4">Multi-Tenancy Architecture</h2>
          <div className="p-6 border rounded-lg">
            <p className="mb-4 text-muted-foreground">
              Each campus/organization has completely isolated data:
            </p>
            <ul className="space-y-3 text-sm text-muted-foreground ml-4">
              <li>
                • <strong>Organization Isolation:</strong> All database queries filtered by
                organizationId
              </li>
              <li>
                • <strong>Clerk Integration:</strong> User authentication and org management handled
                by Clerk
              </li>
              <li>
                • <strong>Separate Knowledge Bases:</strong> Each org has its own document
                collection
              </li>
              <li>
                • <strong>Widget Configuration:</strong> Each org can customize independently
              </li>
              <li>
                • <strong>Analytics Separation:</strong> Conversation data never mixed between orgs
              </li>
            </ul>
          </div>
        </section>

        {/* Security */}
        <section>
          <h2 className="text-3xl font-bold mb-4">Security Considerations</h2>
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-950/20 rounded-r-lg">
              <p className="text-sm">
                <strong>✓ Authentication:</strong> Clerk handles all auth with secure JWT tokens
              </p>
            </div>
            <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-950/20 rounded-r-lg">
              <p className="text-sm">
                <strong>✓ API Security:</strong> Convex enforces authentication on all queries and
                mutations
              </p>
            </div>
            <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-950/20 rounded-r-lg">
              <p className="text-sm">
                <strong>✓ Data Encryption:</strong> Sensitive data encrypted with AES-256-GCM using
                MASTER_KEY
              </p>
            </div>
            <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-950/20 rounded-r-lg">
              <p className="text-sm">
                <strong>✓ HTTPS Only:</strong> All communications use TLS encryption
              </p>
            </div>
            <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-950/20 rounded-r-lg">
              <p className="text-sm">
                <strong>✓ Input Validation:</strong> Zod schema validation on all user inputs
              </p>
            </div>
          </div>
        </section>

        {/* Scalability */}
        <section>
          <h2 className="text-3xl font-bold mb-4">Scalability</h2>
          <div className="p-6 border rounded-lg">
            <p className="mb-4">Askly is designed to scale effortlessly:</p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-2">Serverless Backend</h4>
                <p className="text-sm text-muted-foreground">
                  Convex automatically scales based on load. Pay only for what you use.
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-2">Edge Deployment</h4>
                <p className="text-sm text-muted-foreground">
                  Vercel deploys to edge locations worldwide for low latency.
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-2">Real-Time Updates</h4>
                <p className="text-sm text-muted-foreground">
                  WebSocket connections managed automatically by Convex.
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-2">CDN Distribution</h4>
                <p className="text-sm text-muted-foreground">
                  Static assets served from global CDN for fast loading.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </DocLayout>
  );
}
