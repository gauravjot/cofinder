import * as React from "react";
import Multiselect from "multiselect-react-dropdown";
import { useLocation } from "react-router-dom";
import { SectionsBrowserType, InstructorType, SubjectType } from "@/types/dbTypes";
import {
	ReduxSectionDetailedType,
	ReduxInstructorType,
	ReduxSubjectType,
	MyScheduleTypeItem,
} from "@/types/stateTypes";
import { useFetchSections } from "@/services/core/fetch_sections";
import { useFetchInstructors } from "@/services/core/fetch_instructors";
import { useFetchSubjects } from "@/services/core/fetch_subjects";

interface Props {
	setData: React.Dispatch<React.SetStateAction<SectionsBrowserType[]>>;
	setIsTFA: React.Dispatch<React.SetStateAction<boolean>>;
	setIsKFA: React.Dispatch<React.SetStateAction<boolean>>;
	setSubjectFilter?: string;
	setKeywordFilter?: string;
	showOnlySelected: boolean;
	schedule: MyScheduleTypeItem[];
}

export default function CourseFilter(props: Props) {
	const location = useLocation();
	// For expanding filter
	const [expandFilters, setExpandFilters] = React.useState<boolean>(false);
	let expandFiltersRef: React.RefObject<any> = React.useRef<HTMLDivElement>(null);
	// filter keyword from input bar
	const [keyword, setKeyword] = React.useState<string>(
		location.state?.keyword ? location.state.keyword : ""
	);
	const deferredKeyword = React.useDeferredValue(keyword);
	// filter subjects and professors from expandable
	// The contains choosen filters by user
	let subjectsMultiSelectRef = React.useRef<Multiselect>(null);
	let instructorsMultiSelectRef = React.useRef<Multiselect>(null);
	const [selectedSubjects, setSelectedSubjects] = React.useState<SubjectType[]>([]);
	const [selectedInstructors, setSelectedInstructors] = React.useState<
		InstructorType[]
	>([]);
	const [activeFilterCount, setActiveFilterCount] = React.useState<number>(0);
	// Preselected Subject from url /browse/courses/:subject
	const [urlSelectedSubject, setUrlSelectedSubject] = React.useState<SubjectType>();
	const setIsTFA = props.setIsTFA;
	const setIsKFA = props.setIsKFA;

	// Fetch and compute functions
	const sectionsTermData: ReduxSectionDetailedType = useFetchSections();
	const instructorsTermData: ReduxInstructorType = useFetchInstructors();
	const subjectsTermData: ReduxSubjectType = useFetchSubjects();

	React.useEffect(() => {
		if (subjectsTermData && subjectsTermData.fetched !== -1) {
			for (let i = 0; i < subjectsTermData.subjects.length; i++) {
				if (props.setSubjectFilter === subjectsTermData.subjects[i].id) {
					setUrlSelectedSubject(subjectsTermData.subjects[i]);
					setSelectedSubjects([subjectsTermData.subjects[i]]);
					setActiveFilterCount(1);
					setIsTFA(true);
				}
			}
		}
	}, [subjectsTermData, props.setSubjectFilter, setIsTFA]);

	React.useEffect(() => {
		if (props.setKeywordFilter) {
			setKeyword(props.setKeywordFilter);
		}
	}, [props.setKeywordFilter]);

	React.useEffect(() => {
		// Apply Filters
		if (sectionsTermData && sectionsTermData.fetched > 0) {
			// List of crns in schedule
			let schedule_crns: number[] = [];
			if (props.showOnlySelected) {
				for (let sch = 0; sch < props.schedule.length; sch++) {
					schedule_crns.push(props.schedule[sch].section);
				}
			}
			let list = sectionsTermData.sections.filter((row) => {
				if (schedule_crns.length > 0 && schedule_crns.includes(row.crn)) {
					schedule_crns = schedule_crns.filter((s) => {
						return s !== row.crn;
					});
					return true;
				}
				// If OnLy Selected Courses is ticked then we can ignore rest of the checks
				if (props.showOnlySelected) return false;
				let val = false;
				let filtersActiveCount = 0;
				// The keyword bar
				if (deferredKeyword !== "" && deferredKeyword.length > 1) {
					filtersActiveCount++;
					deferredKeyword.split(",").every((keyword) => {
						let l_keyword = keyword.toLowerCase().trim();
						if (keyword !== "" && keyword.length > 1) {
							val =
								val ||
								row.course.code.toLowerCase().includes(l_keyword) ||
								row.course.name.toLowerCase().includes(l_keyword) ||
								row.instructor.toLowerCase().includes(l_keyword) ||
								row.subject_id.toLowerCase().includes(l_keyword) ||
								row.subject.toLowerCase().includes(l_keyword) ||
								row.crn.toString().includes(l_keyword) ||
								(
									row.subject_id.toLowerCase() +
									" " +
									row.course.code.toLowerCase()
								).includes(l_keyword) ||
								(
									row.subject_id.toLowerCase() +
									row.course.code.toLowerCase()
								).includes(l_keyword) ||
								(l_keyword === "lab" && row.is_lab) ||
								row.medium.toLowerCase().includes(l_keyword);
						}
						// Break loop if val is already true
						return !val;
					});
					if (val) return val; // return filter if val is true
				}
				// Subjects filter in Filter expandable
				if (selectedSubjects.length > 0) {
					selectedSubjects.every((subject: SubjectType) => {
						filtersActiveCount++;
						console.log(subject.name);
						val =
							val ||
							row.subject.toLowerCase() === subject.name.toLowerCase();
						// Break loop if val is already true
						return !val;
					});
					if (val) return val; // return filter if val is true
				}
				// Professors filter in Filter expandable
				if (selectedInstructors.length > 0) {
					selectedInstructors.every((prof: InstructorType) => {
						filtersActiveCount++;
						val =
							val ||
							row.instructor
								.toLowerCase()
								.includes(prof.name.toLowerCase());
						// Break loop if val is already true
						return !val;
					});
				}
				// If filters are active then we return val otherwise true
				return filtersActiveCount > 0 ? val : true;
			});
			// Return list to parent
			setIsKFA(deferredKeyword.length > 1);
			props.setData(list);
		}
	}, [
		deferredKeyword,
		selectedSubjects,
		selectedInstructors,
		sectionsTermData,
		setIsKFA,
		props.setData,
		props.showOnlySelected,
	]);

	const [subjsOnChange, setSubjsOnChange] = React.useState<SubjectType[]>([]);
	const [profsOnChange, setProfsOnChange] = React.useState<InstructorType[]>([]);
	function onSubjectChange(selectedList: any[]) {
		setSubjsOnChange(selectedList);
	}

	function onProfessorChange(selectedList: any[]) {
		setProfsOnChange(selectedList);
	}

	const applyFilters = () => {
		if (subjsOnChange.length > 0) setSelectedSubjects([...subjsOnChange]);
		if (profsOnChange.length > 0) setSelectedInstructors([...profsOnChange]);
		if (subjsOnChange.length + profsOnChange.length === 0) {
			removeFilters();
		} else {
			setActiveFilterCount(subjsOnChange.length + profsOnChange.length);
			setIsTFA(subjsOnChange.length + profsOnChange.length > 0);
		}
		toggleFilters();
	};

	const removeFilters = () => {
		setSelectedSubjects([]);
		setSelectedInstructors([]);
		subjectsMultiSelectRef.current?.resetSelectedValues();
		instructorsMultiSelectRef.current?.resetSelectedValues();
		setActiveFilterCount(0);
		setIsTFA(false);
	};

	/* Filter Toggle */
	const toggleFilters = () => {
		if (expandFiltersRef.current) {
			let attribValue = expandFiltersRef.current.getAttribute("aria-expanded");
			expandFiltersRef.current.setAttribute(
				"aria-expanded",
				attribValue === "true" ? "false" : "true"
			);
			if (attribValue === "true" ? false : true) {
				// Detect clicks outside of filter box
				window.addEventListener("click", toggleEventHandler);
			} else {
				window.removeEventListener("click", toggleEventHandler);
			}
			// setting state to re-render
			setExpandFilters(attribValue === "true" ? false : true);
		}
	};

	const toggleEventHandler = React.useCallback((e: MouseEvent) => {
		/* useCallback so function doesnt change in re-renders
       otherwise our add/remove eventListeners will go haywire */
		/* whitelisted with if-else loop:
		   1. The menu box
		   2. The button which is toggle
		   3. Close-icon in Multiselect
		   add more for exceptions */
		if (
			!document.getElementById("filter-box")?.contains(e.target as Node) &&
			!document.getElementById("filter-btn")?.contains(e.target as Node) &&
			!(e.target as Element)?.classList.contains("closeIcon")
		) {
			toggleFilters();
		}
	}, []);

	return (
		<div className="sticky top-0 z-20 sm:h-16 bg-white dark:bg-slate-1000 border-b border-gray-300 dark:border-slate-800 py-px">
			<div className="container mx-auto px-4">
				<div className="sm:flex items-center transition-colors rounded-lg">
					<div className="sm:flex-none flex justify-end md:justify-start items-center pr-4 py-3 lg:min-w-[19rem] pl-12 sm:pl-16 md:pl-16 lg:pl-20 xl:pl-0">
						<button
							onClick={() => {
								toggleFilters();
							}}
							id="filter-btn"
							disabled={sectionsTermData.fetched < 0}
							className="shadow py-1 pl-4 pr-6 bg-laccent-800 text-white rounded-full"
						>
							<span className="material-icons text-xl align-middle">
								{expandFilters ? "expand_less" : "expand_more"}
							</span>
							<span className="inline ml-2 font-medium tracking-wide align-middle">
								Filters
							</span>
						</button>
						<div
							className={
								(activeFilterCount > 0
									? "bg-orange-200 dark:bg-opacity-10 text-orange-800 dark:text-orange-300"
									: "bg-gray-200 text-black dark:bg-slate-700 dark:text-white") +
								" block align-middle ml-4 font-bold" +
								" px-2 py-0.5 text-sm rounded user-select-none"
							}
						>
							{activeFilterCount === 0
								? "not set"
								: "ACTIVE: " + activeFilterCount}
						</div>
					</div>
					<div className="sm:flex-1 flex justify-center items-center sm:justify-end xl:justify-center my-4 sm:mb-0 sm:my-0">
						<div className="inline relative">
							<input
								type="text"
								className={
									"font-medium tw-input-focus border rounded-lg border-gray-300 dark:bg-slate-700" +
									" dark:border-slate-900 dark:text-white py-2 px-10 pl-12 disabled:opacity-50" +
									" shadow w-[calc(100vw-3rem)] sm:w-[18rem] md:w-[20rem] lg:w-[24rem] xl:w-[26rem] 2xl:w-[28rem]"
								}
								placeholder="Search keyword e.g. CIS"
								value={keyword}
								disabled={sectionsTermData.fetched < 0}
								onChange={(e) => setKeyword(e.target.value)}
							/>
							<div className="absolute left-1.5 top-[0.35rem] tw-show-on-hover-parent">
								<span className="material-icons text-xl w-8 h-8 hover:bg-accent-100 rounded-full text-center grid items-center dark:text-white dark:hover:bg-slate-900">
									bolt
								</span>
								<div className="tw-show-on-hover text-gray-600 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-900">
									<span className="block font-medium mb-1 text-gray-800 dark:text-white text-smb">
										Advanced Filtering
									</span>
									Use comma separated values for multiple filters. For
									example
									<br />
									<code className="block mt-1.5 ml-4 pb-1">
										cis,comp,math
									</code>
								</div>
							</div>
							<div
								className={
									deferredKeyword === ""
										? "hidden"
										: "absolute right-[.325rem] top-[0.31rem]"
								}
							>
								<button
									className="material-icons text-gray-500 dark:text-white text-lg rounded-full w-8 h-8 hover:bg-gray-300 dark:hover:bg-slate-700 hover:text-gray-700"
									onClick={() => setKeyword("")}
								>
									close
								</button>
							</div>
						</div>
					</div>
					<div className="flex-none text-right lg:min-w-[19rem] hidden xl:block">
						<h5 className="pl-4 font-semibold font-serif dark:text-white">
							Course Browser
						</h5>
					</div>
				</div>
				<div
					id="filter-box"
					className="accordion absolute left-2 right-3 md:right-auto md:left-auto tw-shadow bg-gray-50 dark:bg-slate-800 ml-2 rounded-lg px-6 py-6 pb-8 border border-gray-200 dark:border-slate-900 z-30"
					ref={expandFiltersRef}
					aria-expanded="false"
				>
					<div className="md:w-[38rem] text-sm text-gray-600 dark:text-slate-300 mb-4">
						<span className="material-icons text-smb align-middle">info</span>
						<span className="align-middle">
							{" "}
							Filter is set in -or- mode. So, if you choose subject "Comp"
							and professor "Leonard", it will show all courses falling in
							either filters.
						</span>
					</div>
					<div className="md:flex">
						<div className="flex-1">
							<div className="rounded-lg bg-gray-200 dark:bg-slate-800 bg-opacity-100 border-2 border-gray-200 dark:border-slate-700 dark:hover:bg-opacity-0 hover:bg-opacity-0 transition-colors">
								<label
									className="text-gray-800 dark:text-slate-200 text-sm block px-4 pt-3 pb-2 leading-3"
									htmlFor="subjects"
								>
									Subjects
								</label>
								<div className="tw-browse-course-filter w-72">
									<Multiselect
										ref={subjectsMultiSelectRef}
										options={
											subjectsTermData
												? subjectsTermData.subjects
												: []
										} // Options to display in the dropdown
										onSelect={onSubjectChange} // Function will trigger on select event
										onRemove={onSubjectChange} // Function will trigger on select event
										displayValue="name" // Property name to display in the dropdown options
										placeholder="Type or choose..."
										closeIcon="cancel"
										selectedValues={
											urlSelectedSubject
												? [
														{
															id: urlSelectedSubject.id,
															name: urlSelectedSubject.name,
														},
												  ]
												: false
										}
										showCheckbox={true}
										avoidHighlightFirstOption={true}
									/>
								</div>
							</div>
						</div>
						<div className="flex-1 md:ml-4 mt-4 md:mt-0">
							<div className="rounded-lg bg-gray-200 dark:bg-slate-800 bg-opacity-100 border-2 border-gray-200 dark:border-slate-700 dark:hover:bg-opacity-0 hover:bg-opacity-0 transition-colors">
								<label
									className="text-gray-800 dark:text-slate-200 text-sm block px-4 pt-3 pb-2 leading-3"
									htmlFor="subjects"
								>
									Professor
								</label>
								<div className="tw-browse-course-filter w-72">
									<Multiselect
										ref={instructorsMultiSelectRef}
										options={
											instructorsTermData
												? instructorsTermData.instructors
												: []
										} // Options to display in the dropdown
										selectedValues={[]} // Preselected value to persist in dropdown
										onSelect={onProfessorChange} // Function will trigger on select event
										onRemove={onProfessorChange} // Function will trigger on select event
										displayValue="name" // Property name to display in the dropdown options
										placeholder="Type or choose..."
										closeIcon="cancel"
										showCheckbox={true}
										avoidHighlightFirstOption={true}
									/>
								</div>
							</div>
						</div>
					</div>
					<div>
						<button
							onClick={() => applyFilters()}
							className="tw-animation-scaleup-parent bg-accent-700 text-white text-left rounded-md px-3 py-1 font-medium mt-6 ml-1 tw-input-focus dark:hover:outline-transparent"
							// disabled={
							// 	subjsOnChange.length === 0 &&
							// 	profsOnChange.length === 0
							// }
						>
							<span className="tw-animation-scaleup material-icons text-xl align-middle">
								check
							</span>
							<span className="align-middle ml-2.5 mr-0.5">Apply</span>
						</button>
						<button
							onClick={() => removeFilters()}
							className="tw-animation-scaleup-parent ml-5 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-500 hover:bg-red-700 hover:bg-opacity-80 hover:outline hover:outline-4 hover:outline-red-200 dark:hover:outline-transparent hover:text-white dark:hover:text-white px-3 py-[0.18rem] font-medium rounded-md"
							disabled={activeFilterCount === 0}
						>
							<span className="tw-animation-scaleup material-icons text-xl align-middle">
								delete
							</span>
							<span className="align-middle ml-3">Remove All</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
