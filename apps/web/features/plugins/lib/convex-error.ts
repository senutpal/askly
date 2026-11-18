import { ConvexError } from "convex/values";

type ConvexErrorData = {
	code?: string;
	message?: string;
};

const parseErrorData = (data: unknown): ConvexErrorData | null => {
	if (typeof data === "string") {
		try {
			return parseErrorData(JSON.parse(data));
		} catch {
			return { message: data };
		}
	}

	if (data && typeof data === "object") {
		const { code, message } = data as { code?: unknown; message?: unknown };

		return {
			code: typeof code === "string" ? code : undefined,
			message: typeof message === "string" ? message : undefined,
		};
	}

	return null;
};

export const getConvexErrorData = (error: unknown) => {
	if (error instanceof ConvexError) {
		return parseErrorData(error.data);
	}

	return null;
};

export const getErrorMessage = (error: unknown, fallback: string) =>
	getConvexErrorData(error)?.message ??
	(error instanceof Error ? error.message : fallback);
