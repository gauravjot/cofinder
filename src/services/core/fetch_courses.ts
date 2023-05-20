import React from "react";
import axios from "axios";
import { coursesEP, FETCH_TIME_GAP } from "config";
import { handleApiError } from "services/handle_error";
import { ApiError, ResponseType } from "types/apiResponseType";
import { CourseSubjectType, ReduxCourseType } from "types/stateTypes";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { RootState } from "index";
import { setCourses } from "redux/actions";
import { TermType } from "types/dbTypes";

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

/* -1 => Fetching...
 * -2 => Returned Error
 * -3 => Term Data was not fetched yet or present
 */

export function useFetchCourses(): ReduxCourseType {
	const [data, setData] = React.useState<ReduxCourseType>({
		fetched: -1,
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
			};
		} else {
			// We got an error
			let error = response.res as ApiError;
			throw new Error(error.message);
		}
	}, []);

	React.useEffect(() => {
		if (reduxCourses.fetched === -1) {
			// We are already fetching this somewhere
			return;
		}
		if (reduxCourses.fetched === -2) {
			// Previous attempt returned an error
			return;
		}
		if (new Date().getTime() - FETCH_TIME_GAP > reduxCourses.fetched) {
			// If the localdata is stale we need to fetch again
			setData({
				fetched: -1,
				courses: [],
			});
			apiCall(currentTerm.id)
				.then((response) => {
					setData(response);
				})
				.catch((err: Error) => {
					setData({
						fetched: err.message === TERM_ERROR ? -3 : -2,
						courses: [],
					});
				});
		} else {
			// Data is not stale yet, we are good
			setData(reduxCourses);
		}
	}, [apiCall, reduxCourses, currentTerm.id]);

	React.useEffect(() => {
		dispatch(setCourses(data));
	}, [data, dispatch]);

	return data;
}
