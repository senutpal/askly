import { DocLayout } from "@/modules/docs/components/DocLayout";
import { CodeBlock } from "@/modules/docs/components/CodeBlock";
import { codeExamples } from "@/modules/docs/config/content";

export default function IntegrationPage() {
  return (
    <DocLayout
      title="Widget Integration"
      description="Embed Askly chat widget on any website"
    >
      <div className="space-y-8">
        {/* Basic Integration */}
        <section>
          <h2 className="text-3xl font-bold mb-4">Basic Integration</h2>
          <p className="mb-4">
            The easiest way to add Askly to your website is with a single script tag. Add this to
            your HTML before the closing <code className="px-2 py-1 bg-muted rounded text-sm">&lt;/body&gt;</code> tag:
          </p>
          <CodeBlock code={codeExamples.embedBasic} language="html" />
          
          <div className="mt-4 space-y-3">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Configuration Attributes</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  • <strong>src:</strong> URL to your deployed embed script
                </li>
                <li>
                  • <strong>data-organization-id:</strong> Your Clerk organization ID (required)
                </li>
                <li>
                  • <strong>data-position:</strong> "bottom-right" or "bottom-left" (optional, default: "bottom-right")
                </li>
              </ul>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border-l-4 border-blue-500 rounded-r-lg">
              <p className="text-sm">
                <strong>Finding Your Organization ID:</strong> Go to your Askly dashboard, then
                Settings → Organization. Copy the organization ID shown there.
              </p>
            </div>
          </div>
        </section>

        {/* Programmatic Control */}
        <section>
          <h2 className="text-3xl font-bold mb-4">Programmatic Control</h2>
          <p className="mb-4">
            Once the script is loaded, you can control the widget programmatically using the{" "}
            <code className="px-2 py-1 bg-muted rounded text-sm">window.AsklyWidget</code> API:
          </p>
          <CodeBlock code={codeExamples.programmaticControl} language="javascript" />
          
          <div className="mt-4">
            <h4 className="font-semibold mb-3">Available Methods</h4>
            <div className="space-y-3">
              <div className="p-4 border rounded-lg">
                <code className="text-sm font-mono">init(config)</code>
                <p className="text-sm text-muted-foreground mt-2">
                  Initialize or reinitialize the widget with new configuration. Accept an object
                  with <code className="px-1.5 py-0.5 bg-muted rounded">organizationId</code> and{" "}
                  <code className="px-1.5 py-0.5 bg-muted rounded">position</code>.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <code className="text-sm font-mono">show()</code>
                <p className="text-sm text-muted-foreground mt-2">
                  Opens the chat widget interface.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <code className="text-sm font-mono">hide()</code>
                <p className="text-sm text-muted-foreground mt-2">
                  Closes the chat widget interface.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <code className="text-sm font-mono">destroy()</code>
                <p className="text-sm text-muted-foreground mt-2">
                  Completely removes the widget from the page and cleans up resources.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Framework Examples */}
        <section>
          <h2 className="text-3xl font-bold mb-4">Framework-Specific Examples</h2>

          {/* React */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">React</h3>
            <p className="mb-3 text-muted-foreground">
              Use the <code className="px-1.5 py-0.5 bg-muted rounded">useEffect</code> hook to load
              the widget when the component mounts:
            </p>
            <CodeBlock code={codeExamples.embedReact} language="javascript" filename="App.jsx" />
          </div>

          {/* Next.js */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">Next.js</h3>
            <p className="mb-3 text-muted-foreground">
              Use Next.js's <code className="px-1.5 py-0.5 bg-muted rounded">Script</code> component
              for optimized loading:
            </p>
            <CodeBlock
              code={codeExamples.embedNextjs}
              language="javascript"
              filename="layout.js"
            />
            <div className="mt-3 p-4 bg-blue-50 dark:bg-blue-950/20 border-l-4 border-blue-500 rounded-r-lg">
              <p className="text-sm">
                <strong>Tip:</strong> Use <code className="px-1.5 py-0.5 bg-muted rounded">strategy="lazyOnload"</code>{" "}
                to defer loading until the page is interactive, improving initial page load performance.
              </p>
            </div>
          </div>

          {/* Vue.js */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">Vue.js</h3>
            <CodeBlock
              code={`<template>
  <div id="app">
    <!-- Your app content -->
  </div>
</template>

<script>
export default {
  mounted() {
    const script = document.createElement('script');
    script.src = 'https://your-domain.com/widget.js';
    script.setAttribute('data-organization-id', 'org_xxxxxxxx');
    document.body.appendChild(script);
  },
  beforeUnmount() {
    window.AsklyWidget?.destroy();
  }
}
</script>`}
              language="vue"
              filename="App.vue"
            />
          </div>

          {/* Vanilla HTML */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">Vanilla HTML</h3>
            <CodeBlock
              code={`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My Website with Askly</title>
</head>
<body>
  <h1>Welcome to My Website</h1>
  
  <!-- Your content here -->
  
  <!-- Askly Widget -->
  <script
    src="https://your-domain.com/widget.js"
    data-organization-id="org_xxxxxxxx"
    data-position="bottom-right"
  ></script>
</body>
</html>`}
              language="html"
              filename="index.html"
            />
          </div>
        </section>

        {/* Custom Positioning */}
        <section>
          <h2 className="text-3xl font-bold mb-4">Positioning Options</h2>
          <p className="mb-4">
            The widget can be positioned in two locations using the{" "}
            <code className="px-1.5 py-0.5 bg-muted rounded">data-position</code> attribute:
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-6 border rounded-lg">
              <h4 className="font-semibold mb-2">bottom-right (default)</h4>
              <p className="text-sm text-muted-foreground">
                Widget appears in the bottom-right corner of the screen. Recommended for most
                websites.
              </p>
              <CodeBlock
                code={`data-position="bottom-right"`}
                language="html"
              />
            </div>
            <div className="p-6 border rounded-lg">
              <h4 className="font-semibold mb-2">bottom-left</h4>
              <p className="text-sm text-muted-foreground">
                Widget appears in the bottom-left corner. Useful if you have other widgets on the
                right.
              </p>
              <CodeBlock
                code={`data-position="bottom-left"`}
                language="html"
              />
            </div>
          </div>
        </section>

        {/* Testing */}
        <section>
          <h2 className="text-3xl font-bold mb-4">Testing the Integration</h2>
          <div className="space-y-4">
            <p>After adding the script, verify the widget works correctly:</p>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">1. Check Widget Appears</h4>
              <p className="text-sm text-muted-foreground">
                Reload your page. You should see the Askly chat button in the configured position.
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">2. Test Chat Functionality</h4>
              <p className="text-sm text-muted-foreground">
                Click the widget button. The chat interface should open with your configured greeting
                message.
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">3. Send a Test Message</h4>
              <p className="text-sm text-muted-foreground">
                Type a test question and verify the AI responds appropriately based on your knowledge
                base.
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">4. Check Dashboard</h4>
              <p className="text-sm text-muted-foreground">
                Go to your Askly dashboard and verify the test conversation appears in the
                conversations list.
              </p>
            </div>
          </div>
        </section>

        {/* Best Practices */}
        <section>
          <h2 className="text-3xl font-bold mb-4">Best Practices</h2>
          <div className="space-y-3">
            <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-950/20 rounded-r-lg">
              <p className="text-sm">
                <strong>✓ Load the script asynchronously</strong> to avoid blocking page load
              </p>
            </div>
            <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-950/20 rounded-r-lg">
              <p className="text-sm">
                <strong>✓ Test on mobile devices</strong> to ensure the widget is responsive
              </p>
            </div>
            <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-950/20 rounded-r-lg">
              <p className="text-sm">
                <strong>✓ Add to all pages</strong> where you want support available
              </p>
            </div>
            <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-950/20 rounded-r-lg">
              <p className="text-sm">
                <strong>✓ Monitor analytics</strong> in the dashboard to understand user engagement
              </p>
            </div>
          </div>
        </section>

        {/* Troubleshooting */}
        <section className="mt-12 p-6 bg-muted/50 border rounded-lg">
          <h3 className="text-xl font-semibold mb-3">Having Issues?</h3>
          <p className="text-muted-foreground mb-4">
            If the widget doesn't appear or isn't working correctly, check the troubleshooting guide
            for common integration issues.
          </p>
          <a
            href="/docs/troubleshooting"
            className="inline-flex items-center text-primary hover:underline"
          >
            View Troubleshooting Guide →
          </a>
        </section>
      </div>
    </DocLayout>
  );
}
