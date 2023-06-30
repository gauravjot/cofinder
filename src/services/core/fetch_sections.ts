import React from "react";
import axios from "axios";
import { API_FAIL_RETRY_TIMER, FETCH_TIME_GAP } from "@/config";
import { sectionsEP } from "@/server_eps";
import { handleApiError } from "@/services/handle_error";
import { ApiError, FetchState, ResponseType } from "@/types/apiResponseType";
import { ReduxSectionDetailedType } from "@/types/stateTypes";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectAllSections, set as setSections } from "@/redux/sections/sectionSlice";
import { TermType, SectionsBrowserType } from "@/types/dbTypes";
import { selectCurrentTerm } from "@/redux/terms/currentTermSlice";

function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

function fetchSections(
	term: string
): Promise<ResponseType<SectionsBrowserType[] | ApiError>> {
	return axios
		.get(sectionsEP(term))
		.then(function (response) {
			return {
				success: true,
				res: response.data.sections,
			} as ResponseType<SectionsBrowserType[]>;
		})
		.catch(handleApiError);
}

/*
 *
 */
export function useFetchSections(): ReduxSectionDetailedType {
	const [data, setData] = React.useState<ReduxSectionDetailedType>({
		fetched: 0,
		sections: [],
	});
	const reduxSections: ReduxSectionDetailedType = useAppSelector(selectAllSections);
	const currentTerm: TermType = useAppSelector(selectCurrentTerm);
	const dispatch = useAppDispatch();
	const TERM_ERROR = "Term information not present.";

	const apiCall = React.useCallback(async (term: string) => {
		if (term.length < 8) {
			throw new Error(TERM_ERROR);
		}
		const response = await fetchSections(term);

		if (response.success) {
			return {
				fetched: new Date().getTime(),
				sections: response.res as SectionsBrowserType[],
			} as ReduxSectionDetailedType;
		} else {
			let error = response.res as ApiError;
			throw new Error(error.message);
		}
	}, []);

	React.useEffect(() => {
		function getData() {
			if (new Date().getTime() - reduxSections.fetched > FETCH_TIME_GAP) {
				// If the local data is stale we need to fetch again
				setData({
					fetched: FetchState.Fetching,
					sections: [],
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
							sections: [],
						});
					});
			} else {
				// Data is not stale yet, we are good
				setData(reduxSections);
			}
		}
		async function main() {
			if (reduxSections.fetched === FetchState.Fetching) {
				return;
			}
			if (reduxSections.fetched === FetchState.Error) {
				// we wait before retry fetching
				await sleep(API_FAIL_RETRY_TIMER).then(getData);
			} else {
				getData();
			}
		}
		main();
	}, [apiCall, reduxSections, currentTerm.id, dispatch]);

	React.useEffect(() => {
		if (data.fetched === 0) {
			return;
		}
		dispatch(setSections(data));
	}, [data, dispatch]);

	return data;
}
