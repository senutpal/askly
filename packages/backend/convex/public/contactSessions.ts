import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { consumeRateLimit, RATE_LIMITS } from "../lib/rateLimit";

const SESSION_DURATION = 24 * 60 * 60 * 1000;
const MAX_NAME_LENGTH = 120;
const MAX_EMAIL_LENGTH = 254;

export const create = mutation({
	args: {
		name: v.string(),
		email: v.string(),
		organizationId: v.string(),
		metadata: v.optional(
			v.object({
				userAgent: v.optional(v.string()),
				language: v.optional(v.string()),
				languages: v.optional(v.string()),
				platform: v.optional(v.string()),
				vendor: v.optional(v.string()),
				screenResolution: v.optional(v.string()),
				viewportSize: v.optional(v.string()),
				timezone: v.optional(v.string()),
				timezoneOffset: v.optional(v.number()),
				cookieEnabled: v.optional(v.boolean()),
				referrer: v.optional(v.string()),
				currentUrl: v.optional(v.string()),
			}),
		),
	},
	handler: async (ctx, args) => {
		const name = args.name.trim();
		if (!name) {
			throw new Error("Name is required");
		}
		if (name.length > MAX_NAME_LENGTH) {
			throw new Error("Name is too long");
		}

		const email = args.email.trim().toLowerCase();
		if (email.length > MAX_EMAIL_LENGTH) {
			throw new Error("Email is too long");
		}
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			throw new Error("Invalid email format");
		}

		const widgetSettings = await ctx.db
			.query("widgetSettings")
			.withIndex("by_organization_id", (q) =>
				q.eq("organizationId", args.organizationId),
			)
			.first();

		if (!widgetSettings) {
			throw new Error("Organization not found");
		}

		// Only charge known organizations: the organization id is client
		// supplied, and charging unknown ids would let a caller grow the
		// rate-limit table at will.
		await consumeRateLimit(
			ctx,
			`contact-session:org:${args.organizationId}`,
			RATE_LIMITS.contactSessionPerOrganization,
		);

		const now = Date.now();
		const expiresAt = now + SESSION_DURATION;

		const contactSessionId = await ctx.db.insert("contactSessions", {
			name,
			email,
			organizationId: args.organizationId,
			expiresAt,
			metadata: args.metadata,
		});

		return contactSessionId;
	},
});

export const validate = mutation({
	args: {
		contactSessionId: v.id("contactSessions"),
	},
	handler: async (ctx, args) => {
		const contactSession = await ctx.db.get(args.contactSessionId);

		if (!contactSession) {
			return { valid: false, reason: "Contact session not found" };
		}

		if (contactSession.expiresAt < Date.now()) {
			return { valid: false, reason: "Contact session expired" };
		}

		return {
			valid: true,
			contactSession: {
				_id: contactSession._id,
				organizationId: contactSession.organizationId,
				expiresAt: contactSession.expiresAt,
			},
		};
	},
});
