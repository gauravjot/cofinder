import { BACKEND_URL } from "@/config";
import { SectionsBrowserType } from "@/types/dbTypes";
import axios from "axios";

export type RemoveScheduleRequestType = { section: number; term: string }[];

export const removeScheduleRequest = async (
	payload: RemoveScheduleRequestType
): Promise<SectionsBrowserType[]> => {
	return await axios
		.post(
			`${BACKEND_URL}/api/user/schedule/remove/`,
			{
				schedule: payload,
			},
			{
				headers: {
					"Content-Type": "application/json",
				},
				withCredentials: true,
			}
		)
		.then((response) => response.data);
};
