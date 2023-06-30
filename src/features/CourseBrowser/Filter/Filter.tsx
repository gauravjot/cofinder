import * as React from "react";
import { SectionsBrowserType, InstructorType, SubjectType } from "@/types/dbTypes";
import {
	ReduxSectionDetailedType,
	ReduxInstructorType,
	ReduxSubjectType,
} from "@/types/stateTypes";
import { useFetchSections } from "@/services/core/fetch_sections";
import { useFetchInstructors } from "@/services/core/fetch_instructors";
import { useFetchSubjects } from "@/services/core/fetch_subjects";
import { filterData } from "./algorithm";
import CourseBrowserFilter from "@/components/ui/coursebrowser/CourseBrowserFilter";
import KeywordFilter from "./KeywordFilter";

interface Props {
	setData: React.Dispatch<React.SetStateAction<SectionsBrowserType[]>>;
	setIsTFA: React.Dispatch<React.SetStateAction<boolean>>;
	setIsKFA: React.Dispatch<React.SetStateAction<boolean>>;
	setSubjectFilter?: string;
	setKeywordFilter?: string;
}

export default function Filter(props: Props) {
	// For expanding filter
	const [expandFilters, setExpandFilters] = React.useState<boolean>(false);
	let expandFiltersRef: React.RefObject<any> = React.useRef<HTMLDivElement>(null);
	const [keyword, setKeyword] = React.useState<string>("");
	// filter subjects and professors from expandable
	// The contains choosen filters by user
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
		for (let i = 0; i < subjectsTermData.subjects.length; i++) {
			if (props.setSubjectFilter === subjectsTermData.subjects[i].id) {
				setUrlSelectedSubject(subjectsTermData.subjects[i]);
				setSelectedSubjects([subjectsTermData.subjects[i]]);
				setActiveFilterCount(1);
				setIsTFA(true);
				break;
			}
		}
	}, [subjectsTermData.subjects, props.setSubjectFilter, setIsTFA]);

	React.useEffect(() => {
		if (props.setKeywordFilter) {
			setKeyword(props.setKeywordFilter);
		}
	}, [props.setKeywordFilter]);

	// Apply Filters
	React.useEffect(() => {
		applyFilters(sectionsTermData.sections, keyword);
	}, [sectionsTermData.sections, keyword]);

	React.useEffect(() => {
		if (selectedInstructors.length + selectedSubjects.length < 1) {
			applyFilters(sectionsTermData.sections, keyword);
		}
	}, [selectedSubjects, selectedInstructors]);

	// Set isKeywordFilterActive
	React.useEffect(() => {
		setIsKFA(keyword.length > 0);
	}, [keyword]);

	const applyFilters = React.useCallback(
		(data: SectionsBrowserType[], keyword: string) => {
			let isAnyFilterActive =
				keyword.length > 0 ||
				selectedSubjects.length > 0 ||
				selectedInstructors.length > 0;
			// If no filter is active then we set state to whole data
			props.setData(
				isAnyFilterActive
					? filterData(data, keyword, selectedSubjects, selectedInstructors)
					: data
			);
			setActiveFilterCount(selectedSubjects.length + selectedInstructors.length);
			setIsTFA(selectedSubjects.length + selectedInstructors.length > 0);
		},
		[selectedSubjects, selectedInstructors]
	);

	const removeFilters = () => {
		setSelectedSubjects([]);
		setSelectedInstructors([]);
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
			<div className="container mx-auto px-4 relative">
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
					<div className="sm:flex-1 flex justify-center items-center sm:justify-end xl:justify-center mb-2 sm:mb-0">
						<KeywordFilter
							fetchState={sectionsTermData.fetched}
							keyword={keyword}
							setKeyword={setKeyword}
						/>
					</div>
					<div className="flex-none text-right lg:min-w-[19rem] hidden xl:block">
						<h5 className="pl-4 font-semibold font-serif dark:text-white">
							Course Browser
						</h5>
					</div>
				</div>
				<div
					id="filter-box"
					className="accordion absolute top-14 sm:top-auto left-2 right-3 md:right-auto md:left-auto tw-shadow bg-gray-50 dark:bg-slate-800 ml-2 rounded-lg px-6 py-6 pb-8 border border-gray-200 dark:border-slate-900 z-30"
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
									<CourseBrowserFilter
										data={subjectsTermData.subjects}
										preSelected={urlSelectedSubject}
										selected={selectedSubjects}
										setSelected={setSelectedSubjects}
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
									Instructor
								</label>
								<div className="tw-browse-course-filter w-72">
									<CourseBrowserFilter
										data={instructorsTermData.instructors}
										selected={selectedInstructors}
										setSelected={setSelectedInstructors}
									/>
								</div>
							</div>
						</div>
					</div>
					<div>
						<button
							onClick={() => {
								applyFilters(sectionsTermData.sections, keyword);
								toggleFilters();
							}}
							className="tw-animation-scaleup-parent bg-accent-700 text-white text-left rounded-md px-3 py-1 font-medium mt-6 ml-1 tw-input-focus dark:hover:outline-transparent"
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
