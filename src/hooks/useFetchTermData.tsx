import * as React from "react";
import { FETCH_TIME_GAP, coursesEP, instructorsEP, sectionsEP, subjectsEP } from "config";
import axios from "axios";
import {
	ReduxCourseType,
	ReduxInstructorType,
	ReduxSectionDetailedType,
	ReduxSubjectType,
	ReduxDetailedScheduleType,
} from "data/stateTypes";
import { RootState } from "index";
import { setInstructors, setCourses, setSections, setSubjects } from "redux/actions";
import { setDetailedSchedule } from "../redux/actions";
import { MyScheduleTypeItem } from "../data/stateTypes";
import { TermType } from "data/dbTypes";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

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

	React.useEffect(() => {
		/* fetch =  true means we will do network request for data
                default is false */
		let fetch = false;
		/* ignore is used for axios promise skip in case the
        component unmounts */
		let ignore = false;
		/* localRetriveData data or locally retreived data */
		let localRetriveData;
		let url: string;

		/*
		 * Check if local data is stale
		 * - if yes then fetch new
		 * - if no then use local data
		 */
		switch (props.fetch) {
			case FETCH.Instructors:
				localRetriveData = fetchedInstructors;
				url = instructorsEP(currentTerm.id);
				break;
			case FETCH.Courses:
				localRetriveData = fetchedCourses;
				url = coursesEP(currentTerm.id);
				break;
			case FETCH.Sections:
				localRetriveData = fetchedSections;
				url = sectionsEP(currentTerm.id);
				break;
			case FETCH.Subjects:
				localRetriveData = fetchedSubjects;
				url = subjectsEP(currentTerm.id);
				break;
			default:
				throw new Error(
					"FETCH parameter was not provided or is invalid for this hook."
				);
		}
		if (new Date().getTime() - FETCH_TIME_GAP > localRetriveData.fetched) {
			fetch = true;
		}

		// Check if term is empty or 0
		if (currentTerm.id && currentTerm.id.length < 2) {
			fetch = false;
		}

		// if fetch is true, we send network request
		if (fetch && url) {
			console.log(props.fetch + ": fetching");
			axios
				.get(url, {
					headers: {
						"Content-Type": "application/json",
					},
				})
				.then(function (response) {
					if (!ignore) {
						if (props.fetch === FETCH.Instructors) {
							let reply: ReduxInstructorType = {
								instructors: response.data.instructors,
								fetched: new Date().getTime(),
							};
							if (response.data.instructors.length > 0) {
								// set Redux State
								dispatch(setInstructors(reply));
								// return data for this hook
								setData(reply);
							}
						} else if (props.fetch === FETCH.Sections) {
							let reply: ReduxSectionDetailedType = {
								sections: response.data.sections,
								fetched: new Date().getTime(),
							};
							if (response.data.sections.length > 0) {
								dispatch(setSections(reply));
								setData(response.data);
							}
						} else if (props.fetch === FETCH.Courses) {
							let reply: ReduxCourseType = {
								courses: response.data.courses,
								fetched: new Date().getTime(),
							};
							if (response.data.courses.length > 0) {
								dispatch(setCourses(reply));
								setData(reply);
							}
						} else if (props.fetch === FETCH.Subjects) {
							let reply: ReduxSubjectType = {
								subjects: response.data.subjects,
								fetched: new Date().getTime(),
							};
							if (response.data.subjects.length > 0) {
								dispatch(setSubjects(reply));
								setData(reply);
							}
						}
					}
				})
				.catch(function (error) {
					setData({ fetched: -1 });
				});
		} else {
			console.log(props.fetch + ": retrieved locally");
			setData(localRetriveData);
		}
		return () => {
			// Component unmounted
			ignore = true;
		};
	}, [
		props.fetch,
		currentTerm.id,
		fetchedInstructors,
		fetchedCourses,
		fetchedSections,
		fetchedSubjects,
		dispatch,
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
