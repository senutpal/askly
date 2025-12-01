import { generateText } from "ai";
import type { StorageActionWriter } from "convex/server";
import { assert } from "convex-helpers";
import type { Id } from "../_generated/dataModel";
import type { ActionCtx } from "../_generated/server";
import { createGoogleAI } from "../system/ai/helpers";

const SUPPORTED_IMAGE_TYPES = [
	"image/jpeg",
	"image/png",
	"image/webp",
	"image/gif",
] as const;

const SYSTEM_PROMPTS = {
	images:
		"Turn images to text. If it's a document, transcribe it. If it's not a document, describe it.",
	pdf: "You transform PDF files into text.",
	html: "You transform content into markdown format.",
};

export type ExtractTextContentArgs = {
	storageId: Id<"_storage">;
	filename: string;
	bytes?: ArrayBuffer;
	mimeType: string;
	organizationId: string;
};

export async function extractTextContent(
	ctx: { storage: StorageActionWriter } & ActionCtx,
	args: ExtractTextContentArgs,
): Promise<string> {
	const { storageId, filename, bytes, mimeType, organizationId } = args;
	const url = await ctx.storage.getUrl(storageId);
	assert(url, "Failed to get storage url");

	if (SUPPORTED_IMAGE_TYPES.some((type) => type === mimeType)) {
		return extractImageText(ctx, organizationId, url);
	}

	if (mimeType.toLowerCase().includes("pdf")) {
		return extractPdfText(ctx, organizationId, url, mimeType, filename);
	}

	if (mimeType.toLowerCase().includes("text")) {
		return extractTextFileContent(
			ctx,
			organizationId,
			storageId,
			bytes,
			mimeType,
		);
	}

	throw new Error(`Unsupported MIME type ${mimeType}`);
}

async function extractTextFileContent(
	ctx: { storage: StorageActionWriter } & ActionCtx,
	organizationId: string,
	storageId: Id<"_storage">,
	bytes: ArrayBuffer | undefined,
	mimeType: string,
): Promise<string> {
	const arrayBuffer =
		bytes || (await (await ctx.storage.get(storageId))?.arrayBuffer());

	if (!arrayBuffer) {
		throw new Error("Failed to get file content");
	}

	const text = new TextDecoder().decode(arrayBuffer);

	if (mimeType.toLowerCase() !== "text/plain") {
		const model = await createGoogleAI(ctx, organizationId, "gemini-2.5-flash");
		const result = await generateText({
			model,
			system: SYSTEM_PROMPTS.html,
			messages: [
				{
					role: "user",
					content: [
						{
							type: "text",
							text,
						},
						{
							type: "text",
							text: "Extract the text and print it in markdown format without explaining that you will do so.",
						},
					],
				},
			],
		});

		return result.text;
	}

	return text;
}

async function extractPdfText(
	ctx: ActionCtx,
	organizationId: string,
	url: string,
	mimeType: string,
	filename: string,
): Promise<string> {
	const model = await createGoogleAI(ctx, organizationId, "gemini-2.5-pro");
	const result = await generateText({
		model,
		system: SYSTEM_PROMPTS.pdf,
		messages: [
			{
				role: "user",
				content: [
					{
						type: "file",
						data: new URL(url),
						//CHECK THIS FOR ERROR
						mediaType: mimeType,
						filename,
					},
					{
						type: "text",
						text: "Extract the text from the PDF and print it without explaining you will do so.",
					},
				],
			},
		],
	});

	return result.text;
}

async function extractImageText(
	ctx: ActionCtx,
	organizationId: string,
	url: string,
): Promise<string> {
	const model = await createGoogleAI(ctx, organizationId, "gemini-2.5-flash");
	const result = await generateText({
		model,
		system: SYSTEM_PROMPTS.images,
		messages: [
			{
				role: "user",
				content: [{ type: "image", image: new URL(url) }],
			},
		],
	});

	return result.text;
}
