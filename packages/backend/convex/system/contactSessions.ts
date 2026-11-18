import { v } from "convex/values";
import { internalQuery } from "../_generated/server";
import { contactSessionDocValidator } from "../lib/validators";

export const getOne = internalQuery({
	args: {
		contactSessionId: v.id("contactSessions"),
	},
	returns: v.union(contactSessionDocValidator, v.null()),
	handler: async (ctx, args) => {
		return await ctx.db.get(args.contactSessionId);
	},
});
