import { BACKEND_URL } from "@/config";
import { SectionsBrowserType } from "@/types/dbTypes";
import axios from "axios";

export type AddScheduleRequestType = { section: number; term: string }[];

export const addScheduleRequest = async (
	payload: AddScheduleRequestType
): Promise<SectionsBrowserType[]> => {
	return await axios
		.post(
			`${BACKEND_URL}/api/user/schedule/add/`,
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
