import * as React from "react";
import Spinner from "@/components/ui/Spinner";
import { ErrorTemplate } from "@/components/utils/ErrorTemplate";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { RootState } from "@/App";
import { checkCollision } from "@/utils/CheckTimeSlotCollision";
import { SectionsBrowserType } from "@/types/dbTypes";
import {
	addToDetailedSchedule,
	removeFromDetailedSchedule,
	addToMySchedule,
	removeFromMySchedule,
} from "@/redux/actions";
import { FetchState } from "@/types/apiResponseType";
import { API_FAIL_RETRY_TIMER } from "@/config";
const ListRow = React.lazy(() => import("@/features/CourseBrowser/ListRow"));

interface Props {
	listData: SectionsBrowserType[];
	isKFA: boolean;
	isTFA: boolean;
}

export default function ListData(props: Props) {
	const dispatch = useAppDispatch();
	const detailedSchedule = useAppSelector((state: RootState) => state.detailedSchedule);
	const currentTerm = useAppSelector((state: RootState) => state.currentTerm);
	const fetchState = useAppSelector((state: RootState) => state.sections).fetched;

	const addToSchedule = (section: SectionsBrowserType) => {
		dispatch(
			addToMySchedule([
				{
					term: currentTerm.id,
					section: section.crn,
				},
			])
		);
		dispatch(addToDetailedSchedule(section));
	};

	const removeFromSchedule = (section: SectionsBrowserType) => {
		dispatch(removeFromMySchedule([{ section: section.crn, term: currentTerm.id }]));
		dispatch(removeFromDetailedSchedule(section.crn));
	};

	return (
		<>
			{fetchState === FetchState.Fetching ? (
				<div className="py-14 text-center">
					<Spinner />
					<p className="text-black dark:text-white mt-6 font-medium">
						Getting data for you, hold on!
					</p>
				</div>
			) : fetchState === FetchState.Error ? (
				<div className="bg-red-200/50 rounded dark:bg-red-900/20">
					<ErrorTemplate
						message={
							<p>
								We encountered an error while getting data from server.
								Make sure no network requests are being blocked.
								<br />
								We will retry to connect in {API_FAIL_RETRY_TIMER /
									1000}{" "}
								secs.
							</p>
						}
					/>
				</div>
			) : props.listData ? (
				<>
					<div className="bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-md py-2">
						<div className="hidden lg:grid grid-cols-12 tracking-wide font-medium dark:text-white pb-4 pt-3 border-b border-gray-300 dark:border-slate-700">
							<div className="col-span-3 pl-16">Course</div>
							<div className="col-span-3 pr-4">Name (credits)</div>
							<div className="col-span-2 pr-4">Subject</div>
							<div className="col-span-2 pr-4">Instructor</div>
							<div className="col-span-1 pr-4">Medium</div>
							<div className="col-span-1 pr-4">Weekday/s</div>
						</div>
						<React.Suspense
							fallback={
								<div className="grid items-center justify-center h-full py-24 dark:text-slate-300">
									Processing...
								</div>
							}
						>
							{props.listData.length > 0 ? (
								props.listData.map((item) => {
									return (
										<ListRow
											key={item.crn}
											section={item}
											term={currentTerm}
											isSelected={
												detailedSchedule?.sections.findIndex(
													(o: SectionsBrowserType) =>
														o.crn === item.crn
												) !== -1
											}
											doesCollide={checkCollision(
												item.schedule,
												detailedSchedule
											)}
											addToSchedule={addToSchedule}
											removeFromSchedule={removeFromSchedule}
										/>
									);
								})
							) : props.listData.length < 1 &&
							  (props.isKFA || props.isTFA) ? (
								<div className="grid items-center justify-center h-full py-24 dark:text-slate-300">
									Unable to find sections with the keyword.
								</div>
							) : (
								<div className="grid items-center justify-center h-full py-24 dark:text-slate-300">
									Processing...
								</div>
							)}
						</React.Suspense>
					</div>
				</>
			) : (
				<div className="grid items-center justify-center h-full py-24 dark:text-slate-300">
					No relevent data found.
				</div>
			)}
		</>
	);
}
