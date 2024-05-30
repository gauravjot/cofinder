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
import { FilterContext } from "@/pages/courses";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import ShowSelectedToggle from "../ShowSelectedToggle";

interface Props {
	setData: React.Dispatch<React.SetStateAction<SectionsBrowserType[]>>;
}

export default function Filter(props: Props) {
	// Context data
	const filter_context = React.useContext(FilterContext);
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

	// Fetch and compute functions
	const sectionsTermData: ReduxSectionDetailedType = useFetchSections();
	const instructorsTermData: ReduxInstructorType = useFetchInstructors();
	const subjectsTermData: ReduxSubjectType = useFetchSubjects();

	// Show schedule (Show selected)
	const mySchedule = useAppSelector((state: RootState) => state.mySchedule);

	React.useEffect(() => {
		if (filter_context.subjectFilter.length < 0) {
			return;
		}
		let subjects: SubjectType[] = [];
		for (let i = 0; i < subjectsTermData.subjects.length; i++) {
			if (
				filter_context.subjectFilter.includes(subjectsTermData.subjects[i].code)
			) {
				setUrlSelectedSubject(subjectsTermData.subjects[i]);
				subjects.push(subjectsTermData.subjects[i]);
			}
		}
		setSelectedSubjects(subjects);
	}, [subjectsTermData.subjects, filter_context.subjectFilter]);

	React.useEffect(() => {
		setKeyword(filter_context.keywordFilter ?? "");
	}, [filter_context.keywordFilter]);

	// Apply Filters
	React.useEffect(() => {
		applyFilters(
			sectionsTermData.sections,
			selectedSubjects,
			selectedInstructors,
			keyword
		);
	}, [sectionsTermData.sections, keyword]);

	// React.useEffect(() => {
	// 	if (selectedInstructors.length + selectedSubjects.length > 0) {
	// 		applyFilters(sectionsTermData.sections, keyword);
	// 	}
	// }, [selectedSubjects, selectedInstructors]);

	const applyFilters = (
		data: SectionsBrowserType[],
		filterSubjects: SubjectType[],
		filterInstructors: InstructorType[],
		keyword: string
	) => {
		let isAnyFilterActive =
			keyword.length > 0 ||
			filterSubjects.length > 0 ||
			filterInstructors.length > 0;
		// If no filter is active then we set state to whole data
		props.setData(
			isAnyFilterActive
				? filterData(data, keyword, filterSubjects, filterInstructors)
				: data
		);
		setActiveFilterCount(filterSubjects.length + filterInstructors.length);
	};

	const removeFilters = async () => {
		setSelectedSubjects([]);
		setSelectedInstructors([]);
		applyFilters(sectionsTermData.sections, [], [], keyword);
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

	const showOnlySelectedToggle = (active: boolean) => {
		if (active) {
			const scheduleRows = sectionsTermData.sections.filter((section) => {
				return mySchedule.some((sch) => {
					return sch.term === section.term && sch.crn === section.crn;
				});
			});
			props.setData(scheduleRows);
			return true;
		} else {
			applyFilters(
				sectionsTermData.sections,
				selectedSubjects,
				selectedInstructors,
				keyword
			);
			return false;
		}
	};

	return (
		<div className="sticky top-0 z-20 h-32 py-px bg-white border-b border-gray-300 md:h-16 dark:bg-slate-1000 dark:border-slate-800">
			<div className="container relative h-full px-4 mx-auto lg:px-0">
				<div className="grid h-full grid-cols-12 gap-2 p-0.5 transition-colors rounded-lg md:ml-16 lg:ml-24 xl:ml-0">
					<div className="flex order-1 col-span-6 ml-12 h-14 md:ml-0 place-items-center md:col-span-4 lg:col-span-3 md:order-1">
						<button
							onClick={() => {
								toggleFilters();
							}}
							id="filter-btn"
							disabled={sectionsTermData.fetched < 0}
							className="py-1.5 pl-2 pr-3 text-white rounded-full shadow md:pl-4 md:pr-6 bg-laccent-800"
						>
							<span className="text-lg align-middle md:text-xl material-icons">
								{expandFilters ? "expand_less" : "expand_more"}
							</span>
							<span className="inline ml-2 text-sm font-medium tracking-wide align-middle md:text-base">
								Filters{" "}
								{activeFilterCount === 0
									? ""
									: "(" + activeFilterCount + ")"}
							</span>
						</button>
					</div>
					<div className="flex justify-center order-3 col-span-12 h-14 place-items-center md:col-span-4 lg:col-span-6 md:order-2">
						<KeywordFilter fetchState={sectionsTermData.fetched} />
					</div>
					<div className="flex justify-end order-2 col-span-6 h-14 place-items-center md:col-span-4 lg:col-span-3 md:order-3">
						<div>
							<ShowSelectedToggle
								mySchedule={mySchedule}
								showOnlySelectedToggle={showOnlySelectedToggle}
							/>
						</div>
					</div>
				</div>
				<div
					id="filter-box"
					className="absolute z-30 px-6 py-6 pb-8 ml-2 border border-gray-200 rounded-lg accordion top-14 sm:top-auto left-2 right-3 md:right-auto md:left-auto tw-shadow bg-gray-50 dark:bg-slate-800 dark:border-slate-900"
					ref={expandFiltersRef}
					aria-expanded="false"
				>
					<div className="md:w-[38rem] text-sm text-gray-600 dark:text-slate-300 mb-4">
						<span className="align-middle material-icons text-smb">info</span>
						<span className="align-middle">
							{" "}
							Filter is set in -or- mode. So, if you choose subject "Comp"
							and professor "Leonard", it will show all courses falling in
							either filters.
						</span>
					</div>
					<div className="md:flex">
						<div className="flex-1">
							<div className="transition-colors bg-gray-200 bg-opacity-100 border-2 border-gray-200 rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-opacity-0 hover:bg-opacity-0">
								<label
									className="block px-4 pt-3 pb-2 text-sm leading-3 text-gray-800 dark:text-slate-200"
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
						<div className="flex-1 mt-4 md:ml-4 md:mt-0">
							<div className="transition-colors bg-gray-200 bg-opacity-100 border-2 border-gray-200 rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-opacity-0 hover:bg-opacity-0">
								<label
									className="block px-4 pt-3 pb-2 text-sm leading-3 text-gray-800 dark:text-slate-200"
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
								applyFilters(
									sectionsTermData.sections,
									selectedSubjects,
									selectedInstructors,
									keyword
								);
								toggleFilters();
							}}
							className="px-3 py-1 mt-6 ml-1 font-medium text-left text-white rounded-md tw-animation-scaleup-parent bg-accent-700 tw-input-focus dark:hover:outline-transparent"
						>
							<span className="text-xl align-middle tw-animation-scaleup material-icons">
								check
							</span>
							<span className="align-middle ml-2.5 mr-0.5">Apply</span>
						</button>
						<button
							onClick={() => removeFilters()}
							className="tw-animation-scaleup-parent ml-5 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-500 hover:bg-red-700 hover:bg-opacity-80 hover:outline hover:outline-4 hover:outline-red-200 dark:hover:outline-transparent hover:text-white dark:hover:text-white px-3 py-[0.18rem] font-medium rounded-md"
							disabled={activeFilterCount === 0}
						>
							<span className="text-xl align-middle tw-animation-scaleup material-icons">
								delete
							</span>
							<span className="ml-3 align-middle">Remove All</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
