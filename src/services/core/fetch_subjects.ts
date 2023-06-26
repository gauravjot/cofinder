import React from "react";
import axios from "axios";
import { API_FAIL_RETRY_TIMER, FETCH_TIME_GAP } from "@/config";
import { subjectsEP } from "@/server_eps";
import { handleApiError } from "@/services/handle_error";
import { ApiError, FetchState, ResponseType } from "@/types/apiResponseType";
import { ReduxSubjectType } from "@/types/stateTypes";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectAllSubjects, set as setSubjects } from "@/redux/subjects/subjectSlice";
import { TermType, SubjectType } from "@/types/dbTypes";
import { selectCurrentTerm } from "@/redux/terms/currentTermSlice";

function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

function fetchSubjects(term: string): Promise<ResponseType<SubjectType[] | ApiError>> {
	return axios
		.get(subjectsEP(term))
		.then(function (response) {
			return {
				success: true,
				res: response.data.subjects,
			} as ResponseType<SubjectType[]>;
		})
		.catch(handleApiError);
}

/*
 *
 */
export function useFetchSubjects(): ReduxSubjectType {
	const [data, setData] = React.useState<ReduxSubjectType>({
		fetched: 0,
		subjects: [],
	});
	const reduxSubjects: ReduxSubjectType = useAppSelector(selectAllSubjects);
	const currentTerm: TermType = useAppSelector(selectCurrentTerm);
	const dispatch = useAppDispatch();
	const TERM_ERROR = "Term information not present.";

	const apiCall = React.useCallback(async (term: string) => {
		if (term.length < 8) {
			throw new Error(TERM_ERROR);
		}
		const response = await fetchSubjects(term);

		if (response.success) {
			return {
				fetched: new Date().getTime(),
				subjects: response.res as SubjectType[],
			} as ReduxSubjectType;
		} else {
			let error = response.res as ApiError;
			throw new Error(error.message);
		}
	}, []);

	React.useEffect(() => {
		function getData() {
			if (new Date().getTime() - reduxSubjects.fetched > FETCH_TIME_GAP) {
				// If the local data is stale we need to fetch again
				setData({
					fetched: FetchState.Fetching,
					subjects: [],
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
							subjects: [],
						});
					});
			} else {
				// Data is not stale yet, we are good
				setData(reduxSubjects);
			}
		}

		async function main() {
			if (reduxSubjects.fetched === FetchState.Fetching) {
				return;
			}
			if (reduxSubjects.fetched === FetchState.Error) {
				// we wait before retry fetching
				await sleep(API_FAIL_RETRY_TIMER).then(getData);
			} else {
				getData();
			}
		}
		main();
	}, [apiCall, reduxSubjects, currentTerm.id]);

	React.useEffect(() => {
		if (data.fetched === 0) {
			return;
		}
		dispatch(setSubjects(data));
	}, [data, dispatch]);

	return data;
}
