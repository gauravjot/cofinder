import Spinner from "@/components/ui/Spinner";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { InstructorType } from "@/types/dbTypes";
import { getColor } from "../MyCourses";
import {
	ReduxCourseType,
	ReduxInstructorType,
	CourseSubjectType,
} from "@/types/stateTypes";
import { ROUTE } from "@/routes";
import { useFetchCourses } from "@/services/core/fetch_courses";
import { useFetchInstructors } from "@/services/core/fetch_instructors";

export default function Search() {
	const navigate = useNavigate();
	const [isFocused, setIsFocused] = React.useState<boolean>();
	const [currentSearchTab, setCurrentSearchTab] = React.useState<number>(0);
	const componentRef = React.useRef<HTMLDivElement>(null);
	// keyword
	const [keyword, setKeyword] = React.useState<string>("");
	const deferredKeyword = React.useDeferredValue(keyword);
	// is Searching
	const [isSearching, setIsSearching] = React.useState(false);
	// results
	const [filteredInstructors, setFilteredInstructors] =
		React.useState<InstructorType[]>();
	const [filteredCourses, setFilteredCourses] = React.useState<CourseSubjectType[]>();

	// Detect mouse click outside of search component
	const outsideClickEventHandler = (e: MouseEvent) => {
		if (componentRef.current && !componentRef.current.contains(e.target as Node)) {
			setIsFocused(false);
			window.removeEventListener("click", outsideClickEventHandler);
		}
	};

	const instructors: ReduxInstructorType = useFetchInstructors();
	const courses: ReduxCourseType = useFetchCourses();

	React.useEffect(() => {
		if (
			deferredKeyword.length > 0 &&
			instructors?.fetched !== 0 &&
			courses?.fetched !== 0
		) {
			setIsSearching(true);
			let list1 = instructors?.instructors?.filter((instructor) => {
				return instructor.name
					.toLowerCase()
					.includes(deferredKeyword.toLowerCase());
			});
			let list2 = courses?.courses?.filter((course) => {
				return (
					course.name.toLowerCase().includes(deferredKeyword.toLowerCase()) ||
					course.subject_id
						.toLowerCase()
						.includes(deferredKeyword.toLowerCase()) ||
					(course.subject_id + " " + course.code)
						.toLowerCase()
						.includes(deferredKeyword.toLowerCase()) ||
					(course.subject_id + course.code)
						.toLowerCase()
						.includes(deferredKeyword.toLowerCase())
				);
			});
			setFilteredInstructors(list1);
			setFilteredCourses(list2);
			setIsSearching(false);
		} else {
			setFilteredCourses([]);
			setFilteredInstructors([]);
			setIsSearching(false);
		}
	}, [deferredKeyword, instructors, courses]);

	return (
		<div
			ref={componentRef}
			aria-selected={isFocused}
			className="tw-searchbar inline-block relative"
		>
			<input
				id="searchinput"
				type="text"
				aria-current={isFocused !== undefined && isFocused}
				placeholder="Type a course or professor"
				onFocus={() => {
					if (!isFocused) {
						setIsFocused(true);
						window.addEventListener("click", outsideClickEventHandler);
					}
				}}
				value={deferredKeyword}
				onChange={(e) => setKeyword(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === "Enter")
						navigate(ROUTE.CourseBrowserKeywordFilter(deferredKeyword));
				}}
			/>
			<label
				className="absolute z-20 top-[0.32rem] left-3 cursor-pointer"
				htmlFor="searchinput"
			>
				{isSearching ? (
					<div className="scale-[0.4] w-4 h-4 absolute -left-1 -top-[0.1rem]">
						<Spinner fade={false} />
					</div>
				) : !isSearching && deferredKeyword.length > 0 ? (
					<span className="material-icons text-2xl text-accent-700 dark:text-white">
						search
					</span>
				) : (
					<span className="material-icons text-2xl text-slate-400">search</span>
				)}
			</label>
			<div
				className={
					deferredKeyword === ""
						? "hidden"
						: "absolute z-20 right-[.325rem] top-[0.31rem]"
				}
			>
				<button
					className="material-icons text-gray-500 dark:text-white text-lg rounded-full w-8 h-8 hover:bg-gray-200 dark:hover:bg-slate-900 dark:hover:text-white hover:text-gray-700"
					onClick={() => setKeyword("")}
				>
					close
				</button>
			</div>
			<div
				className="tw-searchbar-shadow accordion absolute -top-1 -left-1 -right-1 text-left z-10 bg-white dark:bg-slate-700 rounded-xl border border-gray-200 dark:border-slate-800"
				aria-expanded={isFocused !== undefined && isFocused}
			>
				<div className="mt-12 relative">
					<div className="border-b-2 border-gray-200 dark:border-slate-600 z-10 shadow-smb absolute bottom-0 left-0 right-0"></div>
					<nav className="px-4 relative z-20">
						<button
							className="tw-search-tab inline-block text-sm"
							aria-current={currentSearchTab === 0}
							onClick={() => {
								setCurrentSearchTab(0);
							}}
						>
							All{" "}
							{(filteredCourses && filteredCourses.length > 0) ||
							(filteredInstructors && filteredInstructors.length > 0) ? (
								<span className="bg-accent-300 bg-opacity-50 dark:bg-white text-gray-700 px-1 rounded text-[0.7rem] ml-2">
									{(filteredCourses ? filteredCourses.length : 0) +
										(filteredInstructors
											? filteredInstructors.length
											: 0)}
								</span>
							) : (
								""
							)}
						</button>
						<button
							className="tw-search-tab inline-block ml-1 text-sm"
							aria-current={currentSearchTab === 1}
							onClick={() => {
								setCurrentSearchTab(1);
							}}
						>
							Courses
							{filteredCourses && filteredCourses.length > 0 ? (
								<span className="bg-accent-300 bg-opacity-50 dark:bg-white text-gray-700 px-1 rounded text-[0.7rem] ml-2">
									{filteredCourses.length}
								</span>
							) : (
								""
							)}
						</button>
						<button
							className="tw-search-tab inline-block ml-1 text-sm"
							aria-current={currentSearchTab === 2}
							onClick={() => {
								setCurrentSearchTab(2);
							}}
						>
							Professors
							{filteredInstructors && filteredInstructors.length > 0 ? (
								<span className="bg-accent-300 bg-opacity-50 dark:bg-white text-gray-700 px-1 rounded text-[0.7rem] ml-2">
									{filteredInstructors.length}
								</span>
							) : (
								""
							)}
						</button>
					</nav>
				</div>
				<div className="py-2 max-h-[28rem] overflow-y-auto bg-gray-100 dark:bg-slate-700 rounded-b-xl">
					<div className="p-1"></div>
					<div aria-posinset={currentSearchTab}>
						{currentSearchTab === 0 &&
						filteredInstructors &&
						filteredInstructors.length ? (
							<div className="mx-4 text-[0.8rem] text-gray-600 dark:text-slate-400 my-1.5">
								Filtered Professors
							</div>
						) : (
							""
						)}
						{currentSearchTab !== 1 &&
							filteredInstructors &&
							filteredInstructors
								.slice(
									0,
									currentSearchTab === 0
										? 3
										: filteredInstructors.length
								)
								.map((instructor, index) => {
									return (
										<div className="mx-2.5 my-1" key={index}>
											<button
												onClick={() => {
													navigate(
														ROUTE.CourseBrowserKeywordFilter(
															instructor.name
														)
													);
												}}
												className="w-full text-left px-2 py-2 flex outline outline-2 outline-transparent hover:outline-accent-400 dark:hover:outline-slate-400 rounded-lg cursor-pointer focus-visible:outline-accent-400 dark:focus-visible:outline-slate-400"
											>
												<div className="font-mono h-7 w-7 bg-gray-200 dark:bg-slate-900 border border-gray-400 dark:border-slate-1000 rounded-full text-gray-500 dark:text-slate-400 text-center mr-4 flex items-center justify-center leading-0 text-[0.85rem] font-medium">
													{instructor.name.charAt(0)}
												</div>
												<div>
													<h5 className="text-[0.95rem] leading-4 font-medium dark:text-white">
														{instructor.name}
													</h5>
													<span className="text-gray-500 text-[0.8rem] dark:text-slate-400">
														Professor
													</span>
												</div>
											</button>
										</div>
									);
								})}
						{currentSearchTab === 0 &&
						filteredCourses &&
						filteredCourses.length ? (
							<div className="mx-4 text-[0.8rem] text-gray-600 my-1.5 dark:text-slate-400">
								Filtered Courses
							</div>
						) : (
							""
						)}
						{currentSearchTab !== 2 &&
							filteredCourses &&
							filteredCourses
								.slice(
									0,
									currentSearchTab === 0 &&
										filteredCourses &&
										filteredCourses.length > 2
										? 3
										: filteredCourses.length
								)
								.map((course, index) => {
									return (
										<div className="mx-2.5 my-1" key={index}>
											<button
												onClick={() => {
													navigate(
														ROUTE.CourseBrowserKeywordFilter(
															course.subject_id +
																" " +
																course.code
														)
													);
												}}
												className="w-full text-left px-2 py-2 flex outline outline-2 outline-transparent hover:outline-accent-400 dark:hover:outline-slate-400 rounded-lg cursor-pointer focus-visible:outline-accent-400 dark:focus-visible:outline-slate-400"
											>
												<div
													style={{
														backgroundColor: getColor(
															course.subject_id
														),
													}}
													className="font-mono border border-black border-opacity-20 h-7 w-7 bg-opacity-60 rounded-full text-black text-opacity-70 text-center mr-4 flex items-center justify-center leading-0 text-[0.85rem] font-medium"
												>
													{course.subject_id.charAt(0)}
												</div>
												<div>
													<h5 className="text-[0.95rem] leading-4 font-medium dark:text-white">
														{course.name}
													</h5>
													<span className="text-gray-500 text-[0.8rem] dark:text-slate-400">
														<span className="font-medium">
															{course.subject_id}{" "}
															{course.code}
														</span>{" "}
														• {course.credits} credits
													</span>
												</div>
											</button>
										</div>
									);
								})}
					</div>
				</div>
			</div>
		</div>
	);
}
