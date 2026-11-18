"use client";

import { api } from "@workspace/backend/_generated/api";
import type { Id } from "@workspace/backend/_generated/dataModel";
import {
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@workspace/ui";
import { useAction, useMutation, usePaginatedQuery } from "convex/react";
import { ConvexError } from "convex/values";
import { useQuery } from "convex-helpers/react/cache/hooks";
import { CheckCircleIcon, GlobeIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { CompleteStep, type ImportFailure } from "./complete-step";
import { CrawlInputStep } from "./crawl-input-step";
import { CrawlProgressStep } from "./crawl-progress-step";
import { ImportProgressStep } from "./import-progress-step";
import { ResultsSelectionStep } from "./results-selection-step";

type CrawlStep = "input" | "crawling" | "results" | "importing" | "complete";

/** Mirrors MAX_RESOURCES_PER_JOB in the backend crawler. */
const MAX_IMPORT_RESOURCES = 100;

/** Surface the backend's friendly ConvexError message when there is one. */
function getErrorMessage(error: unknown, fallback: string): string {
	if (error instanceof ConvexError) {
		const data = error.data;
		if (typeof data === "string") return data;
		if (
			data &&
			typeof data === "object" &&
			"message" in data &&
			typeof (data as { message?: unknown }).message === "string"
		) {
			return (data as { message: string }).message;
		}
	}
	return error instanceof Error ? error.message : fallback;
}

interface WebCrawlerDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export const WebCrawlerDialog = ({
	open,
	onOpenChange,
}: WebCrawlerDialogProps) => {
	const startCrawl = useAction(api.private.webCrawl.startCrawl);
	const addSingleResource = useAction(api.private.webCrawl.addSingleResource);
	const cancelCrawl = useMutation(api.private.webCrawl.cancelCrawl);

	const [step, setStep] = useState<CrawlStep>("input");
	const [url, setUrl] = useState("");
	const [maxDepth, setMaxDepth] = useState("1");
	const [includeImages, setIncludeImages] = useState(true);
	const [includePdfs, setIncludePdfs] = useState(true);
	const [includeText, setIncludeText] = useState(true);
	const [crawlError, setCrawlError] = useState<string | null>(null);
	const [isCancelling, setIsCancelling] = useState(false);
	const [autoSelected, setAutoSelected] = useState(false);

	const [jobId, setJobId] = useState<Id<"crawlJobs"> | null>(null);

	const [selectedResourceIds, setSelectedResourceIds] = useState<Set<string>>(
		new Set(),
	);

	const [importProgress, setImportProgress] = useState({
		current: 0,
		total: 0,
		successful: 0,
		failed: 0,
	});
	const [importFailures, setImportFailures] = useState<ImportFailure[]>([]);

	const job = useQuery(api.private.webCrawl.getJob, jobId ? { jobId } : "skip");

	const results = usePaginatedQuery(
		api.private.webCrawl.getResults,
		jobId ? { jobId } : "skip",
		{ initialNumItems: 50 },
	);

	useEffect(() => {
		if (step !== "crawling") return;

		if (job?.status === "completed") {
			setStep("results");
			return;
		}

		if (job?.status === "failed") {
			setCrawlError(job.error || "Crawl failed");
			setStep("input");
			return;
		}

		if (job?.status === "cancelled") {
			setCrawlError("Crawl cancelled");
			setStep("input");
		}
	}, [step, job?.status, job?.error]);

	useEffect(() => {
		if (step !== "results" || autoSelected) return;
		if (results.status === "LoadingFirstPage") return;

		setAutoSelected(true);
		// Preselect small result sets. Larger crawls start with nothing
		// selected so one click can never import hundreds of pages by accident.
		const total = job?.resourcesFound ?? results.results.length;
		if (total > 0 && total <= 50) {
			setSelectedResourceIds(new Set(results.results.map((r) => r._id)));
		}
	}, [
		step,
		autoSelected,
		results.status,
		results.results,
		job?.resourcesFound,
	]);

	const handleStartCrawl = async () => {
		setCrawlError(null);
		setAutoSelected(false);
		setSelectedResourceIds(new Set());

		try {
			new URL(url);
		} catch {
			setCrawlError("Please enter a valid URL");
			return;
		}

		setStep("crawling");

		try {
			const result = await startCrawl({
				url: url.trim(),
				maxDepth: parseInt(maxDepth, 10),
				options: {
					includeImages,
					includePdfs,
					includeText,
				},
			});

			setJobId(result.jobId);
		} catch (error) {
			console.error(error);
			setCrawlError(getErrorMessage(error, "Failed to start crawl"));
			setStep("input");
		}
	};

	const handleCancelCrawl = async () => {
		if (!jobId) return;

		setIsCancelling(true);
		try {
			await cancelCrawl({ jobId });
		} catch (error) {
			console.error(error);
			setCrawlError(getErrorMessage(error, "Failed to cancel crawl"));
		} finally {
			setIsCancelling(false);
		}
	};

	const handleImport = async () => {
		if (selectedResourceIds.size === 0 || !jobId) return;

		setCrawlError(null);
		setImportFailures([]);
		setStep("importing");
		setImportProgress({
			current: 0,
			total: selectedResourceIds.size,
			successful: 0,
			failed: 0,
		});

		const ids = Array.from(selectedResourceIds) as Id<"crawlResults">[];
		const failures: ImportFailure[] = [];
		let successful = 0;
		let failed = 0;

		let i = 0;
		for (const resourceId of ids) {
			try {
				const result = await addSingleResource({
					jobId,
					resourceId,
				});

				if (result.success) {
					successful++;
				} else {
					failed++;
					failures.push({
						url: result.url,
						error: result.error || "Failed to import",
						title: result.title,
					});
				}
			} catch (error) {
				failed++;
				failures.push({
					url: `Resource ${resourceId}`,
					error: getErrorMessage(error, "Failed to import"),
					title: "Unknown",
				});
			}

			i++;
			setImportProgress({
				current: i,
				total: ids.length,
				successful,
				failed,
			});
		}

		setImportFailures(failures);
		setStep("complete");
		if (failed === 0) {
			setTimeout(() => {
				handleClose();
			}, 2000);
		}
	};

	const handleClose = () => {
		onOpenChange(false);
		setTimeout(() => {
			setStep("input");
			setUrl("");
			setMaxDepth("1");
			setIncludeImages(true);
			setIncludePdfs(true);
			setIncludeText(true);
			setCrawlError(null);
			setIsCancelling(false);
			setAutoSelected(false);
			setJobId(null);
			setSelectedResourceIds(new Set());
			setImportProgress({ current: 0, total: 0, successful: 0, failed: 0 });
			setImportFailures([]);
		}, 1000);
	};

	const toggleResource = (resourceId: string) => {
		const newSelected = new Set(selectedResourceIds);
		if (newSelected.has(resourceId)) {
			newSelected.delete(resourceId);
		} else {
			newSelected.add(resourceId);
		}
		setSelectedResourceIds(newSelected);
	};

	const toggleSelectAll = (filteredResults: Array<{ _id: string }> = []) => {
		const filteredIds = new Set(filteredResults.map((r) => r._id));
		const allFilteredSelected = filteredResults.every((r) =>
			selectedResourceIds.has(r._id),
		);

		if (allFilteredSelected) {
			setSelectedResourceIds((prev) => {
				const newSet = new Set(prev);
				filteredIds.forEach((id) => {
					newSet.delete(id);
				});
				return newSet;
			});
		} else {
			setSelectedResourceIds((prev) => {
				const newSet = new Set(prev);
				filteredIds.forEach((id) => {
					newSet.add(id);
				});
				return newSet;
			});
		}
	};

	const selectByType = (type: "text" | "image" | "pdf") => {
		const resourcesOfType = results.results.filter((r) => r.type === type);
		setSelectedResourceIds(new Set(resourcesOfType.map((r) => r._id)));
	};

	const getDialogTitle = () => {
		switch (step) {
			case "complete":
				return "Import Complete";
			default:
				return "Crawl Website";
		}
	};

	const getDialogDescription = () => {
		switch (step) {
			case "input":
				return "Extract content from websites to add to your knowledge base";
			case "crawling":
				return "Discovering resources on the website...";
			case "results":
				return "Select resources to import";
			case "importing":
				return "Importing selected resources...";
			case "complete":
				return "Resources imported successfully";
			default:
				return "";
		}
	};

	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogContent className="w-full bg-background/80 dark:bg-zinc-800 backdrop-blur-xl sm:rounded-3xl max-w-3xl sm:min-w-2xl md:min-w-3xl">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<GlobeIcon className="size-5" />
						{getDialogTitle()}
					</DialogTitle>
					<DialogDescription>{getDialogDescription()}</DialogDescription>
				</DialogHeader>

				{crawlError && step !== "input" && (
					<p
						role="alert"
						className="rounded-xl bg-destructive/10 px-4 py-2.5 text-sm text-destructive"
					>
						{crawlError}
					</p>
				)}

				{step === "input" && (
					<CrawlInputStep
						url={url}
						maxDepth={maxDepth}
						includeImages={includeImages}
						includePdfs={includePdfs}
						includeText={includeText}
						crawlError={crawlError}
						onUrlChange={setUrl}
						onMaxDepthChange={setMaxDepth}
						onIncludeImagesChange={setIncludeImages}
						onIncludePdfsChange={setIncludePdfs}
						onIncludeTextChange={setIncludeText}
						onSubmit={handleStartCrawl}
					/>
				)}

				{step === "crawling" && (
					<CrawlProgressStep
						pagesVisited={job?.pagesVisited}
						resourcesFound={job?.resourcesFound}
						onCancel={handleCancelCrawl}
						isCancelling={isCancelling}
					/>
				)}

				{step === "results" && (
					<ResultsSelectionStep
						results={results.results}
						selectedResourceIds={selectedResourceIds}
						totalCount={job?.resourcesFound}
						importLimit={MAX_IMPORT_RESOURCES}
						canLoadMore={results.status === "CanLoadMore"}
						isLoading={
							results.status === "LoadingFirstPage" ||
							results.status === "LoadingMore"
						}
						onLoadMore={() => results.loadMore(50)}
						onToggleResource={toggleResource}
						onToggleSelectAll={toggleSelectAll}
						onSelectByType={selectByType}
					/>
				)}

				{step === "importing" && (
					<ImportProgressStep
						current={importProgress.current}
						total={importProgress.total}
					/>
				)}

				{step === "complete" && (
					<CompleteStep
						successful={importProgress.successful}
						failed={importProgress.failed}
						failures={importFailures}
					/>
				)}

				<DialogFooter>
					{step === "input" && (
						<>
							<Button onClick={handleClose} variant="outline">
								Cancel
							</Button>
							<Button
								onClick={handleStartCrawl}
								disabled={!url || url.trim() === ""}
							>
								<GlobeIcon className="size-4 mr-2" />
								Start Crawling
							</Button>
						</>
					)}

					{step === "results" && (
						<>
							<Button onClick={handleClose} variant="outline">
								Cancel
							</Button>
							<Button
								onClick={handleImport}
								disabled={
									selectedResourceIds.size === 0 ||
									selectedResourceIds.size > MAX_IMPORT_RESOURCES
								}
							>
								Import {selectedResourceIds.size} Resource
								{selectedResourceIds.size !== 1 && "s"}
							</Button>
						</>
					)}

					{step === "complete" && (
						<Button onClick={handleClose}>
							<CheckCircleIcon className="size-4 mr-2" />
							Done
						</Button>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
