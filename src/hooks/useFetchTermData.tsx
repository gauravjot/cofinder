import * as React from "react";
import { FETCH_TIME_GAP, coursesEP, instructorsEP, sectionsEP, subjectsEP } from "config";
import axios from "axios";
import {
	ReduxCourseType,
	ReduxInstructorType,
	ReduxSectionDetailedType,
	ReduxSubjectType,
	ReduxDetailedScheduleType,
} from "types/stateTypes";
import { RootState } from "index";
import { setInstructors, setCourses, setSections, setSubjects } from "redux/actions";
import { setDetailedSchedule } from "../redux/actions";
import { MyScheduleTypeItem } from "types/stateTypes";
import { TermType } from "types/dbTypes";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { axiosFetch } from "./useAxiosFetch";

export interface IAppProps {
	fetch: FETCH;
}

export const enum FETCH {
	Courses = "courses",
	Subjects = "subjects",
	Instructors = "instructors",
	Sections = "sections",
	SpecificSections = "sections_specific",
}

/*
 * This hook is only used to fetch term courses,
 * subjects, instructors and detailed sections.
 */
export default function useFetchTermData(props: IAppProps) {
	const [data, setData] = React.useState<any>();
	const dispatch = useAppDispatch();
	let fetchedInstructors: ReduxInstructorType = useAppSelector(
		(state: RootState) => state.instructors
	);
	let fetchedCourses: ReduxCourseType = useAppSelector(
		(state: RootState) => state.courses
	);
	let fetchedSections: ReduxSectionDetailedType = useAppSelector(
		(state: RootState) => state.sections
	);
	let fetchedSubjects: ReduxSubjectType = useAppSelector(
		(state: RootState) => state.subjects
	);
	// current term
	const currentTerm: TermType = useAppSelector((state: RootState) => state.currentTerm);

	console.log("hook", "reload");

	const fetchAndUpdate = React.useCallback(
		async (url: string) => {
			console.log("fetchAndUpdate");
			const request = await axiosFetch<any>(url);
			if (!request.success) {
				setData({ fetched: -1 });
			}
			switch (props.fetch) {
				case FETCH.Instructors:
					{
						let reply: ReduxInstructorType = {
							instructors: request.res.instructors,
							fetched: new Date().getTime(),
						};
						if (reply.instructors.length > 0) {
							dispatch(setInstructors(reply));
							setData(reply);
						}
					}
					break;
				case FETCH.Subjects:
					{
						let reply: ReduxSubjectType = {
							subjects: request.res.subjects,
							fetched: new Date().getTime(),
						};
						if (reply.subjects.length > 0) {
							dispatch(setSubjects(reply));
							setData(reply);
						}
					}
					break;
				case FETCH.Courses:
					{
						let reply: ReduxCourseType = {
							courses: request.res.courses,
							fetched: new Date().getTime(),
						};
						if (reply.courses.length > 0) {
							dispatch(setCourses(reply));
							setData(reply);
						}
					}
					break;
				case FETCH.Sections:
					{
						let reply: ReduxSectionDetailedType = {
							sections: request.res.sections,
							fetched: new Date().getTime(),
						};
						if (reply.sections.length > 0) {
							dispatch(setSections(reply));
							setData(reply);
						}
					}
					break;
			}
		},
		[props.fetch, dispatch]
	);

	React.useEffect(() => {
		console.log("hook", "useEffect");
		let fetchedTimeGapped = new Date().getTime() - FETCH_TIME_GAP;
		switch (props.fetch) {
			case FETCH.Instructors:
				if (fetchedTimeGapped > fetchedInstructors.fetched && currentTerm.id) {
					fetchAndUpdate(instructorsEP(currentTerm.id));
				} else {
					setData(fetchedInstructors);
				}
				break;
			case FETCH.Courses:
				if (fetchedTimeGapped > fetchedCourses.fetched && currentTerm.id) {
					fetchAndUpdate(coursesEP(currentTerm.id));
				} else {
					setData(fetchedCourses);
				}
				break;
			case FETCH.Sections:
				if (fetchedTimeGapped > fetchedSections.fetched && currentTerm.id) {
					fetchAndUpdate(sectionsEP(currentTerm.id));
				} else {
					setData(fetchedSections);
				}
				break;
			case FETCH.Subjects:
				if (fetchedTimeGapped > fetchedSubjects.fetched && currentTerm.id) {
					fetchAndUpdate(subjectsEP(currentTerm.id));
				} else {
					setData(fetchedSubjects);
				}
				break;
			default:
				throw new Error(
					"FETCH parameter was not provided or is invalid for this hook."
				);
		}
	}, [
		props.fetch,
		currentTerm.id,
		fetchedInstructors,
		fetchedCourses,
		fetchedSections,
		fetchedSubjects,
		fetchAndUpdate,
	]);
	return data;
}

