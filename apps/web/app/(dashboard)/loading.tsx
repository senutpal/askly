export default function Loading() {
	return (
		<output
			aria-live="polite"
			className="flex min-h-[60vh] w-full items-center justify-center p-6"
		>
			<div
				aria-hidden="true"
				className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent motion-safe:animate-spin"
			/>
			<span className="sr-only">Loading</span>
		</output>
	);
}
