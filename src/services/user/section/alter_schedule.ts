import { saveScheduleEP } from "@/server_eps";
import axios from "axios";

export default function alterSchedule(
	term_id: string,
	schList: string[],
	auth_token: string
) {
	if (auth_token && auth_token.length > 0) {
		axios.post(
			saveScheduleEP(term_id),
			{
				schedule: schList.join("--"),
			},
			{
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: auth_token,
				},
			}
		);
	}
}
