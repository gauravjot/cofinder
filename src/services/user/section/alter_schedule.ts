import { saveScheduleEP } from "@/server_eps";
import axios from "axios";

export default function alterSchedule(term_id: string, schList: string[]) {
	axios.post(
		saveScheduleEP(term_id),
		{
			schedule: schList.join("--"),
		},
		{
			headers: {
				"Content-Type": "multipart/form-data",
			},
			withCredentials: true,
		}
	);
}
