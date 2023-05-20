import axios from "axios";
import { handleApiError } from "services/handle_error";
import { ApiCourseType, ApiError, ResponseType } from "types/apiResponseType";

export function userLogin(
	email: string,
	password: string
): Promise<ResponseType<ApiCourseType | ApiError>> {
	return axios
		.get()
		.then(function (response) {
			return {
				success: response.data.success,
				res: response.data.data,
			} as ResponseType<ApiCourseType>;
		})
		.catch(handleApiError);
}
