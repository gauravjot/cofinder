import { EP_USER_INFO } from "@/server_eps";
import { UserType } from "@/types/userTypes";
import axios from "axios";

/**
 * Queries API to fetch user information.
 * @returns {Promise<UserType>} User information.
 */
export const getUserInfo = async (): Promise<UserType> => {
	return await axios
		.get(EP_USER_INFO, {
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
		})
		.then((res) => {
			return res.data as UserType;
		});
};
