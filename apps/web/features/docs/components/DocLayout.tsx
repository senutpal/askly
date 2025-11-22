"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { documentationNavigation } from "../config/navigation";

interface DocLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export const DocLayout = ({ children, title, description }: DocLayoutProps) => {
  const pathname = usePathname();

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

      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10 px-4 py-8">
        {/* Sidebar */}
        <aside className="fixed top-16 z-30 hidden h-[calc(100vh-4rem)] w-full shrink-0 overflow-y-auto border-r md:sticky md:block">
          <div className="py-6 pr-6 lg:py-8">
            {documentationNavigation.map((group) => (
              <div key={group.group} className="mb-6">
                <h4 className="mb-3 text-sm font-semibold">{group.group}</h4>
                <div className="space-y-1">
                  {group.sections.map((section) => {
                    const isActive = pathname === section.href;
                    return (
                      <Link
                        key={section.href}
                        href={section.href}
                        className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                          isActive
                            ? "bg-accent text-accent-foreground font-medium"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                        }`}
                      >
                        {section.icon && <span className="mr-2">{section.icon}</span>}
                        {section.title}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="relative py-6 lg:gap-10 lg:py-8">
          <div className="mx-auto w-full min-w-0">
            {/* Page Header */}
            <div className="mb-8 space-y-2">
              <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
              {description && (
                <p className="text-lg text-muted-foreground">{description}</p>
              )}
            </div>

            {/* Page Content */}
            <div className="prose prose-slate dark:prose-invert max-w-none">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
