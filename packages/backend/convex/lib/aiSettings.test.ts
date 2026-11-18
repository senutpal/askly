import { ConvexError } from "convex/values";
import { convexTest } from "convex-test";
import { afterAll, describe, expect, it } from "vitest";
import { api, internal } from "../_generated/api";
import schema from "../schema";

declare global {
	interface ImportMeta {
		glob(patterns: string[]): Record<string, () => Promise<unknown>>;
	}
}

const modules = import.meta.glob(["../**/*.ts", "!../**/*.test.ts"]);

const originalMasterKey = process.env.MASTER_KEY;
process.env.MASTER_KEY = "test-master-key";

afterAll(() => {
	if (originalMasterKey === undefined) {
		delete process.env.MASTER_KEY;
	} else {
		process.env.MASTER_KEY = originalMasterKey;
	}
});

const setup = () => convexTest(schema, modules);

const expectConvexError = async (
	promise: Promise<unknown>,
	expected: { code: string; message: string },
) => {
	let error: unknown;

	try {
		await promise;
	} catch (caught) {
		error = caught;
	}

	expect(error).toBeInstanceOf(ConvexError);

	if (!(error instanceof ConvexError)) {
		return;
	}

	const data: unknown = error.data;

	expect(typeof data).toBe("string");

	if (typeof data !== "string") {
		return;
	}

	expect(JSON.parse(data)).toEqual(expected);
};

const saveOpenAi = (
	t: ReturnType<typeof setup>,
	organizationId: string,
	options: { acknowledgeReembed?: boolean; apiKey?: string } = {},
) =>
	t
		.withIdentity({ orgId: organizationId })
		.action(api.private.aiSettings.save, {
			provider: "openai",
			model: "gpt-6.2-sol",
			apiKey: options.apiKey ?? "sk-test-openai",
			acknowledgeReembed: options.acknowledgeReembed ?? true,
		});

