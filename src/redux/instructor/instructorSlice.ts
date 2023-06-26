import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

const initialState = { instructors: [], fetched: 0 };

export const instructorSlice = createSlice({
	name: "instructors",
	initialState,
	reducers: {
		set: (_state, action) => {
			return action.payload;
		},
		clear: (_state) => {
			return initialState;
		},
	},
});

export const selectAllInstructors = (state: RootState) => state.instructors;
export const { set, clear } = instructorSlice.actions;
export default instructorSlice.reducer;
