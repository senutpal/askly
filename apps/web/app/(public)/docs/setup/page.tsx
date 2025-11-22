import { DocLayout } from "@/modules/docs/components/DocLayout";
import { CodeBlock } from "@/modules/docs/components/CodeBlock";
import { envExamples } from "@/modules/docs/config/content";

export default function SetupPage() {
  return (
    <DocLayout
      title="Setup & Configuration"
      description="Detailed configuration and environment setup for all Askly applications"
    >
      <div className="space-y-8">
        {/* Overview */}
        <section>
          <p className="text-lg">
            Askly requires environment variables to be configured for each application in the
            monorepo. This page provides complete configuration details for all services.
          </p>
        </section>

        {/* Web Dashboard */}
        <section>
          <h2 className="text-3xl font-bold mb-4">Web Dashboard Configuration</h2>
          <p className="mb-4">
            Create <code className="px-2 py-1 bg-muted rounded text-sm">apps/web/.env.local</code>{" "}
            with the following variables:
          </p>
          <CodeBlock code={envExamples.web} language="bash" filename="apps/web/.env.local" />
          
          <div className="mt-4 space-y-3">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Clerk Configuration</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  • <strong>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:</strong> Get from Clerk dashboard →
                  API Keys
                </li>
                <li>
                  • <strong>CLERK_SECRET_KEY:</strong> Secret key from same page (keep private!)
                </li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Convex Configuration</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  • <strong>NEXT_PUBLIC_CONVEX_URL:</strong> Get from Convex dashboard after
                  creating project
                </li>
                <li>
                  • <strong>CONVEX_DEPLOYMENT:</strong> Your deployment name (from Convex setup)
                </li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">URL Configuration</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  • <strong>NEXT_PUBLIC_WIDGET_URL:</strong> URL where widget app runs (localhost:3001
                  for development)
                </li>
                <li>
                  • <strong>NEXT_PUBLIC_APP_URL:</strong> URL of main app (localhost:3000 for
                  development)
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Widget */}
        <section>
          <h2 className="text-3xl font-bold mb-4">Widget Configuration</h2>
          <p className="mb-4">
            Create <code className="px-2 py-1 bg-muted rounded text-sm">apps/widget/.env.local</code>:
          </p>
          <CodeBlock
            code={envExamples.widget}
            language="bash"
            filename="apps/widget/.env.local"
          />
          
          <div className="mt-4 space-y-3">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Vapi Configuration</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  • <strong>NEXT_PUBLIC_VAPI_PUBLIC_KEY:</strong> Public key from Vapi dashboard
                </li>
                <li>
                  • <strong>VAPI_PRIVATE_KEY:</strong> Private key (keep secure!)
                </li>
                <li>
                  • Sign up at{" "}
                  <a
                    href="https://vapi.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    vapi.ai
                  </a>{" "}
                  to get these keys
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Embed */}
        <section>
          <h2 className="text-3xl font-bold mb-4">Embed Script Configuration</h2>
          <p className="mb-4">
            Create <code className="px-2 py-1 bg-muted rounded text-sm">apps/embed/.env</code>:
          </p>
          <CodeBlock code={envExamples.embed} language="bash" filename="apps/embed/.env" />
          
          <div className="mt-4 p-4 border rounded-lg">
            <h4 className="font-semibold mb-2">Widget URL</h4>
            <p className="text-sm text-muted-foreground">
              This should point to where your widget application is hosted. In development, it's
              localhost:3001. In production, it would be your deployed widget URL (e.g.,
              https://widget.yourdomain.com).
            </p>
          </div>
        </section>

        {/* Backend */}
        <section>
          <h2 className="text-3xl font-bold mb-4">Backend Configuration</h2>
          <p className="mb-4">
            Create{" "}
            <code className="px-2 py-1 bg-muted rounded text-sm">packages/backend/convex/.env</code>:
          </p>
          <CodeBlock
            code={envExamples.backend}
            language="bash"
            filename="packages/backend/convex/.env"
          />
          
          <div className="mt-4 space-y-3">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Google Gemini API</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  • Get API key from{" "}
                  <a
                    href="https://aistudio.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Google AI Studio
                  </a>
                </li>
                <li>• Free tier available for development</li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Vapi Server</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Server-side API key from Vapi dashboard</li>
                <li>• Different from public key used in widget</li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Master Key</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Used for encrypting sensitive data</li>
                <li>• Must be at least 32 characters long</li>
                <li>• Generate a secure random string (keep it secret!)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Clerk Setup */}
        <section>
          <h2 className="text-3xl font-bold mb-4">Clerk Setup</h2>
          <div className="space-y-4">
            <p>Follow these steps to configure Clerk for authentication:</p>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">1. Create Clerk Application</h4>
              <ul className="space-y-2 text-sm text-muted-foreground ml-4">
                <li>• Go to clerk.com and sign up/login</li>
                <li>• Create a new application</li>
                <li>• Choose your preferred social providers (optional)</li>
              </ul>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">2. Enable Organizations</h4>
              <ul className="space-y-2 text-sm text-muted-foreground ml-4">
                <li>• In Clerk dashboard, go to "Organizations"</li>
                <li>• Enable the Organizations feature</li>
                <li>• This allows multi-tenancy support</li>
              </ul>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">3. Configure Callback URLs</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Add these URLs to allowed callback URLs:
              </p>
              <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                <li>• http://localhost:3000 (development)</li>
                <li>• http://localhost:3001 (development)</li>
                <li>• Your production URLs after deployment</li>
              </ul>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">4. Get API Keys</h4>
              <ul className="space-y-2 text-sm text-muted-foreground ml-4">
                <li>• Go to API Keys section</li>
                <li>• Copy Publishable Key and Secret Key</li>
                <li>• Add them to your .env.local files</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Convex Setup */}
        <section>
          <h2 className="text-3xl font-bold mb-4">Convex Setup</h2>
          <div className="space-y-4">
            <p>The Convex setup is mostly automated during installation:</p>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Automated Setup</h4>
              <CodeBlock code="cd packages/backend\npnpm run setup" language="bash" />
              <p className="text-sm text-muted-foreground mt-3">
                This command will guide you through creating a Convex project and automatically
                configure the schema.
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Manual Configuration</h4>
              <p className="text-sm text-muted-foreground mb-2">
                If you prefer manual setup:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground ml-4">
                <li>• Create project at convex.dev</li>
                <li>• Copy deployment URL</li>
                <li>• Add to NEXT_PUBLIC_CONVEX_URL in all apps</li>
                <li>• Run <code className="px-1.5 py-0.5 bg-muted rounded">npx convex dev</code> to sync schema</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Important Notes */}
        <section className="mt-12">
          <div className="p-6 bg-yellow-50 dark:bg-yellow-950/20 border-l-4 border-yellow-500 rounded-r-lg">
            <h3 className="text-lg font-semibold mb-3">⚠️ Important Security Notes</h3>
            <ul className="space-y-2 text-sm">
              <li>
                • Never commit .env files to version control (they're in .gitignore by default)
              </li>
              <li>• Keep secret keys private - don't share them publicly</li>
              <li>• Use different API keys for development and production</li>
              <li>• Regenerate keys if they're accidentally exposed</li>
              <li>• The MASTER_KEY should be a secure random string (min 32 chars)</li>
            </ul>
          </div>
        </section>
      </div>
    </DocLayout>
  );
}
