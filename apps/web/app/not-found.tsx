import Link from "next/link";
import { Button } from "@workspace/ui";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-6">
        <h1 className="text-9xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          404
        </h1>
        <h2 className="text-3xl font-semibold">Page Not Found</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. Please check the URL or return to the homepage.
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <Link href="/">
            <Button size="lg">Go Home</Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="lg">Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
