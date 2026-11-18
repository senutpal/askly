import { v } from "convex/values";
import { query } from "../_generated/server";
import { widgetSettingsDocValidator } from "../lib/validators";

export const getByOrganizationId = query({
	args: {
		organizationId: v.string(),
	},
	returns: v.union(widgetSettingsDocValidator, v.null()),
	handler: async (ctx, args) => {
		return await ctx.db
			.query("widgetSettings")
			.withIndex("by_organization_id", (q) =>
				q.eq("organizationId", args.organizationId),
			)
			.unique();
	},
});
