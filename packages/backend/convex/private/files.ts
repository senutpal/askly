import {
	contentHashFromArrayBuffer,
	type Entry,
	type EntryId,
	guessMimeTypeFromContents,
	guessMimeTypeFromExtension,
	vEntryId,
} from "@convex-dev/rag";
import { paginationOptsValidator } from "convex/server";
import { ConvexError, v } from "convex/values";
import { internal } from "../_generated/api";
import type { Id } from "../_generated/dataModel";
import type { QueryCtx } from "../_generated/server";
import { extractTextContent } from "../lib/extractTextContent";
import { authedAction, authedMutation, authedQuery } from "../lib/functions";
import { fileListValidator, fileUploadValidator } from "../lib/validators";
import { createOrganizationRAG, createRagForEmbedding } from "../system/ai/rag";
import { resolveAiSettings } from "../system/ai/settings";

function guessMimeType(filename: string, bytes: ArrayBuffer): string {
	return (
		guessMimeTypeFromExtension(filename) ||
		guessMimeTypeFromContents(bytes) ||
		"application/octet-stream"
	);
}

export const deleteFile = authedMutation({
	args: { entryId: vEntryId },
	returns: v.null(),
	handler: async (ctx, args) => {
		const settings = resolveAiSettings(
			await ctx.runQuery(internal.system.ai.settings.getForOrganization, {
				organizationId: ctx.orgId,
			}),
		);
		const { rag, namespace } = createRagForEmbedding(
			ctx.orgId,
			settings.embedding,
		);

		const namespaceDoc = await rag.getNamespace(ctx, { namespace });

		if (!namespaceDoc) {
			throw new ConvexError({
				code: "UNAUTHORIZED",
				message: "Invalid Namespace",
			});
		}

		const entry = await rag.getEntry(ctx, {
			entryId: args.entryId,
		});

		if (!entry) {
			throw new ConvexError({
				code: "NOT_FOUND",
				message: "Entry not Found",
			});
		}

		if (entry.metadata?.uploadedBy !== ctx.orgId) {
			throw new ConvexError({
				code: "UNAUTHORIZED",
				message: "Invalid Organization",
			});
		}

		const metadata = entry.metadata;

		if (isEntryMetadata(metadata)) {
			await ctx.storage.delete(metadata.storageId);
		}

		await rag.deleteAsync(ctx, {
			entryId: args.entryId,
		});

		return null;
	},
});

export const addFile = authedAction({
	args: {
		filename: v.string(),
		mimeType: v.string(),
		bytes: v.bytes(),
		category: v.optional(v.string()),
	},
	returns: fileUploadValidator,
	handler: async (ctx, args) => {
		const { bytes, filename, category } = args;
		const mimeType = args.mimeType || guessMimeType(filename, bytes);

		const blob = new Blob([bytes], { type: mimeType });

		const storageId = await ctx.storage.store(blob);

		const text = await extractTextContent(ctx, {
			storageId,
			filename,
			bytes,
			mimeType,
			organizationId: ctx.orgId,
		});

		const { rag, namespace } = await createOrganizationRAG(ctx, ctx.orgId);

		const { entryId, created } = await rag.add(ctx, {
			namespace,
			text,
			key: filename,
			metadata: {
				storageId,
				uploadedBy: ctx.orgId,
				filename,
				category: category ?? null,
			} satisfies EntryMetadata,
			contentHash: await contentHashFromArrayBuffer(bytes),
		});

		let url: string | null = null;

		if (!created) {
			console.debug("Entry already exists, skipping upload metadata");
			await ctx.storage.delete(storageId);

			const existingEntry = await rag.getEntry(ctx, { entryId });
			const existingMetadata = existingEntry?.metadata;

			url =
				existingMetadata && isEntryMetadata(existingMetadata)
					? await ctx.storage.getUrl(existingMetadata.storageId)
					: null;
		} else {
			url = await ctx.storage.getUrl(storageId);
		}

		return {
			url,
			entryId,
		};
	},
});

export const list = authedQuery({
	args: {
		paginationOpts: paginationOptsValidator,
	},
	returns: fileListValidator,
	handler: async (ctx, args) => {
		const settings = resolveAiSettings(
			await ctx.runQuery(internal.system.ai.settings.getForOrganization, {
				organizationId: ctx.orgId,
			}),
		);
		const { rag, namespace } = createRagForEmbedding(
			ctx.orgId,
			settings.embedding,
		);

		const namespaceDoc = await rag.getNamespace(ctx, { namespace });

		if (!namespaceDoc) {
			return { page: [], isDone: true, continueCursor: "" };
		}

		const results = await rag.list(ctx, {
			namespaceId: namespaceDoc.namespaceId,
			paginationOpts: args.paginationOpts,
		});

		const files = await Promise.all(
			results.page.map((entry) => convertEntryToPublicFile(ctx, entry)),
		);

		return {
			page: files,
			isDone: results.isDone,
			continueCursor: results.continueCursor,
		};
	},
});

export type PublicFile = {
	id: EntryId;
	name: string;
	type: string;
	size: string;
	status: "ready" | "processing" | "error";
	url: string | null;
	category?: string;
};

type EntryMetadata = {
	storageId: Id<"_storage">;
	uploadedBy: string;
	filename: string;
	category: string | null;
};

function isEntryMetadata(value: unknown): value is EntryMetadata {
	if (typeof value !== "object" || value === null) {
		return false;
	}

	return (
		"storageId" in value &&
		typeof value.storageId === "string" &&
		"uploadedBy" in value &&
		typeof value.uploadedBy === "string" &&
		"filename" in value &&
		typeof value.filename === "string" &&
		"category" in value &&
		(value.category === null || typeof value.category === "string")
	);
}

async function convertEntryToPublicFile(
	ctx: QueryCtx,
	entry: Entry,
): Promise<PublicFile> {
	const rawMetadata = entry.metadata;
	const metadata = isEntryMetadata(rawMetadata) ? rawMetadata : null;
	const storageId = metadata?.storageId ?? null;

	let fileSize = "unknown";

	if (storageId) {
		try {
			const storageMetadata = await ctx.db.system.get(storageId);

			if (storageMetadata) {
				fileSize = formatFileSize(storageMetadata.size);
			}
		} catch (error) {
			console.error("Failed to get storage metadata:", error);
		}
	}
	const filename = entry.key || "Unknown";
	const extension = filename.split(".").pop()?.toLowerCase() || "txt";

	let status: "ready" | "processing" | "error" = "error";

	if (entry.status === "ready") {
		status = "ready";
	} else if (entry.status === "pending") {
		status = "processing";
	}

	const url = storageId ? await ctx.storage.getUrl(storageId) : null;

	return {
		id: entry.entryId,
		name: filename,
		type: extension,
		size: fileSize,
		status,
		url,
		category: metadata?.category || undefined,
	};
}

function formatFileSize(bytes: number): string {
	if (bytes === 0) {
		return "0 B";
	}
	const k = 1024;
	const sizes = ["B", "KB", "MB", "GB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return `${Number.parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`;
}
