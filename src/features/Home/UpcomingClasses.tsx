import {
	convertToJsDate,
	getDayAfterDate,
	Weekdays,
} from "@/utils/CheckTimeSlotCollision";
import React from "react";
import { getColor } from "./MyCourses";
import { combineDateTime } from "@/utils/CheckTimeSlotCollision";
import { SectionsBrowserType } from "@/types/dbTypes";
import { useNavigate } from "react-router-dom";
import { ROUTE } from "@/routes";
import { FetchState } from "@/types/apiResponseType";
import Spinner from "@/components/ui/Spinner";
import { useAppSelector } from "@/redux/hooks";
import { selectAllTermSchedules } from "@/redux/schedules/termScheduleSlice";

interface UpcomingSection extends SectionsBrowserType {
	time_start: Date;
	time_end: Date;
	location: string;
}

const days: string[] = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
];
const todayIndex = new Date().getDay();
const daysFromToday = [...days.slice(todayIndex), ...days.slice(0, todayIndex)];

export default function UpcomingClasses() {
	const navigate = useNavigate();
	const [sections, setSections] = React.useState<UpcomingSection[]>([]);
	const [untilNextClass, setUntilNextClass] = React.useState<string>();
	const schedule = useAppSelector(selectAllTermSchedules);

	React.useEffect(() => {
		let seventh_date = new Date();
		seventh_date.setDate(seventh_date.getDate() + 7);
		let result: UpcomingSection[] = [];
		if (schedule && schedule.sections?.length > 0) {
			for (const section of schedule.sections) {
				if (!section.is_active) {
					continue;
				}
				for (const slot of section.schedule) {
					let start_date = getDayAfterDate(
						convertToJsDate(slot.date_start.toString()),
						Weekdays[slot.weekday as keyof typeof Weekdays]
					);
					let end_date = convertToJsDate(slot.date_end.toString());
					if (
						start_date === end_date &&
						combineDateTime(start_date, slot.time_start) < seventh_date &&
						combineDateTime(start_date, slot.time_start) > new Date()
					) {
						result.push({
							...section,
							time_start: combineDateTime(start_date, slot.time_start),
							time_end: combineDateTime(end_date, slot.time_end),
							location:
								slot.location.campus +
								slot.location.building +
								" " +
								slot.location.room,
						});
					} else {
						for (
							let d = new Date(start_date);
							d <= new Date(end_date);
							d.setDate(d.getDate() + 7)
						) {
							if (
								combineDateTime(d, slot.time_start) < seventh_date &&
								combineDateTime(d, slot.time_start) > new Date()
							) {
								result.push({
									...section,
									time_start: combineDateTime(d, slot.time_start),
									time_end: combineDateTime(d, slot.time_end),
									location:
										slot.location.campus +
										slot.location.building +
										" " +
										slot.location.room,
								});
							}
						}
					}
				}
			}
			result = result.sort((a, b) => a.time_start.getTime() - b.time_end.getTime());
			if (result.length > 0) {
				let start_time = new Date(result[0].time_start);
				start_time.setHours(0, 0, 0, 0);
				let date = new Date();
				date.setHours(0, 0, 0, 0);
				let untilNextClass =
					Math.round(Math.abs(start_time.getTime() - date.getTime())) /
					(24 * 60 * 60 * 1000);
				if (untilNextClass < 1) {
					setUntilNextClass("today");
				} else if (untilNextClass === 1) {
					setUntilNextClass("tomorrow");
				} else {
					setUntilNextClass("in " + untilNextClass + " days");
				}
			}
			setSections(result);
		} else {
			setSections([]);
		}
	}, [schedule]);

	let [markDays, setMarkDays] = React.useState<string[]>([]);

	React.useEffect(() => {
		let mD: string[] = [];
		sections.forEach((schedule) => {
			if (!mD.includes(days[schedule.time_start.getDay()])) {
				mD.push(days[schedule.time_start.getDay()]);
			}
		});
		setMarkDays(mD);
	}, [sections]);

	return (
		<div>
			<div className="flex mb-2">
				<h2 className="flex-1 font-medium font-serif">Next 7 days</h2>
				<div className="flex pt-0.5">
					{daysFromToday.map((day, index) => {
						return (
							<div key={index}>
								<div
									className={
										(markDays.includes(day)
											? "bg-gray-700 text-white rounded-full"
											: "text-gray-600") +
										(index === 0
											? " border border-gray-400 dark:border-slate-600 rounded-full"
											: "") +
										" px-1 user-select-none font-medium ml-1 w-7 h-7 text-center text-sm grid place-items-center"
									}
									title={day}
								>
									{day === "Sunday"
										? "U"
										: day === "Thursday"
										? "R"
										: day.charAt(0)}
								</div>
							</div>
						);
					})}
					<div></div>
				</div>
			</div>
			<div className="text-gray-600 dark:text-slate-300 mb-5">
				<span className="material-icons text-xl text-gray-800 dark:text-slate-300 align-middle mr-2">
					schedule
				</span>
				<span className="align-middle">
					{untilNextClass ? (
						<>
							Your next class is{" "}
							<span className="text-black dark:text-slate-100 font-medium">
								{untilNextClass}
							</span>
							.
						</>
					) : (
						"No upcoming class in a week."
					)}
				</span>
			</div>
			{schedule?.fetched === FetchState.Fetching ? (
				<>
					<Spinner />
				</>
			) : sections && sections.length > 0 ? (
				<div className="bg-white dark:bg-slate-800 rounded shadow border border-gray-300 dark:border-slate-700 border-opacity-80">
					{sections.map((schedule, index) => {
						return (
							<div
								key={index}
								className="flex transition-colors text-gray-800 dark:text-white border-b border-gray-300 dark:border-slate-700 border-opacity-80 items-center"
							>
								<div
									className={
										"tw-gradient-tr-" +
										getColor(schedule.subject_id).replace("#", "") +
										" dark:tw-gradient-tr-" +
										getColor(schedule.subject_id).replace("#", "") +
										"w-16 text-slate-700 dark:text-slate-100 m-3 py-3 pl-5 pr-5 grid place-content-center rounded-lg ufvc-clip-right-arrow"
									}
								>
									<div className="text-center">
										<div className="text-sm tracking-tight leading-3">
											{days[schedule.time_start.getDay()].substring(
												0,
												3
											)}
										</div>
										<div className="text-black dark:text-white font-bold text-2xl tracking-tighter leading-6 mt-1.5">
											{schedule.time_end.getDate()}
										</div>
									</div>
								</div>
								<div className="px-2 lg:pr-4 lg:pl-6 flex-1 grid grid-flow-row lg:grid-flow-col lg:grid-cols-12">
									<div className="xl:col-span-2 lg:col-span-2">
										<div className="hidden lg:block text-sm font-medium text-opacity-70 mb-1">
											{schedule.is_lab ? (
												<span className="mr-1.5 bg-black text-white bg-opacity-80 align-top px-1 rounded text-[0.8rem] font-medium">
													LAB
												</span>
											) : (
												"Class"
											)}
										</div>
										<div className="text-[1rem] lg:text-[1.1rem] leading-[1.25rem] font-medium tracking-tight">
											{schedule.subject_id} {schedule.course.code}
										</div>
									</div>
									<div className="xl:col-span-7 lg:col-span-8 flex pr-4">
										<div className="hidden lg:block w-px h-8 bg-gray-400 dark:bg-slate-700 bg-opacity-40 my-auto mx-8 lg:mx-6 md:mx-4"></div>
										<div>
											<div className="hidden lg:block text-sm font-medium text-opacity-70 mb-1">
												Time
											</div>
											<div className="text-[1rem] lg:text-[1.1rem] leading-6 lg:leading-[1.25rem] font-medium lowercase tracking-tight">
												{schedule.time_start.getHours() !== 0
													? schedule.time_start
															.toLocaleTimeString()
															.replace(/:\d+ /, " ") +
													  " - " +
													  schedule.time_end
															.toLocaleTimeString()
															.replace(/:\d+ /, " ")
													: "not available"}
											</div>
										</div>
									</div>
									<div className="xl:col-span-3 lg:col-span-2">
										<div className="hidden lg:block text-sm font-medium text-opacity-70 mb-1">
											Location
										</div>
										<div className="text-[1rem] lg:text-[1.1rem] leading-[1.25rem] font-medium uppercase tracking-tight">
											{schedule.location}
										</div>
									</div>
								</div>
							</div>
						);
					})}
					<div className="text-left">
						<button
							onClick={() => {
								navigate(ROUTE.Calendar);
							}}
							className="tw-animate-to-right-parent m-2.5 tw-accent-light-button"
						>
							<span>Go to calendar</span>
							<span className="tw-animate-to-right material-icons align-top text-base">
								arrow_forward
							</span>
						</button>
					</div>
				</div>
			) : sections?.length === 0 ? (
				<div className="bg-white dark:bg-slate-800 rounded shadow border border-gray-300 dark:border-slate-700 border-opacity-80 px-4 py-8 text-lg text-center font-medium text-gray-800 dark:text-white">
					<span className="material-icons text-gray-400 dark:text-slate-300 text-opacity-40 text-6xl font-bold">
						sports_tennis
					</span>
					<div className="mt-1">Hurray, no classes :)</div>
				</div>
			) : (
				""
			)}
		</div>
	);
}
