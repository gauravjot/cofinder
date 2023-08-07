import { MyScheduleTypeItem } from "@/types/stateTypes";
import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import alterSchedule from "@/services/user/section/alter_schedule";

const initialState: MyScheduleTypeItem[] = [];

export const scheduleSlice = createSlice({
	name: "mySchedule",
	initialState,
	reducers: {
		set: (_state, action) => {
			return action.payload;
		},
		clear: (_state) => {
			return initialState;
		},
		add: (state, action) => {
			state.push({
				section: action.payload[0].section,
				term: action.payload[0].term,
			});
			let schedulesInTerm = state.filter((s) => s.term === action.payload[0].term);
			let schList: string[] = [];
			for (let i = 0; i < schedulesInTerm.length; i++) {
				schList.push(schedulesInTerm[i].section.toString());
			}
			// Send network request
			alterSchedule(action.payload[0].term, schList, action.payload[0].userToken);
		},
		remove: (state, action) => {
			let schedule = state.filter((entry) => {
				return entry.section.toString() !== action.payload[0].section.toString();
			});
			let schedulesInTerm = schedule.filter(
				(s) => s.term === action.payload[0].term
			);
			let schList: string[] = [];
			for (let i = 0; i < schedulesInTerm.length; i++) {
				schList.push(schedulesInTerm[i].section.toString());
			}
			// Send network request
			alterSchedule(action.payload[0].term, schList, action.payload[0].userToken);
			return schedule;
		},
	},
});

export const selectAllSchedules = (state: RootState) => state.mySchedule;
export const { set, clear, add, remove } = scheduleSlice.actions;
export default scheduleSlice.reducer;
