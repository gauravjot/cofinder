import { EP_USER_INFO } from "@/server_eps";
import { UserInfoType } from "@/types/userTypes";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

/**
 * Queries API to fetch user information.
 * @param auth_token
 * @returns user information
 */
export const queryFetchUserInfo = (auth_token: string) => {
	return useQuery({
		queryKey: ["user-info" + auth_token.slice(0, 4)],
		queryFn: () => {
			return auth_token.length > 0
				? axios
						.get(EP_USER_INFO, {
							headers: {
								"Content-Type": "application/json",
								Authorization: auth_token,
							},
						})
						.then((res) => {
							return res.data as UserInfoType;
						})
				: Promise.reject("No auth token provided");
		},
	});
};
