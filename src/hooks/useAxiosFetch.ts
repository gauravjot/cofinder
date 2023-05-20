import axios from "axios";
import { handleApiError } from "services/handle_error";
import { ResponseType } from "types/apiResponseType";
import { ApiError } from "../types/apiResponseType";

export function axiosFetch<T>(url: string): Promise<ResponseType<T | ApiError>> {
	return axios
		.get(url)
		.then(function (response) {
			return {
				success: true,
				res: response.data.courses as T,
			} as ResponseType<T>;
		})
		.catch(handleApiError);
}
