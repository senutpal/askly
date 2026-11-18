import { v } from "convex/values";
import { internalMutation, internalQuery } from "../_generated/server";
import { pluginDocValidator, pluginServiceValidator } from "../lib/validators";

export const upsert = internalMutation({
	args: {
		service: pluginServiceValidator,
		organizationId: v.string(),
		secretContent: v.string(),
		iv: v.string(),
		authTag: v.string(),
	},
	returns: v.null(),
	async handler(ctx, args) {
		const existingPlugin = await ctx.db
			.query("plugins")
			.withIndex("by_organization_id_and_service", (q) =>
				q.eq("organizationId", args.organizationId).eq("service", args.service),
			)
			.first();

		if (existingPlugin) {
			await ctx.db.patch(existingPlugin._id, {
				secretContent: args.secretContent,
				iv: args.iv,
				authTag: args.authTag,
			});
		} else {
			await ctx.db.insert("plugins", {
				organizationId: args.organizationId,
				service: args.service,
				secretContent: args.secretContent,
				iv: args.iv,
				authTag: args.authTag,
			});
		}

		return null;
	},
});

export const getByOrganizationIdAndService = internalQuery({
	args: {
		service: pluginServiceValidator,
		organizationId: v.string(),
	},
	returns: v.union(pluginDocValidator, v.null()),
	handler: async (ctx, args) => {
		return await ctx.db
			.query("plugins")
			.withIndex("by_organization_id_and_service", (q) =>
				q.eq("organizationId", args.organizationId).eq("service", args.service),
			)
			.first();
	},
});

export const remove = internalMutation({
	args: {
		service: pluginServiceValidator,
		organizationId: v.string(),
	},
	returns: v.null(),
	handler: async (ctx, args) => {
		const existingPlugin = await ctx.db
			.query("plugins")
			.withIndex("by_organization_id_and_service", (q) =>
				q.eq("organizationId", args.organizationId).eq("service", args.service),
			)
			.unique();

		if (existingPlugin) {
			await ctx.db.delete(existingPlugin._id);
		}

		return null;
	},
});