/*
 * This hook is only used to fetch schedule based on crns
 * (course numbers). Always use FETCH.SpecificSubjects prop
 */
export function useFetchSpecificSectionData(props: IAppProps) {
	const [data, setData] = React.useState<any>();
	const dispatch = useAppDispatch();
	let fetchedScheduleSections: ReduxDetailedScheduleType = useAppSelector(
		(state: RootState) => state.detailedSchedule
	);
	// Get mySchedule to get CRN list
	const mySchedule = useAppSelector((state: RootState) => state.mySchedule);
	// current term
	const currentTerm: TermType = useAppSelector((state: RootState) => state.currentTerm);

	// Encode to base64 to send in URL
	function encodeB64(rows: MyScheduleTypeItem[]) {
		let response: number[] = [];
		rows.forEach((row) => {
			response.push(row.section);
		});
		return window.btoa(response.join(","));
	}

	React.useEffect(() => {
		/* fetch =  true means we will do network request for data
                default is false */
		let fetch = false;
		/* ignore is used for axios promise skip in case the
        component unmounts */
		let ignore = false;
		/* localRetriveData data or locally retreived data */
		let localRetriveData;

		/*
		 * Check if local data is stale
		 * - if yes then fetch new
		 * - if no then use local data
		 */
		switch (props.fetch) {
			case FETCH.SpecificSections:
				localRetriveData = fetchedScheduleSections;
				break;
			default:
				throw new Error("FETCH parameter was not provided.");
		}
		if (new Date().getTime() - FETCH_TIME_GAP > localRetriveData.fetched) {
			fetch = true;
		} else {
			let list1: number[] = [];
			mySchedule.forEach((row) => {
				if (row.term === currentTerm.id) {
					list1.push(row.section);
				}
			});
			let list2: number[] = [];
			fetchedScheduleSections.sections.forEach((row) => {
				list2.push(row.crn);
			});
			if (list1.sort().join(".") === list2.sort().join(".")) {
				setData(localRetriveData);
			} else if (fetchedScheduleSections.fetched !== -1) {
				fetch = true;
			}
		}

		// Check if term is empty or 0
		if (currentTerm.id && currentTerm.id.length < 2) {
			fetch = false;
		}

		let encodedCRNS = encodeB64(mySchedule);
		// if fetch is true, we send network request
		if (fetch && encodedCRNS !== "") {
			console.log(props.fetch + ": fetching");
			axios
				.get(sectionsEP(currentTerm.id, encodedCRNS), {
					headers: {
						"Content-Type": "application/json",
					},
				})
				.then(function (response) {
					if (!ignore) {
						if (props.fetch === FETCH.SpecificSections) {
							let reply: ReduxDetailedScheduleType = {
								sections: response.data.sections,
								fetched: new Date().getTime(),
							};
							// set Redux State
							dispatch(setDetailedSchedule(reply));
							// return data for this hook
							setData(reply);
						}
					}
				})
				.catch(function (error) {
					setData({ fetched: -1 });
				});
		} else {
			console.log(props.fetch + ": retrieved locally");
		}
		return () => {
			// Component unmounted
			ignore = true;
		};
	}, [props.fetch, currentTerm.id, fetchedScheduleSections, mySchedule, dispatch]);
	return data;
}
