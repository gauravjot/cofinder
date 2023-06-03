import * as React from "react";
import { SeatsInfoType, SectionsBrowserType, TermType } from "@/types/dbTypes";
import axios from "axios";
import ListRowExpandInfo from "./ListRowExpandInfo";
import { seatsEP } from "@/server_eps";

/*

1. This component does not have any logic for adding or
removing courses from schedule. See ListData component
for that functionality.

2. This component is exported as memoized.

*/

interface Props {
	section: SectionsBrowserType;
	isSelected: boolean;
	doesCollide: boolean;
	term: TermType;
	addToSchedule: (item: SectionsBrowserType) => void;
	removeFromSchedule: (item: SectionsBrowserType) => void;
}

export function ListRow(props: Props) {
	const [isLoadingSeats, setIsLoadingSeats] = React.useState<boolean>(false);
	const [seatInfo, setSeatInfo] = React.useState<SeatsInfoType | null>(null);
	const [expand, setExpand] = React.useState<boolean>(false);
	let expandRef: React.RefObject<any> = React.useRef<HTMLDivElement>(null);

	React.useEffect(() => {
		if (expand && seatInfo === null) {
			setIsLoadingSeats(true);
			axios
				.get(seatsEP(props.term.date, props.section.crn))
				.then(function (response) {
					setSeatInfo({
						seats: {
							Actual: response.data.seats.seats.Actual,
							Capacity: response.data.seats.seats.Capacity,
							Remaining: response.data.seats.seats.Remaining,
						},
						waitlist: {
							Actual: response.data.seats.waitlist.Actual,
							Capacity: response.data.seats.waitlist.Capacity,
							Remaining: response.data.seats.waitlist.Remaining,
						},
					});
					setIsLoadingSeats(false);
				})
				.catch(function (error) {
					console.log(error);
					setSeatInfo(null);
					setIsLoadingSeats(false);
				});
		}
	}, [expand, props.section.crn, seatInfo, props.term.date]);

	function addToSelected() {
		if (!props.doesCollide) {
			props.addToSchedule(props.section);
		}
	}

	function removeFromSelected() {
		if (props.isSelected) {
			props.removeFromSchedule(props.section);
		}
	}

	const toggleExpand = () => {
		if (expandRef.current) {
			let attribValue = expandRef.current.getAttribute("aria-expanded");
			expandRef.current.setAttribute(
				"aria-expanded",
				attribValue === "true" ? "false" : "true"
			);
			setExpand(attribValue === "true" ? false : true);
		}
	};

	const toggleSelected = () => {
		!props.isSelected ? addToSelected() : removeFromSelected();
	};

	const Weekdays = {
		M: "Monday",
		T: "Tuesday",
		W: "Wednesday",
		R: "Thursday",
		F: "Friday",
		S: "Saturday",
	};

	const rowItemClass =
		(props.doesCollide && !props.isSelected ? "opacity-50" : "") +
		" items-center text-smb leading-5 pr-4 lg:py-2" +
		" text-gray-700 dark:text-white dark:text-opacity-80";

	return (
		<div>
			<div
				className={
					expand
						? "bg-accent-200 dark:bg-slate-1000"
						: props.isSelected
						? "bg-accent-200 dark:bg-accent-700"
						: props.doesCollide
						? "bg-gray-100 dark:bg-slate-900"
						: ""
				}
			>
				<div
					className={
						"block lg:grid grid-cols-12 hover:bg-black hover:bg-opacity-5" +
						" dark:hover:bg-slate-700 transition-colors " +
						(expand
							? ""
							: props.isSelected
							? "border-b border-accent-300 dark:border-accent-800"
							: "border-b border-gray-300 dark:border-slate-700")
					}
				>
					<div className="col-span-3 flex pr-4">
						<button
							onClick={() => {
								if (!props.doesCollide || props.isSelected)
									toggleSelected();
							}}
							className={
								(props.isSelected
									? "bg-accent-300 dark:bg-accent-800"
									: props.doesCollide && !props.isSelected
									? "bg-red-600 bg-opacity-5"
									: "hover:bg-accent-300 text-gray-400 hover:text-gray-700 dark:hover:text-white dark:hover:bg-accent-700") +
								" grid place-items-center px-4 tw-tooltip-parent"
							}
						>
							<span
								className={
									(props.isSelected
										? "text-accent-700 dark:text-white"
										: props.doesCollide
										? "opacity-40"
										: "") + " dark:text-white material-icons text-lg"
								}
							>
								{props.isSelected
									? "check_circle"
									: props.doesCollide
									? "cancel"
									: "radio_button_unchecked"}
							</span>
							<div
								className="tw-tooltip left-14 top-10 whitespace-nowrap z-10"
								aria-disabled={props.doesCollide && !props.isSelected}
							>
								{props.doesCollide && !props.isSelected ? (
									<span>
										Cannot select this course as the schedule
										<br />
										collides with a course already choosen.
									</span>
								) : !props.isSelected ? (
									"Add to schedule"
								) : (
									"Remove from schedule"
								)}
							</div>
						</button>
						<div className="flex items-center lg:order-2 order-3">
							<button
								onClick={() => toggleExpand()}
								className={
									(expand ? "bg-accent-300 dark:bg-slate-600" : "") +
									" w-8 h-8 rounded-full hover:bg-accent-300 dark:hover:bg-slate-500 my-2 ml-2"
								}
							>
								<span
									className={
										(props.doesCollide && !props.isSelected
											? "opacity-30"
											: "") +
										" material-icons text-xl text-black dark:text-white mt-0.5"
									}
								>
									{expand ? "expand_less" : "expand_more"}
								</span>
							</button>
						</div>
						<div
							className={
								(props.doesCollide && !props.isSelected
									? "opacity-30"
									: "") +
								" grid place-items-center ml-2 leading-5 lg:py-2 dark:text-white order-2 lg:order-3 flex-1 lg:flex-none"
							}
						>
							<div className="w-full font-medium lg:font-normal">
								{props.section.subject_id} {props.section.course.code}{" "}
								{props.section.is_lab ? (
									<span className="bg-accent-200 dark:bg-accent-600 ml-0.5 align-top text-accent-700 dark:text-white uppercase px-1 text-[0.8rem] font-medium rounded">
										lab
									</span>
								) : (
									<></>
								)}
								<span className="text-gray-700 dark:text-white dark:text-opacity-80 mr-2.5">
									{" - "}
									{props.section.name}
								</span>
								<div className="hidden lg:block 2xl:hidden"></div>
								<span>
									{seatInfo ? (
										<span
											className={
												(seatInfo.seats.Actual ===
												seatInfo.seats.Capacity
													? "bg-red-200 text-red-900 dark:bg-red-900 dark:bg-opacity-70 dark:text-red-100"
													: seatInfo.seats.Actual /
															seatInfo.seats.Capacity >
													  0.9
													? "bg-orange-200 text-orange-900 dark:bg-orange-900 dark:bg-opacity-70 dark:text-orange-100"
													: "bg-accent-200 text-accent-900 dark:bg-accent-600 dark:bg-opacity-80 dark:text-accent-100") +
												" py-0.5 text-sm px-0.5 rounded font-mono"
											}
										>
											{seatInfo.seats.Actual}/
											{seatInfo.seats.Capacity}
										</span>
									) : (
										<></>
									)}
								</span>
							</div>
						</div>
					</div>
					<div
						className={
							rowItemClass +
							" flex col-span-3 pl-[3.65rem] -mt-2 lg:mt-0 lg:pl-0"
						}
					>
						{props.section.course.name} ({props.section.course.credits})
					</div>
					<div className={rowItemClass + " hidden lg:flex col-span-2"}>
						{props.section.subject}
					</div>
					<div
						className={
							rowItemClass +
							" lg:flex col-span-2 pl-[3.65rem] py-1 lg:py-0 lg:pl-0 pb-3 lg:pb-0"
						}
					>
						{props.section.instructor}
						<span className="lg:hidden pl-1.5">
							{" • "}
							{props.section.medium}
						</span>
					</div>
					<div className={rowItemClass + " hidden lg:flex col-span-1"}>
						{props.section.medium}
					</div>
					<div className={rowItemClass + " hidden lg:flex col-span-1"}>
						{props.section.schedule
							.slice()
							.reverse()
							.map((schedule, index) => {
								return schedule.weekday.length > 0 &&
									props.section.schedule
										.slice()
										.reverse()
										.slice(0, index)
										.map(({ weekday }) => weekday)
										.indexOf(schedule.weekday) > -1 ? (
									<></>
								) : (
									<span
										key={index}
										className={
											schedule.weekday.length > 0 ? "mx-0.5" : ""
										}
										title={
											Weekdays[
												schedule.weekday as keyof typeof Weekdays
											]
										}
									>
										{schedule.weekday}
									</span>
								);
							})}
					</div>
				</div>
			</div>
			<div
				className="accordion border-b border-gray-300 dark:border-slate-700"
				ref={expandRef}
				aria-expanded="false"
			>
				{expandRef.current?.getAttribute("aria-expanded") === "true" && (
					<ListRowExpandInfo
						isLoadingSeats={isLoadingSeats}
						seatInfo={seatInfo}
						section={props.section}
						term={props.term}
					/>
				)}
			</div>
		</div>
	);
}

/*

We memoized this component so it does not have to rerender if
"isSelected" or "doesCollide" are not changed. This brings
thousands rerenders down to few tens or few hundreds.

*/
const arePropsAreEqual = (prevProp: Props, nextProp: Props) => {
	return (
		prevProp.isSelected === nextProp.isSelected &&
		prevProp.doesCollide === nextProp.doesCollide
	);
};

export default React.memo(ListRow, arePropsAreEqual);
