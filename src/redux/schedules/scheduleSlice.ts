import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { SectionsBrowserType } from "@/types/dbTypes";

const initialState: SectionsBrowserType[] = [];

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
			state.push(action.payload);
		},
		remove: (state, action) => {
			let schedule = state.filter((entry) => {
				return entry.crn !== action.payload.crn;
			});
			return schedule;
		},
	},
});

export const selectAllSchedules = (state: RootState) => state.mySchedule;
export const { set, clear, add, remove } = scheduleSlice.actions;
export default scheduleSlice.reducer;
