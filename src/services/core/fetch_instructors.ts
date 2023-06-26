import React from "react";
import axios from "axios";
import { API_FAIL_RETRY_TIMER, FETCH_TIME_GAP } from "@/config";
import { instructorsEP } from "@/server_eps";
import { handleApiError } from "@/services/handle_error";
import { ApiError, FetchState, ResponseType } from "@/types/apiResponseType";
import { ReduxInstructorType } from "@/types/stateTypes";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
	selectAllInstructors,
	set as setInstructors,
} from "@/redux/instructor/instructorSlice";
import { TermType, InstructorType } from "@/types/dbTypes";
import { selectCurrentTerm } from "@/redux/terms/currentTermSlice";

function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

function fetchInstructors(
	term: string
): Promise<ResponseType<InstructorType[] | ApiError>> {
	return axios
		.get(instructorsEP(term))
		.then(function (response) {
			return {
				success: true,
				res: response.data.instructors,
			} as ResponseType<InstructorType[]>;
		})
		.catch(handleApiError);
}

/*
 *
 */
export function useFetchInstructors(): ReduxInstructorType {
	const [data, setData] = React.useState<ReduxInstructorType>({
		fetched: 0,
		instructors: [],
	});
	const reduxinstructors: ReduxInstructorType = useAppSelector(selectAllInstructors);
	const currentTerm: TermType = useAppSelector(selectCurrentTerm);
	const dispatch = useAppDispatch();
	const TERM_ERROR = "Term information not present.";

	const apiCall = React.useCallback(async (term: string) => {
		if (term.length < 8) {
			throw new Error(TERM_ERROR);
		}
		const response = await fetchInstructors(term);

		if (response.success) {
			return {
				fetched: new Date().getTime(),
				instructors: response.res as InstructorType[],
			} as ReduxInstructorType;
		} else {
			let error = response.res as ApiError;
			throw new Error(error.message);
		}
	}, []);

	React.useEffect(() => {
		function getData() {
			if (new Date().getTime() - reduxinstructors.fetched > FETCH_TIME_GAP) {
				// If the local data is stale we need to fetch again
				setData({
					fetched: FetchState.Fetching,
					instructors: [],
				});
				apiCall(currentTerm.id)
					.then((response) => {
						setData(response);
					})
					.catch((err: Error) => {
						setData({
							fetched:
								err.message === TERM_ERROR
									? FetchState.Incomplete
									: FetchState.Error,
							instructors: [],
						});
					});
			} else {
				// Data is not stale yet, we are good
				setData(reduxinstructors);
			}
		}
		async function main() {
			if (reduxinstructors.fetched === FetchState.Fetching) {
				return;
			}
			if (reduxinstructors.fetched === FetchState.Error) {
				// we wait before retry fetching
				await sleep(API_FAIL_RETRY_TIMER).then(getData);
			} else {
				getData();
			}
		}
		main();
	}, [apiCall, reduxinstructors, currentTerm.id]);

	React.useEffect(() => {
		if (data.fetched === 0) {
			return;
		}
		dispatch(setInstructors(data));
	}, [data, dispatch]);

	return data;
}
