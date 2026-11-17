import type { DatabaseReader, MutationCtx } from "../_generated/server";

const statuses = ["unresolved", "escalated", "resolved"] as const;

export type ConversationStatus = (typeof statuses)[number];

export const conversationStatsCap = 200;

export const countConversations = async (
	db: DatabaseReader,
	organizationId: string,
) => {
	const counts: Record<ConversationStatus, number> = {
		unresolved: 0,
		escalated: 0,
		resolved: 0,
	};
	let approximate = false;

	for (const status of statuses) {
		const conversations = await db
			.query("conversations")
			.withIndex("by_status_and_organization_id", (q) =>
				q.eq("status", status).eq("organizationId", organizationId),
			)
			.take(conversationStatsCap);

		counts[status] = conversations.length;
		if (conversations.length === conversationStatsCap) {
			approximate = true;
		}
	}

	return { counts, approximate };
};

export const adjustConversationStats = async (
	ctx: MutationCtx,
	args: {
		organizationId: string;
		from?: ConversationStatus;
		to?: ConversationStatus;
	},
) => {
	if (args.from === args.to) return;

	const stats = await ctx.db
		.query("conversationStats")
		.withIndex("by_organization_id", (q) =>
			q.eq("organizationId", args.organizationId),
		)
		.unique();

	if (!stats) {
		const { counts, approximate } = await countConversations(
			ctx.db,
			args.organizationId,
		);

		await ctx.db.insert("conversationStats", {
			organizationId: args.organizationId,
			unresolved: counts.unresolved,
			escalated: counts.escalated,
			resolved: counts.resolved,
			approximate,
			updatedAt: Date.now(),
		});
		return;
	}

	const changes: Partial<Record<ConversationStatus, number>> = {};
	if (args.from) {
		changes[args.from] = Math.max(0, stats[args.from] - 1);
	}
	if (args.to) {
		changes[args.to] = stats[args.to] + 1;
	}

	await ctx.db.patch(stats._id, {
		...changes,
		updatedAt: Date.now(),
	});
};
