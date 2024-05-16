import { EP_SAVE_BULK_SCHEDULE } from "@/server_eps";
import { MyScheduleTypeItem } from "@/types/stateTypes";
import axios from "axios";

export default function alterBulkSchedule(data: MyScheduleTypeItem[]) {
	return axios.post(
		EP_SAVE_BULK_SCHEDULE,
		{
			data: data,
		},
		{
			headers: {
				"Content-Type": "multipart/form-data",
			},
			withCredentials: true,
		}
	);
}
