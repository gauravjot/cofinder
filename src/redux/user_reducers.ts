import { Reducer, AnyAction } from "redux";
import { LOGOUT_USER, SET_USER } from "@/redux/user_actions";
import { UserType } from "@/types/userTypes";

/*
 * User reducer
 */
export const userReducer: Reducer<UserType | null, AnyAction> = (
	state: UserType | null = null,
	action: AnyAction
) => {
	const { type, payload } = action;
	switch (type) {
		case LOGOUT_USER:
			return (state = null);
		case SET_USER:
			return (state = payload);
		default:
			return state;
	}
};
