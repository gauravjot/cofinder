import axios, { AxiosError } from "axios";

export function handleApiError(err: Error | AxiosError) {
	if (axios.isAxiosError(err)) {
		return {
			success: false,
			res:
				err.response && err.response.data
					? err.response.data
					: err.response?.statusText || "Unable to reach server.",
		};
	} else {
		return {
			success: false,
			res: {
				statusCode: "Unknown",
				message: "Unknown",
			},
		};
	}
}
