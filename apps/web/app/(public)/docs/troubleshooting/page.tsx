import { DocLayout } from "@/features/docs/components/DocLayout";
import { CodeBlock } from "@/features/docs/components/CodeBlock";

export default function TroubleshootingPage() {
  return (
    <DocLayout
      title="Troubleshooting"
      description="Common issues and solutions"
    >
      <div className="space-y-8">
        {/* Installation */}
        <section>
          <h2 className="text-3xl font-bold mb-4">Installation Issues</h2>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">pnpm command not found</h3>
              <CodeBlock code="npm install -g pnpm" language="bash" />
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Node version mismatch</h3>
              <p className="text-sm text-muted-foreground mb-2">Requires Node.js ≥ 20</p>
              <CodeBlock code="nvm install 20\nnvm use 20" language="bash" />
            </div>
          </div>
        </section>

        {/* Environment */}
        <section>
          <h2 className="text-3xl font-bold mb-4">Environment Variables</h2>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Missing Convex URL</h3>
              <p className="text-sm text-muted-foreground">
                Add NEXT_PUBLIC_CONVEX_URL to .env.local and restart dev server
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Clerk auth failed</h3>
              <p className="text-sm text-muted-foreground">
                Verify keys match Clerk dashboard and callback URLs are configured
              </p>
            </div>
          </div>
        </section>

        {/* Widget */}
        <section>
          <h2 className="text-3xl font-bold mb-4">Widget Issues</h2>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Widget doesn't appear</h3>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Check browser console for errors</li>
                <li>• Verify organization ID is correct</li>
                <li>• Clear browser cache</li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Messages not sending</h3>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Verify Convex backend is running</li>
                <li>• Check NEXT_PUBLIC_CONVEX_URL</li>
                <li>• Review network tab for failed requests</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Build */}
        <section>
          <h2 className="text-3xl font-bold mb-4">Build & Deploy</h2>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Type errors</h3>
              <CodeBlock code="pnpm typecheck\npnpm build" language="bash" />
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Vercel deployment failed</h3>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Check environment variables in Vercel</li>
                <li>• Verify build command and root directory</li>
                <li>• Review deployment logs</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Help */}
        <section className="mt-8 p-6 border rounded-lg bg-muted/50">
          <h3 className="text-xl font-semibold mb-3">Need More Help?</h3>
          <ul className="space-y-2 text-sm">
            <li>• Review other documentation sections</li>
            <li>• Check browser console (F12) for errors</li>
            <li>• Search GitHub issues: github.com/senutpal/askly/issues</li>
            <li>• Create a new issue with error details</li>
          </ul>
        </section>
      </div>
    </DocLayout>
  );
}
