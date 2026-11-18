import { createClerkClient } from "@clerk/backend";
import { v } from "convex/values";
import { action } from "../_generated/server";
import { organizationValidationValidator } from "../lib/validators";

export const validate = action({
	args: {
		organizationId: v.string(),
	},
	returns: organizationValidationValidator,
	handler: async (_, args) => {
		try {
			// Construct the client lazily so a missing CLERK_SECRET_KEY cannot throw
			// at module import / push time.
			const secretKey = process.env.CLERK_SECRET_KEY;
			if (!secretKey) {
				return { valid: false, reason: "Failed to validate organization" };
			}
			const clerkClient = createClerkClient({ secretKey });

			await clerkClient.organizations.getOrganization({
				organizationId: args.organizationId,
			});

			return { valid: true };
		} catch (error) {
			console.error("Organization validation error:", error);
			if (error instanceof Error) {
				return {
					valid: false,
					reason: error.message.includes("not found")
						? "Organization not found"
						: "Failed to validate organization",
				};
			}
			return { valid: false, reason: "Failed to validate organization" };
		}
	},
});
