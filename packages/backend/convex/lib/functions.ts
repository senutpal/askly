import type { UserIdentity } from "convex/server";
import { ConvexError } from "convex/values";
import {
	customAction,
	customMutation,
	customQuery,
} from "convex-helpers/server/customFunctions";
import { action, mutation, query } from "../_generated/server";

type AuthCtx = {
	auth: {
		getUserIdentity: () => Promise<UserIdentity | null>;
	};
};

const resolveAuth = async (ctx: AuthCtx) => {
	const identity = await ctx.auth.getUserIdentity();

	if (!identity) {
		throw new ConvexError({
			code: "UNAUTHORIZED",
			message: "Identity Not Found",
		});
	}

	const orgId =
		typeof identity.orgId === "string" && identity.orgId.length > 0
			? identity.orgId
			: null;

	if (!orgId) {
		throw new ConvexError({
			code: "UNAUTHORIZED",
			message: "Organization Not Found",
		});
	}

	return { identity, orgId };
};

export const authedQuery = customQuery(query, {
	args: {},
	input: async (ctx) => ({ ctx: await resolveAuth(ctx), args: {} }),
});

export const authedMutation = customMutation(mutation, {
	args: {},
	input: async (ctx) => ({ ctx: await resolveAuth(ctx), args: {} }),
});

export const authedAction = customAction(action, {
	args: {},
	input: async (ctx) => ({ ctx: await resolveAuth(ctx), args: {} }),
});
