import * as React from "react";
import { SeatsInfoType, SectionsBrowserType, TermType } from "@/types/dbTypes";
import axios from "axios";
import ListRowExpandInfo from "./ListRowExpandInfo";
import { seatsEP } from "@/server_eps";
import { friendlyInstructionMethod } from "../../utils/process_instruction_method";

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
		if (!props.section.is_active) {
			return;
		}
		if (expand && seatInfo === null) {
			setIsLoadingSeats(true);
			axios
				.get(seatsEP(props.term.code, props.section.crn))
				.then(function (response) {
					setSeatInfo(response.data.seats);
					setIsLoadingSeats(false);
				})
				.catch(function (error) {
					console.log(error);
					setSeatInfo(null);
					setIsLoadingSeats(false);
				});
		}
	}, [expand, props.section.crn, seatInfo, props.term.code]);

	function addToSelected() {
		if (!props.doesCollide && props.section.is_active) {
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
		Mon: "Monday",
		Tue: "Tuesday",
		Wed: "Wednesday",
		Thu: "Thursday",
		Fri: "Friday",
		Sat: "Saturday",
		Sun: "Sunday",
	};

	// Sort the days from Monday - Saturday
	const order = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
	const daysSort = (a: string, b: string) => {
		const indexA = order.indexOf(a);
		const indexB = order.indexOf(b);

		return indexA - indexB;
	};
	let daysOfWeekArray: string[] = [];
	if (props.section.schedule) {
		for (let i = 0; i < props.section.schedule.length; i++) {
			if (daysOfWeekArray.length > 6) {
				break;
			}
			let days = props.section.schedule[i].days;
			if (days) {
				for (let j = 0; j < days.length; j++) {
					let day = days[j];
					if (
						day.length > 0 &&
						order.includes(day) &&
						!daysOfWeekArray.includes(day)
					) {
						daysOfWeekArray.push(day);
					}
				}
			}
		}
	}
	daysOfWeekArray.sort(daysSort);

	const inactiveSectionClass = props.section.is_active
		? ""
		: " dark:text-white line-through opacity-50 ";
	const rowItemClass =
		" items-center place-items-center text-smb leading-5 pr-4 lg:py-2" +
		" text-gray-700 dark:text-white dark:text-opacity-80" +
		inactiveSectionClass;

	return (
		<div>
			<div
				className={
					expand
						? "bg-accent-200 dark:bg-slate-1000"
						: props.isSelected
						? "bg-accent-200 dark:bg-accent-700 hover:bg-accent-200 dark:hover:bg-accent-700"
						: !props.section.is_active
						? "bg-gray-100 dark:bg-slate-900"
						: "hover:bg-opacity-5 dark:hover:bg-slate-700"
				}
			>
				<div
					className={
						"block lg:grid grid-cols-12 transition-colors " +
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
								if (!props.isSelected && !props.section.is_active) {
									return;
								}
								if (!props.doesCollide || props.isSelected)
									toggleSelected();
							}}
							className={
								(props.isSelected
									? "bg-accent-300 dark:bg-accent-800"
									: props.doesCollide && !props.isSelected
									? "bg-zinc-300 dark:bg-zinc-500/30 bg-opacity-30"
									: "hover:bg-accent-300 text-gray-400 hover:text-gray-700 dark:hover:text-white dark:hover:bg-accent-700") +
								" grid place-items-center px-4 tw-tooltip-parent"
							}
							disabled={!props.isSelected && !props.section.is_active}
						>
							<span
								className={
									(props.isSelected
										? "text-accent-700 dark:text-white"
										: props.doesCollide
										? "opacity-20"
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
									" w-8 h-8 rounded-full hover:bg-accent-300 dark:hover:bg-slate-500 my-2 ml-2" +
									inactiveSectionClass
								}
							>
								<span
									className={
										" material-icons text-xl text-black dark:text-white mt-0.5"
									}
								>
									{expand ? "expand_less" : "expand_more"}
								</span>
							</button>
						</div>
						<div
							className={
								" grid place-items-center ml-2 leading-5 pt-3 lg:py-2 dark:text-white order-2 lg:order-3 flex-1 lg:flex-none"
							}
						>
							{!props.section.is_active && (
								<div className="opacity-70 place-self-start">
									Cancelled
								</div>
							)}
							<div
								className={
									"w-full font-medium leading-6 lg:leading-5 lg:font-normal" +
									inactiveSectionClass
								}
							>
								{props.section.course.code}{" "}
								{props.section.is_lab ? (
									<span className="bg-accent-200 dark:bg-accent-600 ml-0.5 align-top text-accent-700 dark:text-white uppercase px-1 text-[0.8rem] font-medium rounded">
										lab
									</span>
								) : (
									<></>
								)}
								<span className="text-gray-700 dark:text-white dark:text-opacity-80 mr-2.5">
									{" - "}
									{props.section.name.replace(
										props.section.course.code,
										""
									)}
								</span>
								<span className="lg:hidden pl-1 text-md">
									{seatInfo ? (
										<SeatInfoBadge
											actual={seatInfo.seats.Actual}
											capacity={seatInfo.seats.Capacity}
										/>
									) : (
										<SeatInfoBadge
											actual={props.section.enrolled}
											capacity={props.section.capacity}
										/>
									)}
									{props.section.medium?.code ? (
										<>
											<br />
											<span className="dark:text-slate-300">
												{friendlyInstructionMethod(
													props.section.medium.code
												)}
											</span>
										</>
									) : (
										""
									)}
								</span>
							</div>
						</div>
					</div>
					<div
						className={rowItemClass + " lg:flex col-span-1 hidden mt-0 pl-0"}
					>
						{seatInfo ? (
							<SeatInfoBadge
								actual={seatInfo.seats.Actual}
								capacity={seatInfo.seats.Capacity}
							/>
						) : (
							<SeatInfoBadge
								actual={props.section.enrolled}
								capacity={props.section.capacity}
							/>
						)}
					</div>
					<div
						className={
							rowItemClass +
							" flex place-items-center col-span-3 pl-[3.65rem] pt-1 lg:py-0 lg:my-0 lg:pl-0"
						}
					>
						{props.section.course.name} ({props.section.course.credits})
					</div>
					<div
						className={
							rowItemClass +
							" flex place-items-center col-span-2 pl-[3.65rem] pt-1 lg:py-0 lg:pl-0 pb-3"
						}
					>
						<div>
							{props.section.instructor &&
								props.section.instructor
									.split(";")
									.map((instructor, index) => (
										<span key={instructor + index}>
											{instructor}
											{index + 1 !==
											props.section.instructor?.split(";").length
												? " • "
												: ""}
										</span>
									))}
						</div>
					</div>
					<div className={rowItemClass + " hidden lg:flex col-span-1"}>
						{props.section.medium
							? friendlyInstructionMethod(props.section.medium.code)
							: ""}
					</div>
					<div className={rowItemClass + " hidden lg:flex col-span-2"}>
						{daysOfWeekArray.map((day, index) => {
							return (
								<span
									key={index}
									className="mx-0.5"
									title={Weekdays[day as keyof typeof Weekdays]}
								>
									{day}
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

function SeatInfoBadge({ actual, capacity }: { actual: number; capacity: number }) {
	return (
		<span
			title="Expand Row to see up-to-date information"
			className={
				(actual >= capacity
					? "bg-red-50 text-red-900 dark:bg-red-600/20 dark:text-red-100"
					: actual / capacity > 0.9
					? "bg-orange-50 text-orange-900 dark:bg-orange-600/20 dark:text-orange-100"
					: "bg-accent-100/50 text-accent-900 dark:bg-accent-600/20 dark:text-accent-100") +
				" py-0.5 text-[98%] px-1 rounded font-mono"
			}
		>
			{actual}/{capacity}
		</span>
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
