import { INACTIVE_SECTION_MSG } from "@/strings";
import {
	ScheduleType,
	SeatsInfoType,
	SectionsBrowserType,
	TermType,
} from "@/types/dbTypes";
import { refactorDate } from "@/utils/RefactorDateTime";
import { refactorTime, refactorWeekDay } from "@/utils/RefactorDateTime";

export interface IListRowExpandInfoProps {
	section: SectionsBrowserType;
	term: TermType;
	seatInfo: SeatsInfoType | null;
	isLoadingSeats: boolean;
}

export default function ListRowExpandInfo(props: IListRowExpandInfoProps) {
	return (
		<div className="bg-gray-300 dark:bg-slate-1000 bg-opacity-30 px-4 pl-14 py-4 pb-5 grid grid-flow-row gap-3">
			{!props.section.is_active && (
				<div className="font-bold text-red-700 dark:text-red-400">
					{INACTIVE_SECTION_MSG}
				</div>
			)}
			<div>
				<span className="bg-gray-600 text-gray-200 rounded-lg px-1.5 py-0.5 mr-3 text-sm">
					CRN
				</span>
				<span className="text-gray-800 dark:text-slate-200">
					{props.section.crn}
					{" ("}
				</span>
				<a
					target="_blank"
					rel="noreferrer"
					aria-label="Link to Section details"
					href={
						"https://bn9-sso-prod.ufv.ca/prdssb8/bwckschd.p_disp_detail_sched?term_in=" +
						props.term.date +
						"&crn_in=" +
						props.section.crn
					}
				>
					<span className="align-base mr-1">Check on UFV</span>
					<span className="material-icons text-sm align-base">open_in_new</span>
				</a>
				<span className="text-gray-800 dark:text-slate-200">{")"}</span>
			</div>
			<div className="flex">
				<div>
					<span className="bg-gray-600 text-gray-200 rounded-lg px-1.5 py-0.5 mr-3 text-sm">
						Registration Info
					</span>
				</div>
				<span className="text-gray-800 dark:text-slate-200">
					{props.seatInfo ? (
						<table>
							<tr>
								<td>Section:</td>
								<td className="font-mono">
									{props.seatInfo.seats.Actual}/
									{props.seatInfo.seats.Capacity}
								</td>
							</tr>
							<tr>
								<td className="pr-4">Waitlist:</td>
								<td className="font-mono">
									{props.seatInfo.waitlist.Actual}/
									{props.seatInfo.waitlist.Capacity}
								</td>
							</tr>
						</table>
					) : props.isLoadingSeats ? (
						<>Loading...</>
					) : props.seatInfo === null ? (
						<>Error loading seats information.</>
					) : (
						<></>
					)}
				</span>
			</div>
			<div>
				<span className="bg-gray-600 text-gray-200 rounded-lg px-1.5 py-0.5 mr-3 text-sm">
					Pre-requisites
				</span>
				<span className="text-gray-800 dark:text-slate-200">
					{props.section.course.prereqs}
				</span>
			</div>
			{props.section.course.coreqs.length > 0 &&
			!props.section.course.coreqs.toLowerCase().includes("none") ? (
				<div>
					<span className="bg-gray-600 text-gray-200 rounded-lg px-1.5 py-0.5 mr-3 text-sm">
						Co-requisites
					</span>
					<span className="text-gray-800 dark:text-slate-200">
						{props.section.course.coreqs}
					</span>
				</div>
			) : (
				<></>
			)}
			{props.section.note.length > 2 &&
			!props.section.note.toLowerCase().includes("none") ? (
				<div className="flex">
					<div>
						<span className="bg-gray-600 text-gray-200 rounded-lg px-1.5 py-0.5 mr-3 text-sm">
							Section Notes
						</span>
					</div>
					<span className="text-gray-800 dark:text-slate-200">
						{props.section.note
							.split("//")
							.map((n: string, index: number) => (
								<div key={props.section.crn + "-" + index}>{n}</div>
							))}
					</span>
				</div>
			) : (
				<></>
			)}
			<div>
				<span className="bg-gray-600 text-gray-200 dark:text-slate-200 rounded-lg px-1.5 py-0.5 mr-3 text-sm">
					Schedule
				</span>
				<div className="mt-3">
					<div className="2xl:w-2/3 lg:w-3/4 md:w-full lg:px-4">
						<div className="hidden md:grid grid-cols-6 px-1 text-black dark:text-white pb-1 border-b-2 border-gray-500 dark:border-slate-600">
							<div>Day</div>
							<div>From</div>
							<div>To</div>
							<div>Start</div>
							<div>End</div>
							<div>Location</div>
						</div>
						{props.section.schedule.map((s: ScheduleType, index: number) => {
							return (
								<div
									key={props.section.crn + "-" + index}
									className="md:grid grid-cols-6 text-gray-800 dark:text-slate-200 border-b border-gray-400 dark:border-slate-600 py-1.5 tracking-wide md:px-1 text-smb"
								>
									<span className="col-span-1">
										{refactorWeekDay(s.weekday)}
										<span className="md:hidden"> • </span>
									</span>
									<span className="col-span-1">
										{refactorDate(s.date_start)}
									</span>
									<span className="col-span-1">
										<span className="md:hidden"> - </span>
										{refactorDate(s.date_end)}
									</span>
									<div className="block md:hidden"></div>
									<span className="col-span-1">
										{s.time_start !== 0 ? (
											refactorTime(s.time_start)
										) : (
											<></>
										)}
									</span>
									<span className="col-span-1">
										<span className="md:hidden"> - </span>
										{s.time_end !== 0 ? (
											refactorTime(s.time_end)
										) : (
											<></>
										)}
									</span>
									<span className="col-span-1">
										<span className="md:hidden"> • </span>
										{s.location.campus}
										{s.location.building} {s.location.room}
									</span>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
}
