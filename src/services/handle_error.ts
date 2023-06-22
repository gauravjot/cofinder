import axios, { AxiosError } from "axios";
import { ResponseType } from "@/types/apiResponseType";
import { ApiError } from "@/types/apiResponseType";

export function handleApiError(err: Error | AxiosError): ResponseType<ApiError> {
	if (axios.isAxiosError(err)) {
		return {
			success: false,
			res: {
				message:
					err.response && err.response.data
						? err.response.data
						: err.response?.statusText
						? err.response.statusText
						: err.message
						? err.message
						: "Unable to reach server.",
			},
		};
	} else {
		return {
			success: false,
			res: {
				message: "Unknown",
			},
		};
	}
}
