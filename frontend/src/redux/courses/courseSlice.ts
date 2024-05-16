import { RootState } from "@/redux/store";
import { createSlice } from "@reduxjs/toolkit";

const initialState = { courses: [], fetched: 0 };

export const courseSlice = createSlice({
	name: "courses",
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

export const selectAllCourses = (state: RootState) => state.courses;

export const { set, clear } = courseSlice.actions;
export default courseSlice.reducer;
