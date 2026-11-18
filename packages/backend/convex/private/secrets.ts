import { v } from "convex/values";
import { internal } from "../_generated/api";
import { authedMutation } from "../lib/functions";
import { pluginServiceValidator, secretValidator } from "../lib/validators";

export const upsert = authedMutation({
	args: {
		service: pluginServiceValidator,
		value: secretValidator,
	},
	returns: v.null(),
	handler: async (ctx, args) => {
		await ctx.scheduler.runAfter(0, internal.system.secrets.upsert, {
			service: args.service,
			organizationId: ctx.orgId,
			text: args.value,
		});

		return null;
	},
});
