import { UserType } from "@/types/userTypes";
import axios from "axios";
import { authWithDiscordEP } from "../../server_eps";
import { SectionsBrowserType } from "@/types/dbTypes";

export async function authWithDiscord(code: string) {
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
					return response.data as {
						user: UserType;
						schedule: SectionsBrowserType[];
					};
				})
		: Promise.reject("Invalid code");
}
