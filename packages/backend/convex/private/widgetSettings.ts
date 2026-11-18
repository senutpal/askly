import { v } from "convex/values";
import { authedMutation, authedQuery } from "../lib/functions";
import {
	defaultSuggestionsValidator,
	vapiSettingsValidator,
	widgetSettingsDocValidator,
} from "../lib/validators";

export const upsert = authedMutation({
	args: {
		greetMessage: v.string(),
		defaultSuggestions: defaultSuggestionsValidator,
		vapiSettings: vapiSettingsValidator,
	},
	returns: v.union(widgetSettingsDocValidator, v.null()),
	handler: async (ctx, args) => {
		const existingWidgetSettings = await ctx.db
			.query("widgetSettings")
			.withIndex("by_organization_id", (q) => q.eq("organizationId", ctx.orgId))
			.unique();

		if (existingWidgetSettings) {
			await ctx.db.patch(existingWidgetSettings._id, {
				greetMessage: args.greetMessage,
				defaultSuggestions: args.defaultSuggestions,
				vapiSettings: args.vapiSettings,
			});
			return await ctx.db.get(existingWidgetSettings._id);
		}

		const newId = await ctx.db.insert("widgetSettings", {
			organizationId: ctx.orgId,
			greetMessage: args.greetMessage,
			defaultSuggestions: args.defaultSuggestions,
			vapiSettings: args.vapiSettings,
		});
		return await ctx.db.get(newId);
	},
});

export const getOne = authedQuery({
	args: {},
	returns: v.union(widgetSettingsDocValidator, v.null()),
	handler: async (ctx) => {
		return await ctx.db
			.query("widgetSettings")
			.withIndex("by_organization_id", (q) => q.eq("organizationId", ctx.orgId))
			.unique();
	},
});
