import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

const initialState = { code: "0", name: "0" };

export const currentTermSlice = createSlice({
	name: "currentTerm",
	initialState,
	reducers: {
		set: (_state, action) => {
			return action.payload;
		},
	},
});

export const selectCurrentTerm = (state: RootState) => state.currentTerm;
export const { set } = currentTermSlice.actions;
export default currentTermSlice.reducer;
