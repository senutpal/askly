export const envExamples = {
  web: `# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx

# Convex
NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud
CONVEX_DEPLOYMENT=your-deployment-name

# URLs
NEXT_PUBLIC_WIDGET_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000`,

  widget: `# Convex
NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud

# Vapi Voice
NEXT_PUBLIC_VAPI_PUBLIC_KEY=your-vapi-public-key
VAPI_PRIVATE_KEY=your-vapi-private-key`,

  embed: `# Widget URL (where the chat widget is hosted)
VITE_WIDGET_URL=http://localhost:3001`,

  backend: `# AI Providers
GOOGLE_GENERATIVE_AI_API_KEY=xxxxx

# Vapi Server
VAPI_API_KEY=xxxxx

# Clerk (for backend)
CLERK_SECRET_KEY=sk_test_xxxxx

# Security
MASTER_KEY=your-master-key-min-32-chars`,
};

export const codeExamples = {
  embedBasic: `<script
  src="https://your-domain.com/widget.js"
  data-organization-id="org_xxxxxxxx"
  data-position="bottom-right"
></script>`,

  embedReact: `import { useEffect } from 'react';

function App() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://your-domain.com/widget.js';
    script.setAttribute('data-organization-id', 'org_xxxxxxxx');
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
      window.AsklyWidget?.destroy();
    };
  }, []);

  return <div>Your App</div>;
}`,

  embedNextjs: `import Script from 'next/script';

export default function Layout({ children }) {
  return (
    <>
      <Script
        src="https://your-domain.com/widget.js"
        data-organization-id="org_xxxxxxxx"
        strategy="lazyOnload"
      />
      {children}
    </>
  );
}`,

  programmaticControl: `// Initialize or reinitialize
window.AsklyWidget.init({
  organizationId: 'org_xxxxxxxx',
  position: 'bottom-left' // or 'bottom-right'
});

// Show widget
window.AsklyWidget.show();

// Hide widget
window.AsklyWidget.hide();

// Destroy widget
window.AsklyWidget.destroy();`,

  installCommands: {
    clone: `git clone https://github.com/senutpal/askly.git
cd askly`,
    install: `pnpm install`,
    setupBackend: `cd packages/backend
pnpm run setup`,
    dev: `pnpm dev`,
    build: `pnpm build`,
  },
};
