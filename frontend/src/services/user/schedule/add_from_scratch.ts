import { BACKEND_URL } from "@/config";
import { SectionsBrowserType } from "@/types/dbTypes";
import axios from "axios";

export type AddFromScratchScheduleRequestType = { section: number; term: string }[];

/**
 * Remove all exisiting schedules and add new schedules
 * @param payload
 * @returns
 */
export const addFromScratchScheduleRequest = async (
	payload: AddFromScratchScheduleRequestType
): Promise<SectionsBrowserType[]> => {
	return await axios
		.post(
			`${BACKEND_URL}/api/user/schedule/add_from_scratch/`,
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
