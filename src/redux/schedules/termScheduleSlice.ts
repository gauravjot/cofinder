import { SectionsBrowserType } from "@/types/dbTypes";
import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

const initialState: { sections: SectionsBrowserType[]; fetched: number } = {
	sections: [],
	fetched: 0,
};

export const termScheduleSlice = createSlice({
	name: "detailedSchedule",
	initialState,
	reducers: {
		set: (_state, action) => {
			return action.payload;
		},
		clear: (_state) => {
			return initialState;
		},
		add: (state, action) => {
			state.sections.push(action.payload);
			state.fetched = new Date().getTime();
		},
		remove: (state, action) => {
			state.sections.filter((section) => section.crn !== action.payload);
		},
	},
});

export const selectAllTermSchedules = (state: RootState) => state.termSchedule;
export const { set, clear, add, remove } = termScheduleSlice.actions;
export default termScheduleSlice.reducer;
