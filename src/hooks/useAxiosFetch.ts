import axios, { AxiosError } from "axios";
import { ResponseType } from "types/apiResponseType";

export function axiosFetch<T>(url: string): Promise<ResponseType> {
	return axios
		.get(url)
		.then(function (response) {
			return {
				success: true,
				res: response.data as T,
			};
		})
		.catch(handleApiError);
}