describe("AI settings", () => {
	it("falls back to Gemini defaults for legacy organizations", async () => {
		const t = setup();

		const view = await t
			.withIdentity({ orgId: "org_a" })
			.query(api.private.aiSettings.get);

		expect(view).toEqual({
			provider: "google",
			model: "gemini-3.5-flash-lite",
			baseUrl: null,
			hasApiKey: false,
			keys: { google: false, openai: false, anthropic: false },
			embeddingProvider: "google",
			embeddingModel: "gemini-embedding-001",
			embeddingDimension: 3072,
			embeddingHasApiKey: false,
			reembedRequired: false,
		});
	});

	it("rejects a provider without a stored or submitted key", async () => {
		const t = setup();

		await expectConvexError(saveOpenAi(t, "org_a", { apiKey: "" }), {
			code: "MISSING_API_KEY",
			message: "Enter your OpenAI API key.",
		});
	});

	it("requires acknowledging a knowledge base re-embed", async () => {
		const t = setup();

		await expectConvexError(
			saveOpenAi(t, "org_a", { acknowledgeReembed: false }),
			{
				code: "REEMBED_REQUIRED",
				message:
					"Changing the embedding provider requires re-embedding the knowledge base. Acknowledge the warning to continue.",
			},
		);
	});

	it("persists the provider and keeps the key encrypted", async () => {
		const t = setup();

		await saveOpenAi(t, "org_a", { apiKey: "sk-secret-value" });

		const view = await t
			.withIdentity({ orgId: "org_a" })
			.query(api.private.aiSettings.get);

		expect(view).toMatchObject({
			provider: "openai",
			model: "gpt-6.2-sol",
			hasApiKey: true,
			keys: { google: false, openai: true, anthropic: false },
			embeddingProvider: "openai",
			embeddingModel: "text-embedding-3-large",
			embeddingDimension: 3072,
			embeddingHasApiKey: true,
			reembedRequired: true,
		});
		expect(JSON.stringify(view)).not.toContain("sk-secret-value");

		const decrypted = await t.action(
			internal.system.secrets.getByOrganizationIdAndService,
			{
				organizationId: "org_a",
				service: "openai",
			},
		);

		expect(decrypted).toBe("sk-secret-value");

		const stored = await t.run(
			async (ctx) =>
				await ctx.db
					.query("plugins")
					.withIndex("by_organization_id_and_service", (q) =>
						q.eq("organizationId", "org_a").eq("service", "openai"),
					)
					.unique(),
		);

		expect(stored?.secretContent).not.toContain("sk-secret-value");
	});

	it("keeps settings and keys isolated between organizations", async () => {
		const t = setup();

		await saveOpenAi(t, "org_a");

		const view = await t
			.withIdentity({ orgId: "org_b" })
			.query(api.private.aiSettings.get);

		expect(view).toMatchObject({
			provider: "google",
			hasApiKey: false,
			keys: { google: false, openai: false, anthropic: false },
			reembedRequired: false,
		});

		await expect(
			t.action(internal.system.secrets.getByOrganizationIdAndService, {
				organizationId: "org_b",
				service: "openai",
			}),
		).rejects.toThrow("Plugin not found");
	});

	it("reuses a stored key when only the model changes", async () => {
		const t = setup();

		await t
			.withIdentity({ orgId: "org_a" })
			.action(api.private.aiSettings.save, {
				provider: "google",
				model: "gemini-3.5-flash-lite",
				apiKey: "google-key",
			});

		await t
			.withIdentity({ orgId: "org_a" })
			.action(api.private.aiSettings.save, {
				provider: "google",
				model: "gemini-4-argon",
			});

		const view = await t
			.withIdentity({ orgId: "org_a" })
			.query(api.private.aiSettings.get);

		expect(view).toMatchObject({
			provider: "google",
			model: "gemini-4-argon",
			hasApiKey: true,
		});
	});

	it("requires a Google key for Anthropic embeddings", async () => {
		const t = setup();

		await expectConvexError(
			t.withIdentity({ orgId: "org_a" }).action(api.private.aiSettings.save, {
				provider: "anthropic",
				model: "claude-sonnet-5-5",
				apiKey: "sk-ant-test",
			}),
			{
				code: "MISSING_EMBEDDING_API_KEY",
				message:
					"Enter your Google AI API key. Knowledge base embeddings use Google.",
			},
		);
	});

	it("keeps Google embeddings for Anthropic without a re-embed warning", async () => {
		const t = setup();

		const view = await t
			.withIdentity({ orgId: "org_a" })
			.action(api.private.aiSettings.save, {
				provider: "anthropic",
				model: "claude-sonnet-5-5",
				apiKey: "sk-ant-test",
				embeddingApiKey: "google-key",
			});

		expect(view).toEqual({ reembedRequired: false });

		const settings = await t
			.withIdentity({ orgId: "org_a" })
			.query(api.private.aiSettings.get);

		expect(settings).toMatchObject({
			provider: "anthropic",
			embeddingProvider: "google",
			embeddingModel: "gemini-embedding-001",
			embeddingHasApiKey: true,
			reembedRequired: false,
		});
	});

	it("reports a missing key without contacting the provider", async () => {
		const t = setup();

		const result = await t
			.withIdentity({ orgId: "org_a" })
			.action(api.private.aiSettings.testConnection, {
				provider: "openai",
				model: "gpt-6.2-sol",
			});

		expect(result).toEqual({
			ok: false,
			code: "MISSING_API_KEY",
			message: "Enter your OpenAI API key.",
		});
	});

	it("refuses to remove a key that is in use", async () => {
		const t = setup();

		await t
			.withIdentity({ orgId: "org_a" })
			.action(api.private.aiSettings.save, {
				provider: "anthropic",
				model: "claude-sonnet-5-5",
				apiKey: "sk-ant-test",
				embeddingApiKey: "google-key",
			});

		await expectConvexError(
			t
				.withIdentity({ orgId: "org_a" })
				.action(api.private.aiSettings.removeKey, { provider: "anthropic" }),
			{
				code: "KEY_IN_USE",
				message: "Switch to another provider before removing this key.",
			},
		);
	});

	it("clears the re-embed warning after confirmation", async () => {
		const t = setup();

		await saveOpenAi(t, "org_a");
		await t
			.withIdentity({ orgId: "org_a" })
			.mutation(api.private.aiSettings.confirmReembed);

		const view = await t
			.withIdentity({ orgId: "org_a" })
			.query(api.private.aiSettings.get);

		expect(view.reembedRequired).toBe(false);
	});
});
