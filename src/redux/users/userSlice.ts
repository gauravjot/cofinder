import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { UserType } from "../../types/userTypes";

const initialState: UserType | null = null;

export const userSlice = createSlice({
	name: "subjects",
	initialState,
	reducers: {
		setUser: (_state, action) => {
			return action.payload;
		},
		clearUser: (_state) => {
			return initialState;
		},
	},
});

export const selectUser = (state: RootState): UserType | null => state.user;
export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
