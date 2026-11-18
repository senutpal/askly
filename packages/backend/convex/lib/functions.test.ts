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

const seedConversation = async () => {
	const t = setup();

	const ids = await t.run(async (ctx) => {
		const contactSessionId = await ctx.db.insert("contactSessions", {
			name: "Ada Lovelace",
			email: "ada@example.com",
			organizationId: "org_a",
			expiresAt: Date.now() + 60_000,
		});

		const conversationId = await ctx.db.insert("conversations", {
			threadId: "thread_a",
			organizationId: "org_a",
			contactSessionId,
			status: "unresolved",
		});

		return { contactSessionId, conversationId };
	});

	return { t, ...ids };
};

describe("authed functions", () => {
	it("rejects unauthenticated queries", async () => {
		const t = setup();

		await expectConvexError(t.query(api.private.conversations.getStats), {
			code: "UNAUTHORIZED",
			message: "Identity Not Found",
		});
	});

	it("rejects unauthenticated mutations", async () => {
		const t = setup();

		await expectConvexError(
			t.mutation(api.private.widgetSettings.upsert, {
				greetMessage: "Hello",
				defaultSuggestions: {},
				vapiSettings: {},
			}),
			{
				code: "UNAUTHORIZED",
				message: "Identity Not Found",
			},
		);
	});

	it("rejects mutations without an organization", async () => {
		const t = setup();

		await expectConvexError(
			t
				.withIdentity({ subject: "user_1" })
				.mutation(api.private.widgetSettings.upsert, {
					greetMessage: "Hello",
					defaultSuggestions: {},
					vapiSettings: {},
				}),
			{
				code: "UNAUTHORIZED",
				message: "Organization Not Found",
			},
		);
	});

	it("rejects unauthenticated actions", async () => {
		const t = setup();

		await expectConvexError(t.action(api.private.vapi.getPhoneNumbers), {
			code: "UNAUTHORIZED",
			message: "Identity Not Found",
		});
	});

	it("uses the authenticated organization for Vapi lookups", async () => {
		const t = setup();

		await t.action(internal.system.secrets.upsert, {
			organizationId: "org_a",
			service: "vapi",
			text: "invalid-credentials",
		});

		await expectConvexError(
			t
				.withIdentity({ orgId: "org_a" })
				.action(api.private.vapi.getPhoneNumbers),
			{
				code: "NOT_FOUND",
				message: "Credentials incomplete. Please reconnect your Vapi account",
			},
		);

		await expect(
			t
				.withIdentity({ orgId: "org_b" })
				.action(api.private.vapi.getPhoneNumbers),
		).rejects.toThrow("Plugin not found");
	});

	it("rejects Vapi credentials with empty keys", async () => {
		const t = setup();

		await t.action(internal.system.secrets.upsert, {
			organizationId: "org_a",
			service: "vapi",
			text: { privateApiKey: "", publicApiKey: "public-key" },
		});

		await expectConvexError(
			t
				.withIdentity({ orgId: "org_a" })
				.action(api.private.vapi.getPhoneNumbers),
			{
				code: "NOT_FOUND",
				message: "Credentials incomplete. Please reconnect your Vapi account",
			},
		);
	});

	it("creates widget settings for the authenticated organization", async () => {
		const t = setup();

		const settings = await t
			.withIdentity({ orgId: "org_a" })
			.mutation(api.private.widgetSettings.upsert, {
				greetMessage: "Hello",
				defaultSuggestions: { suggestion1: "Pricing" },
				vapiSettings: {},
			});

		expect(settings).toMatchObject({
			organizationId: "org_a",
			greetMessage: "Hello",
		});
	});

	it("rejects cross-organization conversation reads", async () => {
		const { t, conversationId } = await seedConversation();

		await expectConvexError(
			t
				.withIdentity({ orgId: "org_b" })
				.query(api.private.conversations.getOne, { conversationId }),
			{
				code: "UNAUTHORIZED",
				message: "Invalid Organization ID",
			},
		);
	});

	it("rejects cross-organization conversation updates", async () => {
		const { t, conversationId } = await seedConversation();

		await expectConvexError(
			t
				.withIdentity({ orgId: "org_b" })
				.mutation(api.private.conversations.updateStatus, {
					conversationId,
					status: "resolved",
				}),
			{
				code: "UNAUTHORIZED",
				message: "Conversation does not belong to your organization",
			},
		);
	});

	it("returns conversations to the owning organization", async () => {
		const { t, conversationId } = await seedConversation();

		const conversation = await t
			.withIdentity({ orgId: "org_a" })
			.query(api.private.conversations.getOne, { conversationId });

		expect(conversation).toMatchObject({
			_id: conversationId,
			organizationId: "org_a",
			status: "unresolved",
		});
		expect(conversation.contactSession).toMatchObject({
			name: "Ada Lovelace",
			organizationId: "org_a",
		});
	});
});
