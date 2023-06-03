import React from "react";
import axios from "axios";
import { API_FAIL_RETRY_TIMER, FETCH_TIME_GAP } from "@/config";
import { coursesEP } from "@/server_eps";
import { handleApiError } from "@/services/handle_error";
import { ApiError, FetchState, ResponseType } from "@/types/apiResponseType";
import { CourseSubjectType, ReduxCourseType } from "@/types/stateTypes";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/App";
import { setCourses } from "@/redux/actions";
import { TermType } from "@/types/dbTypes";

function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

function fetchCourses(
	term: string
): Promise<ResponseType<CourseSubjectType[] | ApiError>> {
	return axios
		.get(coursesEP(term))
		.then(function (response) {
			return {
				success: true,
				res: response.data.courses,
			} as ResponseType<CourseSubjectType[]>;
		})
		.catch(handleApiError);
}

/*
 *
 */
export function useFetchCourses(): ReduxCourseType {
	const [data, setData] = React.useState<ReduxCourseType>({
		fetched: 0,
		courses: [],
	});
	const reduxCourses: ReduxCourseType = useAppSelector(
		(state: RootState) => state.courses
	);
	const currentTerm: TermType = useAppSelector((state: RootState) => state.currentTerm);
	const dispatch = useAppDispatch();
	const TERM_ERROR = "Term information not present.";

	const apiCall = React.useCallback(async (term: string) => {
		if (term.length < 8) {
			throw new Error(TERM_ERROR);
		}
		const response = await fetchCourses(term);

		if (response.success) {
			return {
				fetched: new Date().getTime(),
				courses: response.res as CourseSubjectType[],
			} as ReduxCourseType;
		} else {
			let error = response.res as ApiError;
			throw new Error(error.message);
		}
	}, []);

	React.useEffect(() => {
		function getData() {
			if (
				reduxCourses.fetched === FetchState.Error ||
				new Date().getTime() - reduxCourses.fetched > FETCH_TIME_GAP
			) {
				// If the local data is stale we need to fetch again
				setData({
					fetched: FetchState.Fetching,
					courses: [],
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
							courses: [],
						});
					});
			} else {
				// Data is not stale yet, we are good
				setData(reduxCourses);
			}
		}
		async function main() {
			if (reduxCourses.fetched === FetchState.Fetching) {
				return;
			}
			if (reduxCourses.fetched === FetchState.Error) {
				// we wait before retry fetching
				await sleep(API_FAIL_RETRY_TIMER).then(getData);
			} else {
				getData();
			}
		}
		main();
	}, [apiCall, reduxCourses, currentTerm.id]);

	React.useEffect(() => {
		if (data.fetched === 0) {
			return;
		}
		dispatch(setCourses(data));
	}, [data, dispatch]);

	return data;
}
