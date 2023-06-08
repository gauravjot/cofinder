import * as React from "react";
import { setDetailedSchedule } from "@/redux/actions";
import { RootState } from "@/App";
import { getColor } from "@/features/Home/MyCourses";
import { SectionsBrowserType } from "@/types/dbTypes";
import { changeMySchedule } from "@/redux/actions";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { refactorTime } from "@/utils/RefactorDateTime";
import { ReduxDetailedScheduleType } from "@/types/stateTypes";
import { useFetchSpecificSections } from "@/services/core/fetch_specific_sections";
import { INACTIVE_SECTION_MSG } from "@/strings";

export default function SelectionBar() {
	const mySchedule = useAppSelector((state: RootState) => state.mySchedule);
	const schedule: ReduxDetailedScheduleType = useFetchSpecificSections();
	const dispatch = useAppDispatch();
	// For expanding filter
	const [expandCS, setExpandCS] = React.useState<boolean>(false);
	let expandCSRef: React.RefObject<any> = React.useRef<HTMLDivElement>(null);

	/* Filter Toggle */
	const toggleFilters = () => {
		if (schedule.sections.length < 1) {
			return;
		}
		if (expandCSRef.current) {
			let attribValue = expandCSRef.current.getAttribute("aria-expanded");
			expandCSRef.current.setAttribute(
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
			setExpandCS(attribValue === "true" ? false : true);
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
			!document.getElementById("cse-box")?.contains(e.target as Node) &&
			!document.getElementById("cse-btn")?.contains(e.target as Node)
		) {
			toggleFilters();
		}
	}, []);

	function removeFromSchedule(index: number) {
		let list = [...schedule.sections];
		list.splice(index, 1);
		let list2 = [...mySchedule];
		list2 = list2.filter((s) => s.section !== schedule.sections[index].crn);
		if (list.length === 0) {
			toggleFilters();
		}
		dispatch(changeMySchedule(list2));
		dispatch(setDetailedSchedule({ sections: list, fetched: schedule.fetched }));
	}

	function refactorDate(date: number) {
		const months = [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec",
		];
		let year = date.toString().substring(0, 4);
		let month = date.toString().substring(4, 6);
		let day = date.toString().substring(6, 8);

		let jsdate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
		return jsdate.getDate() + " " + months[jsdate.getMonth()];
	}

	const Weekdays = {
		M: "Monday",
		T: "Tuesday",
		W: "Wednesday",
		R: "Thursday",
		F: "Friday",
		S: "Saturday",
	};

	return (
		<>
			{schedule?.sections?.length > 0 ? (
				<button
					onClick={() => {
						toggleFilters();
					}}
					id="cse-btn"
					className={
						(expandCS ? "bg-laccent-900" : "bg-laccent-800") +
						" text-white transition-colors shadow font-medium rounded-full px-4 py-2.5"
					}
				>
					<span className="material-icons text-xl align-middle text-white text-opacity-90">
						{expandCS ? "expand_more" : "chevron_right"}
					</span>
					<span className="inline mx-2 font-medium tracking-wide align-middle">
						<span className="text-white text-opacity-90">Selected:</span>{" "}
						<span className="text-lg">{schedule?.sections?.length}</span>
					</span>
				</button>
			) : (
				<button
					id="cse-btn"
					className="bg-gray-300 text-gray-100 dark:bg-slate-800 dark:text-slate-600 transition-colors font-medium rounded-full px-4 py-3 pointer-events-none"
				>
					No Course Selected
				</button>
			)}
			<div
				aria-expanded="false"
				id="cse-box"
				ref={expandCSRef}
				className="accordion z-10 bg-white dark:bg-slate-700 rounded-lg shadow px-4 py-1 absolute top-[4.5rem] right-0"
			>
				{schedule?.sections?.length > 0
					? schedule.sections.map(
							(section: SectionsBrowserType, index: number) => {
								return (
									<div
										key={section.crn}
										className="md:w-[28rem] w-[22rem] py-2 flex"
									>
										<div
											className="flex-none w-6 h-6 mt-2 mr-2 rounded-lg border border-black border-opacity-20"
											style={{
												backgroundColor: getColor(
													section.subject_id.split(" ")[0]
												),
											}}
										></div>
										<div className="rounded py-2.5 px-3 bg-white dark:bg-slate-800 bg-opacity-70 flex-1">
											<h6
												className={
													(!section.is_active
														? "line-through "
														: "") +
													"font-bold leading-5 dark:text-white"
												}
											>
												{section.subject_id} {section.course.code}
												{" - "}
												{section.name}
												{section.is_lab ? (
													<span className="ml-2 font-medium text-sm bg-accent-200 rounded px-1 text-accent-700">
														lab
													</span>
												) : (
													<></>
												)}
											</h6>
											<div className="text-sm text-gray-800 dark:text-slate-400 mt-1">
												{section.instructor} • {section.crn} •{" "}
												{section.medium}
											</div>
											{section.is_active ? (
												<div className="pt-1">
													{section.schedule
														.slice()
														.reverse()
														.map((schedule, index) => {
															return (
																<span
																	key={index}
																	className="text-[0.925rem] text-gray-600 dark:text-slate-300"
																>
																	<div
																		className={
																			section.schedule
																				.slice()
																				.reverse()[
																				index - 1
																			] &&
																			section.schedule
																				.slice()
																				.reverse()[
																				index - 1
																			]
																				.date_start ===
																				schedule.date_start &&
																			section.schedule
																				.slice()
																				.reverse()[
																				index - 1
																			].date_end ===
																				schedule.date_end
																				? "hidden"
																				: "block mb-3 mt-4"
																		}
																	>
																		<span className="text-accent-900 dark:text-white text-[0.9rem] font-medium bg-accent-200 dark:bg-accent-700 dark:bg-opacity-70 rounded px-2 py-0.5">
																			{refactorDate(
																				schedule.date_start
																			)}
																			{" — "}
																			{refactorDate(
																				schedule.date_end
																			)}
																		</span>
																	</div>
																	{section.schedule
																		.slice()
																		.reverse()[
																		index - 1
																	] &&
																	section.schedule
																		.slice()
																		.reverse()[
																		index - 1
																	].time_start ===
																		schedule.time_start &&
																	section.schedule
																		.slice()
																		.reverse()[
																		index - 1
																	].time_end ===
																		schedule.time_end ? (
																		<> </>
																	) : (
																		<span className="dark:text-white font-medium text-black text-[0.94rem]">
																			{index !==
																			0 ? (
																				<div className="my-1 border dark:border-slate-700"></div>
																			) : (
																				<></>
																			)}
																			{refactorTime(
																				schedule.time_start
																			)}
																			{" to "}
																			{refactorTime(
																				schedule.time_end
																			)}
																			{": "}
																		</span>
																	)}
																	<span className="dark:text-white text-accent-700 font-medium">
																		{schedule.weekday
																			? Weekdays[
																					schedule.weekday as keyof typeof Weekdays
																			  ]
																			: "[TBA]"}
																	</span>
																	{" at "}
																	<span className="dark:text-white text-black font-medium">
																		{schedule.location
																			.campus +
																			schedule
																				.location
																				.building +
																			" " +
																			schedule
																				.location
																				.room}
																	</span>
																</span>
															);
														})}
												</div>
											) : (
												<div className="font-bold text-red-700 dark:text-red-400 my-2 leading-5">
													{INACTIVE_SECTION_MSG}
												</div>
											)}
										</div>
										<div className="flex-none">
											<button
												onClick={() => {
													removeFromSchedule(index);
												}}
												id="removeSchBtn"
												className="w-8 h-8 mt-2 ml-2 dark:text-white hover:bg-red-100 dark:hover:bg-red-500 dark:hover:bg-opacity-50 hover:text-red-600 dark:hover:text-red-100 rounded-full"
											>
												<span className="material-icons text-lg">
													delete
												</span>
											</button>
										</div>
									</div>
								);
							}
					  )
					: ""}
			</div>
		</>
	);
}
