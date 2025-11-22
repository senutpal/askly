import { DocLayout } from "@/modules/docs/components/DocLayout";
import { CodeBlock } from "@/modules/docs/components/CodeBlock";

export default function ContributingPage() {
  return (
    <DocLayout
      title="Contributing"
      description="Contribute to Askly open source project"
    >
      <div className="space-y-8">
        {/* Welcome */}
        <section>
          <p className="text-lg">
            Thank you for your interest in contributing to Askly! This project is open source under
            the GPL v3.0 license. We welcome contributions from the community.
          </p>
        </section>

        {/* Ways to Contribute */}
        <section>
          <h2 className="text-3xl font-bold mb-4">Ways to Contribute</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-semibold mb-2">🐛 Report Bugs</h3>
              <p className="text-sm text-muted-foreground">
                Found a bug? Create an issue on GitHub with detailed reproduction steps.
              </p>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-semibold mb-2">✨ Suggest Features</h3>
              <p className="text-sm text-muted-foreground">
                Have an idea? Share it! Open an issue labeled "feature request".
              </p>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-semibold mb-2">📝 Improve Docs</h3>
              <p className="text-sm text-muted-foreground">
                Help others learn! Submit pull requests to improve documentation.
              </p>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-semibold mb-2">💻 Write Code</h3>
              <p className="text-sm text-muted-foreground">
                Fix bugs, add features, or refactor code. All contributions welcome!
              </p>
            </div>
          </div>
        </section>

        {/* Development Setup */}
        <section>
          <h2 className="text-3xl font-bold mb-4">Development Setup</h2>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">1. Fork and Clone</h4>
              <CodeBlock
                code={`# Fork the repo on GitHub, then:
git clone https://github.com/YOUR_USERNAME/askly.git
cd askly`}
                language="bash"
              />
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">2. Install Dependencies</h4>
              <CodeBlock code="pnpm install" language="bash" />
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">3. Create Branch</h4>
              <CodeBlock code="git checkout -b feature/your-feature-name" language="bash" />
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">4. Make Changes</h4>
              <p className="text-sm text-muted-foreground">
                Follow the code style and ensure tests pass
              </p>
            </div>
          </div>
        </section>

        {/* Code Style */}
        <section>
          <h2 className="text-3xl font-bold mb-4">Code Style Guidelines</h2>
          <div className="space-y-3">
            <div className="p-4 border-l-4 border-primary bg-muted/50 rounded-r-lg">
              <p className="text-sm">✓ Use TypeScript for type safety</p>
            </div>
            <div className="p-4 border-l-4 border-primary bg-muted/50 rounded-r-lg">
              <p className="text-sm">✓ Format code with Prettier before committing</p>
            </div>
            <div className="p-4 border-l-4 border-primary bg-muted/50 rounded-r-lg">
              <p className="text-sm">✓ Run linter and fix issues: <code className="px-1.5 py-0.5 bg-muted rounded">pnpm lint</code></p>
            </div>
            <div className="p-4 border-l-4 border-primary bg-muted/50 rounded-r-lg">
              <p className="text-sm">✓ Write meaningful commit messages</p>
            </div>
            <div className="p-4 border-l-4 border-primary bg-muted/50 rounded-r-lg">
              <p className="text-sm">✓ Keep pull requests focused on a single feature/fix</p>
            </div>
          </div>
        </section>

        {/* Pull Request Process */}
        <section>
          <h2 className="text-3xl font-bold mb-4">Submitting Pull Requests</h2>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Before Submitting</h4>
              <CodeBlock
                code={`# Format code
pnpm format

# Run linter
pnpm lint

# Check types
pnpm typecheck

# Test build
pnpm build`}
                language="bash"
              />
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Commit and Push</h4>
              <CodeBlock
                code={`git add .
git commit -m "feat: add amazing feature"
git push origin feature/your-feature-name`}
                language="bash"
              />
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Create PR</h4>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Go to GitHub and create pull request</li>
                <li>• Describe your changes clearly</li>
                <li>• Reference any related issues</li>
                <li>• Wait for review and address feedback</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Commit Convention */}
        <section>
          <h2 className="text-3xl font-bold mb-4">Commit Message Convention</h2>
          <p className="mb-4">Use conventional commits format:</p>
          <div className="space-y-2">
            <CodeBlock code="feat: add new feature" language="text" />
            <CodeBlock code="fix: resolve bug in widget loading" language="text" />
            <CodeBlock code="docs: update installation guide" language="text" />
            <CodeBlock code="refactor: improve code structure" language="text" />
            <CodeBlock code="chore: update dependencies" language="text" />
          </div>
        </section>

        {/* License */}
        <section>
          <h2 className="text-3xl font-bold mb-4">License</h2>
          <div className="p-6 border rounded-lg">
            <p className="mb-4">
              Askly is licensed under the GNU General Public License v3.0. By contributing, you
              agree that your contributions will be licensed under the same license.
            </p>
            <a
              href="https://github.com/senutpal/askly/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              View Full License →
            </a>
          </div>
        </section>

        {/* Community */}
        <section className="mt-8 p-8 border rounded-lg bg-muted/50">
          <h3 className="text-2xl font-bold mb-4">Join the Community</h3>
          <p className="mb-4">
            Connect with other contributors and users:
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span>⭐</span>
              <a
                href="https://github.com/senutpal/askly"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Star the project on GitHub
              </a>
            </div>
            <div className="flex items-center gap-3">
              <span>🐛</span>
              <a
                href="https://github.com/senutpal/askly/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Report issues or request features
              </a>
            </div>
            <div className="flex items-center gap-3">
              <span>💬</span>
              <a
                href="https://github.com/senutpal/askly/discussions"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Join discussions
              </a>
            </div>
          </div>
        </section>
      </div>
    </DocLayout>
  );
}
