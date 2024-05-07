import { BACKEND_URL } from "@/config";
import { SectionsBrowserType } from "@/types/dbTypes";
import axios from "axios";

export const getScheduleRequest = async (): Promise<SectionsBrowserType[]> => {
	return await axios
		.get(`${BACKEND_URL}/api/user/schedule/get/`, {
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
		})
		.then((response) => response.data);
};
