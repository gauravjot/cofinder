import { saveScheduleEP } from "@/server_eps";
import { QueryScheduleSaveType } from "@/types/apiResponseType";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export default function useSaveSchedule() {
	return useMutation({
		mutationFn: (schedule: QueryScheduleSaveType) => {
			return axios.post(
				saveScheduleEP(schedule.term),
				schedule.schedules.join("--")
			);
		},
	});
}
