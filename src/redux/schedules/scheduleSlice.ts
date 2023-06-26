import { MyScheduleTypeItem } from "@/types/stateTypes";
import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

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
		},
		remove: (state, action) => {
			state.filter((entry) => entry.section !== action.payload);
		},
	},
});

export const selectAllSchedules = (state: RootState) => state.mySchedule;
export const { set, clear, add, remove } = scheduleSlice.actions;
export default scheduleSlice.reducer;
