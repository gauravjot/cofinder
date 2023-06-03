import { TermsReducerType, TermType, SectionsBrowserType } from "@/types/dbTypes";
import {
	ReduxInstructorType,
	ReduxCourseType,
	ReduxSectionDetailedType,
	ReduxSubjectType,
	MyScheduleTypeItem,
	ReduxDetailedScheduleType,
} from "@/types/stateTypes";
import { AppDispatch } from "@/App";

export const clearAllVariableStates = (dispatch: AppDispatch) => {
	dispatch(clearDetailedSchedule());
	dispatch(clearSubjects());
	dispatch(clearInstructors());
	dispatch(clearCourses());
	dispatch(clearSections());
};

/*
 * My Schedule
 */
/* Does not have an expiry to refetch
   But during Expanded fetching if section is
   not longer found, then we let user know by
   setting error flag to yes
*/
export const CHANGE_MY_SCHEDULE = "CHANGE_MY_SCHEDULE";
export const CLEAR_MY_SCHEDULE = "CLEAR_MY_SCHEDULE";
export const ADD_TO_MY_SCHEDULE = "ADD_TO_MY_SCHEDULE";
export const REMOVE_FROM_MY_SCHEDULE = "REMOVE_FROM_MY_SCHEDULE";
export const changeMySchedule = (schedule: MyScheduleTypeItem[]) => {
	return {
		type: CHANGE_MY_SCHEDULE,
		payload: schedule,
	};
};
export const addToMySchedule = (schedule: MyScheduleTypeItem[]) => {
	return {
		type: ADD_TO_MY_SCHEDULE,
		payload: schedule,
	};
};
export const removeFromMySchedule = (schedule: MyScheduleTypeItem[]) => {
	return {
		type: REMOVE_FROM_MY_SCHEDULE,
		payload: schedule,
	};
};

export const clearMyScheduleData = () => {
	return {
		type: CLEAR_MY_SCHEDULE,
	};
};

/*
 * Detailed Schedule
 */
export const SET_DETAILED_SCHEDULE = "SET_DETAILED_SCHEDULE";
export const CLEAR_DETAILED_SCHEDULE = "CLEAR_DETAILED_SCHEDULE";
export const ADD_TO_DETAILED_SCHEDULE = "ADD_TO_DETAILED_SCHEDULE";
export const REMOVE_FROM_DETAILED_SCHEDULE = "REMOVE_FROM_DETAILED_SCHEDULE";

export const setDetailedSchedule = (schedule: ReduxDetailedScheduleType) => {
	return {
		type: SET_DETAILED_SCHEDULE,
		payload: schedule,
	};
};

export const addToDetailedSchedule = (section: SectionsBrowserType) => {
	return {
		type: ADD_TO_DETAILED_SCHEDULE,
		payload: section,
	};
};

export const removeFromDetailedSchedule = (crn: number) => {
	return {
		type: REMOVE_FROM_DETAILED_SCHEDULE,
		payload: crn,
	};
};

export const clearDetailedSchedule = () => {
	return {
		type: CLEAR_DETAILED_SCHEDULE,
	};
};

/*
 * Subjects Data
 */
export const SET_SUBJECTS = "SET_SUBJECTS";
export const CLEAR_SUBJECTS = "CLEAR_SUBJECTS";

export const setSubjects = (list: ReduxSubjectType) => {
	return {
		type: SET_SUBJECTS,
		payload: list,
	};
};

export const clearSubjects = () => {
	return {
		type: CLEAR_SUBJECTS,
	};
};

/*
 * Instructors Data
 */
export const SET_INSTRUCTORS = "SET_INSTRUCTORS";
export const CLEAR_INSTRUCTORS = "CLEAR_INSTRUCTORS";

export const setInstructors = (list: ReduxInstructorType) => {
	return {
		type: SET_INSTRUCTORS,
		payload: list,
	};
};

export const clearInstructors = () => {
	return {
		type: CLEAR_INSTRUCTORS,
	};
};

/*
 * Courses Data
 */
export const SET_COURSES = "SET_COURSES";
export const CLEAR_COURSES = "CLEAR_COURSES";

export const setCourses = (list: ReduxCourseType) => {
	return {
		type: SET_COURSES,
		payload: list,
	};
};

export const clearCourses = () => {
	return {
		type: CLEAR_COURSES,
	};
};

/*
 * Sections Data
 */
export const SET_SECTIONS = "SET_SECTIONS";
export const CLEAR_SECTIONS = "CLEAR_SECTIONS";

export const setSections = (list: ReduxSectionDetailedType) => {
	return {
		type: SET_SECTIONS,
		payload: list,
	};
};

export const clearSections = () => {
	return {
		type: CLEAR_SECTIONS,
	};
};

/*
 * Terms Data
 */
export const SET_TERMS = "SET_TERMS";
export const CLEAR_TERMS = "CLEAR_TERMS";

export const setTerms = (list: TermsReducerType) => {
	return {
		type: SET_TERMS,
		payload: list,
	};
};

export const clearTerms = () => {
	return {
		type: CLEAR_TERMS,
	};
};

/*
 * Current Term Data
 */
export const SET_CURRENT_TERM = "SET_CURRENT_TERM";

export const setCurrentTerm = (term: TermType) => {
	return {
		type: SET_CURRENT_TERM,
		payload: term,
	};
};
