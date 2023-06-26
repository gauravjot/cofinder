import React from "react";
import axios from "axios";
import { handleApiError } from "@/services/handle_error";
import { ApiError, ResponseType } from "@/types/apiResponseType";
import { useAppDispatch } from "@/redux/hooks";
import { UserType } from "@/types/userTypes";
import { startSessionEP } from "@/server_eps";
import { setUser } from "@/redux/users/userSlice";

function reachServer(sut: string): Promise<ResponseType<UserType | ApiError>> {
	return axios
		.get(startSessionEP(sut))
		.then(function (response) {
			return {
				success: true,
				res: {
					name: response.data.user.name,
					provider_uid: response.data.user.provider_uid,
					token: response.data.session.token,
				} as UserType,
			} as ResponseType<UserType>;
		})
		.catch(handleApiError);
}

/*
 *
 */
export function useStartSession(sut: string): UserType {
	const [data, setData] = React.useState<UserType>({
		name: "",
		provider_uid: "0",
		token: "",
	});
	const dispatch = useAppDispatch();

	const apiCall = React.useCallback(async (sut: string) => {
		const response = await reachServer(sut);

		if (response.success) {
			return response.res as UserType;
		} else {
			let error = response.res as ApiError;
			throw new Error(error.message);
		}
	}, []);

	React.useEffect(() => {
		if (sut.length < 1) {
			return;
		}
		apiCall(sut)
			.then((response) => {
				setData(response);
			})
			.catch(() => {});
	}, [apiCall]);

	React.useEffect(() => {
		if (data) {
			dispatch(setUser(data));
		}
	}, [data, dispatch]);

	return data;
}
