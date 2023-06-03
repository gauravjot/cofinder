import { Reducer, AnyAction } from "redux";
import { ADD_TO_MY_SCHEDULE, REMOVE_FROM_MY_SCHEDULE } from "./actions";
import { TermsReducerType, TermType } from "@/types/dbTypes";
import { SectionsBrowserType } from "../types/dbTypes";
import {
	ReduxCourseType,
	ReduxSectionDetailedType,
	ReduxSubjectType,
	MyScheduleTypeItem,
	ReduxDetailedScheduleType,
	ReduxInstructorType,
} from "@/types/stateTypes";

import {
	CLEAR_MY_SCHEDULE,
	CHANGE_MY_SCHEDULE,
	CLEAR_DETAILED_SCHEDULE,
	SET_DETAILED_SCHEDULE,
	ADD_TO_DETAILED_SCHEDULE,
	REMOVE_FROM_DETAILED_SCHEDULE,
	CLEAR_SUBJECTS,
	SET_SUBJECTS,
	CLEAR_INSTRUCTORS,
	SET_INSTRUCTORS,
	CLEAR_SECTIONS,
	SET_SECTIONS,
	SET_COURSES,
	CLEAR_COURSES,
	CLEAR_TERMS,
	SET_TERMS,
	SET_CURRENT_TERM,
} from "./actions";

/*
 * MySchedule reducer
 */
export const myScheduleReducer: Reducer<MyScheduleTypeItem[], AnyAction> = (
	state: MyScheduleTypeItem[] = [],
	action: AnyAction
) => {
	const { type, payload } = action;
	switch (type) {
		case CLEAR_MY_SCHEDULE:
			return (state = []);
		case CHANGE_MY_SCHEDULE:
			return (state = payload);
		case ADD_TO_MY_SCHEDULE:
			return (state = [
				...state,
				{ section: payload[0].section, term: payload[0].term },
			]);
		case REMOVE_FROM_MY_SCHEDULE:
			return (state = state.filter((o) => {
				return o.section !== payload[0].section;
			}));
		default:
			return state;
	}
};

/*
 * Detailed Schedule reducer
 */
export const detailedScheduleReducer: Reducer<ReduxDetailedScheduleType, AnyAction> = (
	state: ReduxDetailedScheduleType = { sections: [], fetched: 0 },
	action: AnyAction
) => {
	const { type, payload } = action;
	switch (type) {
		case CLEAR_DETAILED_SCHEDULE:
			return (state = { sections: [], fetched: 0 });
		case SET_DETAILED_SCHEDULE:
			return (state = payload);
		case ADD_TO_DETAILED_SCHEDULE:
			let list = state.sections;
			list.push(payload);
			return (state = {
				sections: list,
				fetched: state.fetched > 0 ? state.fetched : new Date().getTime(),
			});
		case REMOVE_FROM_DETAILED_SCHEDULE:
			let list2 = state.sections.filter((section: SectionsBrowserType) => {
				return section.crn !== payload;
			});

			return (state = { sections: list2, fetched: state.fetched });
		default:
			return state;
	}
};

/*
 * Subject reducer
 */
export const subjectsReducer: Reducer<ReduxSubjectType, AnyAction> = (
	state: ReduxSubjectType = { subjects: [], fetched: 0 },
	action: AnyAction
) => {
	const { type, payload } = action;
	switch (type) {
		case CLEAR_SUBJECTS:
			return (state = { subjects: [], fetched: 0 });
		case SET_SUBJECTS:
			return (state = payload);
		default:
			return state;
	}
};

/*
 * Instructor reducer
 */
export const instructorsReducer: Reducer<ReduxInstructorType, AnyAction> = (
	state: ReduxInstructorType = { instructors: [], fetched: 0 },
	action: AnyAction
) => {
	const { type, payload } = action;
	switch (type) {
		case CLEAR_INSTRUCTORS:
			return (state = { instructors: [], fetched: 0 });
		case SET_INSTRUCTORS:
			return (state = payload);
		default:
			return state;
	}
};

/*
 * Sections reducer
 */
export const sectionsReducer: Reducer<ReduxSectionDetailedType, AnyAction> = (
	state: ReduxSectionDetailedType = { sections: [], fetched: 0 },
	action: AnyAction
) => {
	const { type, payload } = action;
	switch (type) {
		case CLEAR_SECTIONS:
			return (state = { sections: [], fetched: 0 });
		case SET_SECTIONS:
			return (state = payload);
		default:
			return state;
	}
};

/*
 * Course reducer
 */
export const coursesReducer: Reducer<ReduxCourseType, AnyAction> = (
	state: ReduxCourseType = { courses: [], fetched: 0 },
	action: AnyAction
) => {
	const { type, payload } = action;
	switch (type) {
		case CLEAR_COURSES:
			return (state = { courses: [], fetched: 0 });
		case SET_COURSES:
			return (state = payload);
		default:
			return state;
	}
};

/*
 * Terms reducer
 */
export const termsReducer: Reducer<TermsReducerType, AnyAction> = (
	state: TermsReducerType = { terms: [], fetched: 0 },
	action: AnyAction
) => {
	const { type, payload } = action;
	switch (type) {
		case CLEAR_TERMS:
			return { terms: [], fetched: 0 };
		case SET_TERMS:
			return (state = { ...payload });
		default:
			return state;
	}
};

/*
 * Current Term reducer
 */
export const currentTermReducer: Reducer<TermType, AnyAction> = (
	state: TermType = { id: "0", name: "0", date: 0, term_ident: "" },
	action: AnyAction
) => {
	const { type, payload } = action;
	switch (type) {
		case SET_CURRENT_TERM:
			return payload;
		default:
			return state;
	}
};
