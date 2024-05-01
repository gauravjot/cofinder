export interface SubjectType {
	code: string;
	name: string;
}
export interface InstructorType {
	name: string;
}
export interface InstructionMediumType {
	code: string;
	name: string;
}
export interface CourseType {
	name: string;
	code: string;
	credits: Float32Array;
	subject_id: string;
	prereqs: string;
	coreqs: string;
	note: string;
}
export interface LocationType {
	building: string;
	room: string;
}
export interface ScheduleType {
	location: LocationType;
	is_weekly: boolean;
	days: string;
	time_start: number;
	time_end: number;
	date_start: number;
	date_end: number;
}

export interface SectionsBrowserType {
	course: CourseType;
	subject: string;
	subject_id: string;
	instructor: string;
	medium: string;
	crn: number;
	name: string;
	is_active: boolean;
	is_lab: boolean;
	enrolled: number;
	capacity: number;
	note: string;
	schedule: ScheduleType[];
}

export interface TermType {
	code: string;
	name: string;
}

/**
 *  {
	    terms: TermType[];
	    fetched: number;
    }
 */
export interface TermsReducerType {
	terms: TermType[];
	fetched: number;
}

export interface SeatsInfoType {
	seats: { Capacity: number; Actual: number; Remaining: number };
	waitlist: { Capacity: number; Actual: number; Remaining: number };
}
