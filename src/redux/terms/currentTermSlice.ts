import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

const initialState = { id: "0", name: "0", date: 0, term_ident: "" };

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
