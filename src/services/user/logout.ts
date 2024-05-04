import { userLogoutEP } from "@/server_eps";
import axios from "axios";

/**
 * Queries API to fetch user information.
 * @returns {Promise<UserType>} User information.
 */
export const logoutUser = async () => {
	return await axios.get(userLogoutEP(), {
		withCredentials: true,
	});
};
