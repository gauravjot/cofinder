import { UserType } from "@/types/userTypes";
import axios from "axios";
import { authWithDiscordEP } from "../../server_eps";

export async function authWithDiscord(code: string): Promise<UserType> {
	return code.length > 0
		? await axios
				.post(
					authWithDiscordEP(),
					{
						code: code,
					},
					{
						headers: {
							"Content-Type": "application/json",
						},
						withCredentials: true,
					}
				)
				.then(function (response) {
					return response.data as UserType;
				})
		: Promise.reject("Invalid code");
}
