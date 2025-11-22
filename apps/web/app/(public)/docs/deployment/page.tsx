import { DocLayout } from "@/features/docs/components/DocLayout";
import { CodeBlock } from "@/features/docs/components/CodeBlock";

export default function DeploymentPage() {
  return (
    <DocLayout
      title="Deployment"
      description="Deploy Askly to production with Vercel and Convex"
    >
      <div className="space-y-8">
        {/* Overview */}
        <section>
          <p className="text-lg mb-4">
            This guide covers deploying all Askly applications to production. We recommend using
            Vercel for Next.js apps due to seamless integration, but you can use any hosting platform
            that supports Next.js.
          </p>
          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border-l-4 border-blue-500 rounded-r-lg">
            <p className="text-sm">
              <strong>Deployment Order:</strong> Always deploy the Convex backend first, then the web
              apps. This ensures database and API endpoints are available when apps start.
            </p>
          </div>
        </section>

        {/* Convex Backend */}
        <section>
          <h2 className="text-3xl font-bold mb-4">1. Deploy Convex Backend</h2>
          <p className="mb-4">
            The Convex backend must be deployed first as all other apps depend on it:
          </p>
          <CodeBlock code="cd packages/backend\nnpx convex deploy" language="bash" />
          
          <div className="mt-4 space-y-3">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">What This Does</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Deploys all functions to Convex cloud</li>
                <li>• Updates database schema in production</li>
                <li>• Applies environment variables from convex/.env</li>
                <li>• Generates production deployment URL</li>
              </ul>
            </div>

            <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border-l-4 border-yellow-500 rounded-r-lg">
              <p className="text-sm">
                <strong>Important:</strong> Make sure all environment variables are set in{" "}
                <code className="px-1.5 py-0.5 bg-muted rounded">packages/backend/convex/.env</code>{" "}
                before deploying. Missing variables will cause deployment to fail.
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">After Deployment</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Copy the production deployment URL (it will look like:{" "}
                <code className="px-1.5 py-0.5 bg-muted rounded">https://your-project.convex.cloud</code>)
                and update it in all app .env files.
              </p>
            </div>
          </div>
        </section>

        {/* Web Dashboard */}
        <section>
          <h2 className="text-3xl font-bold mb-4">2. Deploy Web Dashboard</h2>
          
          <h3 className="text-xl font-semibold mb-3 mt-6">Using Vercel (Recommended)</h3>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Step 1: Install Vercel CLI</h4>
              <CodeBlock code="pnpm add -g vercel" language="bash" />
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Step 2: Deploy from apps/web</h4>
              <CodeBlock code="cd apps/web\nvercel --prod" language="bash" />
              <p className="text-sm text-muted-foreground mt-2">
                Follow the prompts to link to your Vercel account and configure the project.
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Step 3: Configure Environment Variables</h4>
              <p className="text-sm text-muted-foreground mb-2">
                In Vercel dashboard, add all environment variables from{" "}
                <code className="px-1.5 py-0.5 bg-muted rounded">apps/web/.env.local</code>:
              </p>
              <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                <li>• NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</li>
                <li>• CLERK_SECRET_KEY</li>
                <li>• NEXT_PUBLIC_CONVEX_URL (production URL from step 1)</li>
                <li>• CONVEX_DEPLOYMENT</li>
                <li>• NEXT_PUBLIC_WIDGET_URL (will be widget production URL)</li>
                <li>• NEXT_PUBLIC_APP_URL (your web dashboard production URL)</li>
              </ul>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Step 4: Update Clerk Callback URLs</h4>
              <p className="text-sm text-muted-foreground">
                In Clerk dashboard, add your production domain to allowed callback URLs.
              </p>
            </div>
          </div>
        </section>

        {/* Widget */}
        <section>
          <h2 className="text-3xl font-bold mb-4">3. Deploy Widget</h2>
          <div className="space-y-4">
            <CodeBlock code="cd apps/widget\nvercel --prod" language="bash" />
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Environment Variables</h4>
              <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                <li>• NEXT_PUBLIC_CONVEX_URL (production URL)</li>
                <li>• NEXT_PUBLIC_VAPI_PUBLIC_KEY</li>
                <li>• VAPI_PRIVATE_KEY</li>
              </ul>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border-l-4 border-blue-500 rounded-r-lg">
              <p className="text-sm">
                <strong>Note:</strong> After deploying the widget, copy its production URL (e.g.,{" "}
                <code className="px-1.5 py-0.5 bg-muted rounded">https://widget.yourdomain.com</code>)
                and update NEXT_PUBLIC_WIDGET_URL in the web dashboard's environment variables.
              </p>
            </div>
          </div>
        </section>

        {/* Embed Script */}
        <section>
          <h2 className="text-3xl font-bold mb-4">4. Deploy Embed Script</h2>
          <p className="mb-4">The embed script can be deployed to Vercel or any CDN:</p>

          <h3 className="text-xl font-semibold mb-3">Option 1: Vercel</h3>
          <CodeBlock code="cd apps/embed\nvercel --prod" language="bash" />

          <h3 className="text-xl font-semibold mb-3 mt-6">Option 2: CDN (Cloudflare, AWS S3, etc.)</h3>
          <div className="space-y-3">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Build the Script</h4>
              <CodeBlock code="cd apps/embed\npnpm build" language="bash" />
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Upload to CDN</h4>
              <p className="text-sm text-muted-foreground">
                Upload the <code className="px-1.5 py-0.5 bg-muted rounded">dist/widget.js</code> file
                to your CDN. Make sure it's publicly accessible.
              </p>
            </div>
          </div>

          <div className="mt-4 p-4 border rounded-lg">
            <h4 className="font-semibold mb-2">Update VITE_WIDGET_URL</h4>
            <p className="text-sm text-muted-foreground">
              Before building, update <code className="px-1.5 py-0.5 bg-muted rounded">apps/embed/.env</code> with
              the production widget URL from step 3.
            </p>
          </div>
        </section>

        {/* Post-Deployment */}
        <section>
          <h2 className="text-3xl font-bold mb-4">5. Post-Deployment Steps</h2>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">✓ Update Clerk Configuration</h4>
              <p className="text-sm text-muted-foreground">
                Add all production URLs to Clerk's allowed origins and redirect URLs.
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">✓ Test All Flows</h4>
              <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                <li>• Sign up / sign in flow</li>
                <li>• Organization creation</li>
                <li>• Widget embed on test page</li>
                <li>• Chat functionality</li>
                <li>• Voice calls (if configured)</li>
              </ul>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">✓ Configure Custom Domain (Optional)</h4>
              <p className="text-sm text-muted-foreground">
                Set up custom domains in Vercel for a branded experience.
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">✓ Set Up Monitoring</h4>
              <p className="text-sm text-muted-foreground">
                Use Vercel Analytics and Convex Dashboard to monitor performance and errors.
              </p>
            </div>
          </div>
        </section>

        {/* Environment Variables Checklist */}
        <section>
          <h2 className="text-3xl font-bold mb-4">Environment Variables Checklist</h2>
          <p className="mb-4">Make sure these are configured in production:</p>
          
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-3">Web Dashboard (apps/web)</h4>
              <ul className="space-y-1 text-sm">
                <li className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</span>
                </li>
                <li className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>CLERK_SECRET_KEY</span>
                </li>
                <li className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>NEXT_PUBLIC_CONVEX_URL (production)</span>
                </li>
                <li className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>CONVEX_DEPLOYMENT</span>
                </li>
                <li className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>NEXT_PUBLIC_WIDGET_URL (production)</span>
                </li>
                <li className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>NEXT_PUBLIC_APP_URL (production)</span>
                </li>
              </ul>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-3">Widget (apps/widget)</h4>
              <ul className="space-y-1 text-sm">
                <li className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>NEXT_PUBLIC_CONVEX_URL (production)</span>
                </li>
                <li className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>NEXT_PUBLIC_VAPI_PUBLIC_KEY</span>
                </li>
                <li className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>VAPI_PRIVATE_KEY</span>
                </li>
              </ul>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-3">Backend (packages/backend/convex)</h4>
              <ul className="space-y-1 text-sm">
                <li className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>GOOGLE_GENERATIVE_AI_API_KEY</span>
                </li>
                <li className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>VAPI_API_KEY</span>
                </li>
                <li className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>CLERK_SECRET_KEY</span>
                </li>
                <li className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>MASTER_KEY</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Continuous Deployment */}
        <section>
          <h2 className="text-3xl font-bold mb-4">Continuous Deployment</h2>
          <p className="mb-4">
            For automated deployments, connect your Git repository to Vercel:
          </p>
          <div className="space-y-3">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">1. Connect Repository</h4>
              <p className="text-sm text-muted-foreground">
                In Vercel dashboard, import your GitHub/GitLab repository.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">2. Configure Build Settings</h4>
              <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                <li>• Framework: Next.js</li>
                <li>• Root Directory: apps/web (or apps/widget)</li>
                <li>• Build Command: <code className="px-1.5 py-0.5 bg-muted rounded">pnpm build</code></li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">3. Auto-Deploy</h4>
              <p className="text-sm text-muted-foreground">
                Vercel will automatically deploy when you push to your main branch.
              </p>
            </div>
          </div>
        </section>
      </div>
    </DocLayout>
  );
}
