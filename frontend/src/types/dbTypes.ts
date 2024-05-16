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
	prereqs?: string;
	coreqs?: string;
	note?: string;
}
export interface LocationType {
	building: string;
	room: string;
}
export interface ScheduleType {
	location?: LocationType;
	is_weekly?: boolean;
	days?: string[];
	time_start?: string;
	time_end?: string;
	date_start: string;
	date_end: string;
}

export interface SectionsBrowserType {
	course: CourseType;
	subject: SubjectType;
	instructor?: string;
	crn: number;
	name: string;
	term: string;
	is_active: boolean;
	is_lab: boolean;
	status: string;
	enrolled: number;
	capacity: number;
	waitlist: number;
	note?: string;
	medium?: InstructionMediumType;
	schedule?: ScheduleType[];
	locations?: LocationType[];
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
	restrictions?: string[];
}
