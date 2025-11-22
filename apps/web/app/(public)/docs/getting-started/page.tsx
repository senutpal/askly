import { DocLayout } from "@/modules/docs/components/DocLayout";
import { CodeBlock } from "@/modules/docs/components/CodeBlock";
import { codeExamples } from "@/modules/docs/config/content";
import Link from "next/link";

export default function GettingStartedPage() {
  return (
    <DocLayout
      title="Getting Started"
      description="Quick start guide to get Askly running on your system"
    >
      <div className="space-y-8">
        {/* Prerequisites */}
        <section>
          <h2 className="text-3xl font-bold mb-4">Prerequisites</h2>
          <p className="mb-4">
            Before you begin, ensure you have the following installed on your system:
          </p>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Software Requirements</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  <span>
                    <strong>Node.js</strong> ≥ 20.0.0 -{" "}
                    <a
                      href="https://nodejs.org"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Download here
                    </a>
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  <span>
                    <strong>pnpm</strong> 10.4.1 or higher -{" "}
                    <a
                      href="https://pnpm.io/installation"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Installation guide
                    </a>
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  <span>
                    <strong>Git</strong> for version control
                  </span>
                </li>
              </ul>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Required Accounts</h4>
              <p className="text-sm text-muted-foreground mb-3">
                You'll need to create free accounts for the following services:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="text-primary">1.</span>
                  <span>
                    <strong>Clerk</strong> (Authentication) -{" "}
                    <a
                      href="https://clerk.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      clerk.com
                    </a>
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">2.</span>
                  <span>
                    <strong>Convex</strong> (Backend/Database) -{" "}
                    <a
                      href="https://convex.dev"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      convex.dev
                    </a>
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">3.</span>
                  <span>
                    <strong>Vapi</strong> (Voice integration) -{" "}
                    <a
                      href="https://vapi.ai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      vapi.ai
                    </a>
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">4.</span>
                  <span>
                    <strong>Google Gemini</strong> (AI models) -{" "}
                    <a
                      href="https://aistudio.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      aistudio.google.com
                    </a>
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Installation Steps */}
        <section>
          <h2 className="text-3xl font-bold mb-4">Installation Steps</h2>

          <div className="space-y-6">
            {/* Step 1 */}
            <div>
              <h3 className="text-xl font-semibold mb-3">Step 1: Clone the Repository</h3>
              <p className="mb-3 text-muted-foreground">
                Clone Askly from GitHub and navigate to the project directory:
              </p>
              <CodeBlock code={codeExamples.installCommands.clone} language="bash" />
            </div>

            {/* Step 2 */}
            <div>
              <h3 className="text-xl font-semibold mb-3">Step 2: Install Dependencies</h3>
              <p className="mb-3 text-muted-foreground">
                Install all dependencies using pnpm. This will install packages for all apps and
                packages in the monorepo:
              </p>
              <CodeBlock code={codeExamples.installCommands.install} language="bash" />
              <div className="mt-3 p-4 bg-blue-50 dark:bg-blue-950/20 border-l-4 border-blue-500 rounded-r-lg">
                <p className="text-sm">
                  <strong>Note:</strong> The first install may take a few minutes as pnpm downloads
                  and caches all dependencies.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div>
              <h3 className="text-xl font-semibold mb-3">Step 3: Set Up Convex Backend</h3>
              <p className="mb-3 text-muted-foreground">
                Initialize the Convex backend and create your deployment:
              </p>
              <CodeBlock code={codeExamples.installCommands.setupBackend} language="bash" />
              <p className="mt-3 text-muted-foreground">
                Follow the interactive prompts to:
              </p>
              <ul className="mt-2 space-y-2 text-muted-foreground ml-6">
                <li>• Create a new Convex project or link to an existing one</li>
                <li>• Generate convex/.env.local with your deployment URL</li>
                <li>• Set up the database schema automatically</li>
              </ul>
            </div>

            {/* Step 4 */}
            <div>
              <h3 className="text-xl font-semibold mb-3">Step 4: Configure Environment Variables</h3>
              <p className="mb-3 text-muted-foreground">
                You need to create <code className="px-2 py-1 bg-muted rounded text-sm">.env.local</code> files
                in each app directory. See the{" "}
                <Link href="/docs/setup" className="text-primary hover:underline">
                  Setup & Configuration
                </Link>{" "}
                page for detailed environment variable configuration.
              </p>
              <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border-l-4 border-yellow-500 rounded-r-lg">
                <p className="text-sm">
                  <strong>Important:</strong> Don't skip this step! The application won't work
                  without proper environment variables configured.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div>
              <h3 className="text-xl font-semibold mb-3">Step 5: Start Development Server</h3>
              <p className="mb-3 text-muted-foreground">
                Start all services in development mode:
              </p>
              <CodeBlock code={codeExamples.installCommands.dev} language="bash" />
              <p className="mt-3 text-muted-foreground">This command starts:</p>
              <ul className="mt-2 space-y-2 text-muted-foreground ml-6">
                <li>
                  • <strong>Web Dashboard:</strong> http://localhost:3000
                </li>
                <li>
                  • <strong>Chat Widget:</strong> http://localhost:3001
                </li>
                <li>
                  • <strong>Embed Script:</strong> http://localhost:3002
                </li>
                <li>
                  • <strong>Convex Backend:</strong> Auto-syncs in development mode
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Verification */}
        <section>
          <h2 className="text-3xl font-bold mb-4">Verify Installation</h2>
          <p className="mb-4">
            Once the development server is running, verify everything works:
          </p>
          <div className="space-y-3">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">1. Open the Web Dashboard</h4>
              <p className="text-sm text-muted-foreground">
                Navigate to{" "}
                <code className="px-2 py-1 bg-muted rounded">http://localhost:3000</code> and you
                should see the Askly landing page.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">2. Sign Up</h4>
              <p className="text-sm text-muted-foreground">
                Create an account using the sign-up page. You'll be redirected to create or select
                an organization.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">3. Create Organization</h4>
              <p className="text-sm text-muted-foreground">
                Create your first organization (e.g., your campus name). This will be your workspace
                for managing Askly.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">4. Access Dashboard</h4>
              <p className="text-sm text-muted-foreground">
                You should now see the main dashboard with conversations, customization, and other
                features.
              </p>
            </div>
          </div>
        </section>

        {/* Next Steps */}
        <section className="mt-12 p-8 border rounded-lg bg-muted/50">
          <h2 className="text-2xl font-bold mb-4">🎉 You're All Set!</h2>
          <p className="mb-6 text-muted-foreground">
            Great job! Askly is now running locally. Here's what to explore next:
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <Link
              href="/docs/customization"
              className="p-4 border rounded-lg hover:border-primary transition-colors"
            >
              <h4 className="font-semibold mb-1">Customize Your Widget</h4>
              <p className="text-sm text-muted-foreground">
                Configure greetings, suggestions, and appearance
              </p>
            </Link>
            <Link
              href="/docs/usage-guide"
              className="p-4 border rounded-lg hover:border-primary transition-colors"
            >
              <h4 className="font-semibold mb-1">Upload Knowledge Base</h4>
              <p className="text-sm text-muted-foreground">
                Add documents and content for AI responses
              </p>
            </Link>
            <Link
              href="/docs/integration"
              className="p-4 border rounded-lg hover:border-primary transition-colors"
            >
              <h4 className="font-semibold mb-1">Embed the Widget</h4>
              <p className="text-sm text-muted-foreground">
                Add Askly to your website with one script tag
              </p>
            </Link>
            <Link
              href="/docs/deployment"
              className="p-4 border rounded-lg hover:border-primary transition-colors"
            >
              <h4 className="font-semibold mb-1">Deploy to Production</h4>
              <p className="text-sm text-muted-foreground">
                Launch Askly for your campus users
              </p>
            </Link>
          </div>
        </section>

        {/* Troubleshooting */}
        <section>
          <h2 className="text-3xl font-bold mb-4">Common Issues</h2>
          <p className="mb-4">
            Running into problems? Check the{" "}
            <Link href="/docs/troubleshooting" className="text-primary hover:underline">
              Troubleshooting Guide
            </Link>{" "}
            for solutions to common installation issues.
          </p>
        </section>
      </div>
    </DocLayout>
  );
}
