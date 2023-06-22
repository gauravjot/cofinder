import { UserType } from "@/types/userTypes";

/*
 * User
 */
export const SET_USER = "SET_USER";
export const LOGOUT_USER = "LOGOUT_USER";

export const setUser = (list: UserType) => {
	return {
		type: SET_USER,
		payload: list,
	};
};

export const logoutUser = () => {
	return {
		type: LOGOUT_USER,
	};
};
