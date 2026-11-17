"use client";

import { Button } from "@workspace/ui";
import Link from "next/link";
import { useEffect } from "react";

export default function DashboardError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<div className="flex min-h-[60vh] w-full items-center justify-center p-6">
			<div className="max-w-md space-y-4 text-center">
				<h1 className="text-2xl font-semibold tracking-tight">
					Something went wrong
				</h1>
				<p className="text-sm text-muted-foreground">
					The dashboard could not load this page. Try again or head back to the
					overview.
				</p>
				<div className="flex justify-center gap-3">
					<Button onClick={reset}>Try again</Button>
					<Link href="/">
						<Button variant="outline">Back to overview</Button>
					</Link>
				</div>
			</div>
		</div>
	);
}
