import { SectionsBrowserType } from "@/types/dbTypes";
import { InstructorType, CourseType, SubjectType } from "./dbTypes";
export interface MyScheduleTypeItem {
	// term is term id
	term: string;
	section: number;
}
export interface ReduxDetailedScheduleType {
	sections: SectionsBrowserType[];
	fetched: number;
}
export interface ReduxInstructorType {
	instructors: InstructorType[];
	fetched: number;
}
export interface CourseSubjectType extends CourseType {
	subject: string;
}
export interface ReduxCourseType {
	courses: CourseSubjectType[];
	fetched: number;
}
export interface ReduxSubjectType {
	subjects: SubjectType[];
	fetched: number;
}
export interface ReduxSectionDetailedType {
	sections: SectionsBrowserType[];
	fetched: number;
}
