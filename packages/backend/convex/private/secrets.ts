import { v } from "convex/values";
import { internal } from "../_generated/api";
import { authedAction } from "../lib/functions";
import { pluginServiceValidator, secretValidator } from "../lib/validators";

export const upsert = authedAction({
	args: {
		service: pluginServiceValidator,
		value: secretValidator,
	},
	returns: v.null(),
	handler: async (ctx, args) => {
		await ctx.runAction(internal.system.secrets.upsert, {
			service: args.service,
			organizationId: ctx.orgId,
			text: args.value,
		});

		return null;
	},
});
