import { NavigationCard } from "@/modules/docs/components/NavigationCard";
import { documentationNavigation } from "@/modules/docs/config/navigation";
import Link from "next/link";

export default function DocsPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center px-4">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="text-2xl font-bold">ASKLY</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/docs"
              className="transition-colors hover:text-foreground/80 text-foreground"
            >
              Documentation
            </Link>
            <Link
              href="https://github.com/senutpal/askly"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              GitHub
            </Link>
          </nav>
        </div>
      </header>

      <div className="container px-4 py-16 max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <h1 className="text-5xl font-bold mb-4">
            Welcome to Askly Documentation
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive guides and documentation to help you start working with
            Askly as quickly as possible. Transform campus communication with
            intelligent multilingual chatbot support.
          </p>
        </div>

        {/* Quick Links */}
        <div className="mb-16">
          <div className="grid gap-6 md:grid-cols-3">
            <Link
              href="/docs/getting-started"
              className="block p-6 border-2 rounded-lg hover:border-primary hover:shadow-lg transition-all group"
            >
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                Quick Start
              </h3>
              <p className="text-muted-foreground">
                Get Askly up and running in minutes
              </p>
            </Link>

            <Link
              href="/docs/integration"
              className="block p-6 border-2 rounded-lg hover:border-primary hover:shadow-lg transition-all group"
            >
              <div className="text-4xl mb-4">🔌</div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                Integration
              </h3>
              <p className="text-muted-foreground">
                Embed the widget on your website
              </p>
            </Link>

            <Link
              href="/docs/api-reference"
              className="block p-6 border-2 rounded-lg hover:border-primary hover:shadow-lg transition-all group"
            >
              <div className="text-4xl mb-4">🔧</div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                API Reference
              </h3>
              <p className="text-muted-foreground">
                Explore the complete API documentation
              </p>
            </Link>
          </div>
        </div>

        {/* Documentation Sections */}
        {documentationNavigation.map((group) => (
          <div key={group.group} className="mb-12">
            <h2 className="text-2xl font-bold mb-6">{group.group}</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {group.sections.map((section) => (
                <NavigationCard
                  key={section.href}
                  title={section.title}
                  description={section.description}
                  href={section.href}
                  icon={section.icon}
                />
              ))}
            </div>
          </div>
        ))}

        {/* Footer CTA */}
        <div className="mt-16 p-8 border rounded-lg text-center bg-muted/50">
          <h3 className="text-2xl font-bold mb-4">Ready to get started?</h3>
          <p className="text-muted-foreground mb-6">
            Clone the repository and start building with Askly today
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/docs/getting-started"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="https://github.com/senutpal/askly"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg border font-medium hover:bg-accent transition-colors"
            >
              View on GitHub
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
