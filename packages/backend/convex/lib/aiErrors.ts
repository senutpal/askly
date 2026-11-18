import { APICallError, LoadAPIKeyError, RetryError } from "ai";

export type ProviderFailure = {
	code: string;
	message: string;
};

const statusFailure = (statusCode: number): ProviderFailure | null => {
	if (statusCode === 401 || statusCode === 403) {
		return {
			code: "INVALID_API_KEY",
			message: "The provider rejected the API key.",
		};
	}

	if (statusCode === 404) {
		return {
			code: "MODEL_NOT_FOUND",
			message: "The selected model is not available for this provider.",
		};
	}

	if (statusCode === 429) {
		return {
			code: "RATE_LIMITED",
			message: "The provider is rate limiting requests. Try again shortly.",
		};
	}

	if (statusCode >= 500) {
		return {
			code: "PROVIDER_UNAVAILABLE",
			message: "The provider is temporarily unavailable. Try again shortly.",
		};
	}

	if (statusCode >= 400) {
		return {
			code: "REQUEST_REJECTED",
			message:
				"The provider rejected the request. Check the model and base URL.",
		};
	}

	return null;
};

export const describeProviderFailure = (error: unknown): ProviderFailure => {
	if (RetryError.isInstance(error)) {
		return describeProviderFailure(error.lastError);
	}

	if (APICallError.isInstance(error) && error.statusCode) {
		const failure = statusFailure(error.statusCode);

		if (failure) {
			return failure;
		}
	}

	if (LoadAPIKeyError.isInstance(error)) {
		return {
			code: "MISSING_API_KEY",
			message: "No API key was provided.",
		};
	}

	return {
		code: "CONNECTION_FAILED",
		message:
			"Could not reach the provider. Check the API key, model, and base URL.",
	};
};
