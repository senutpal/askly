import { ConvexError, v } from "convex/values";
import { authedMutation, authedQuery } from "../lib/functions";
import { pluginDocValidator, pluginServiceValidator } from "../lib/validators";

export const remove = authedMutation({
	args: {
		service: pluginServiceValidator,
	},
	returns: v.null(),
	handler: async (ctx, args) => {
		const existingPlugin = await ctx.db
			.query("plugins")
			.withIndex("by_organization_id_and_service", (q) =>
				q.eq("organizationId", ctx.orgId).eq("service", args.service),
			)
			.unique();

		if (!existingPlugin) {
			throw new ConvexError({
				code: "NOT FOUND",
				message: "Plugin Not Found",
			});
		}

		await ctx.db.delete(existingPlugin._id);

		return null;
	},
});

export const getOne = authedQuery({
	args: {
		service: pluginServiceValidator,
	},
	returns: v.union(pluginDocValidator, v.null()),
	handler: async (ctx, args) => {
		return await ctx.db
			.query("plugins")
			.withIndex("by_organization_id_and_service", (q) =>
				q.eq("organizationId", ctx.orgId).eq("service", args.service),
			)
			.unique();
	},
});
