import { InstructorType, SectionsBrowserType, SubjectType } from "@/types/dbTypes";

/**
 * @param inputData SectionsBrowserType[]
 * @param filterByKeyword string
 * @param filterBySubject SubjectType[]
 * @param filterByInstructor InstructorType[]
 * @description Filter priority: filter keyword, instructor, subject.
 * @returns SectionsBrowserType[]
 */
export function filterData(
	inputData: SectionsBrowserType[],
	filterByKeyword: string,
	filterBySubject: SubjectType[],
	filterByInstructor: InstructorType[]
	// filterSchedule?: MyScheduleTypeItem[]
): SectionsBrowserType[] {
	// check if input data is empty
	if (inputData.length < 1) return inputData;

	// List of crns in schedule
	// let schedule_crns: number[] = [];
	// for (let sch = 0; sch < filterSchedule.length; sch++) {
	// 	schedule_crns.push(filterSchedule[sch].section);
	// }

	// let isFilterSchedule = schedule_crns.length > 0;

	// Filtering over entire input data
	let filtered_list = [...inputData].filter((section) => {
		// We first check if filter schedule is the active
		// if (isFilterSchedule && schedule_crns.includes(section.crn)) return true;
		// if (isFilterSchedule) return false; // top priority so anything else is false

		// Filter keyword
		if (filterByKeyword.length > 0) return keywordFilter(section, filterByKeyword);

		// Filter instructor
		for (let i = 0; i < filterByInstructor.length; i++) {
			if (filterByInstructor[i].name === section.instructor) {
				return true;
			}
		}

		// Filter subject
		for (let i = 0; i < filterBySubject.length; i++) {
			if (filterBySubject[i].name === section.subject) {
				return true;
			}
		}
		if (filterBySubject.length > 0) return false;
	});

	return filtered_list;
}

function keywordFilter(section: SectionsBrowserType, keyword: string): boolean {
	return (
		section.course.code.toLowerCase().includes(keyword) ||
		section.course.name.toLowerCase().includes(keyword) ||
		section.instructor.toLowerCase().includes(keyword) ||
		section.subject_id.toLowerCase().includes(keyword) ||
		section.subject.toLowerCase().includes(keyword) ||
		section.crn.toString().includes(keyword) ||
		(
			section.subject_id.toLowerCase() +
			" " +
			section.course.code.toLowerCase()
		).includes(keyword) ||
		(section.subject_id.toLowerCase() + section.course.code.toLowerCase()).includes(
			keyword
		) ||
		(keyword === "lab" && section.is_lab) ||
		section.medium.toLowerCase().includes(keyword)
	);
}
