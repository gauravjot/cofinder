import * as React from "react";
import Spinner from "components/ui/Spinner";
import { ErrorTemplate } from "components/utils/ErrorTemplate";
import { useAppSelector, useAppDispatch } from "redux/hooks";
import { RootState } from "index";
import { checkCollision } from "utils/CheckTimeSlotCollision";
import { SectionsBrowserType } from "types/dbTypes";
import {
	addToDetailedSchedule,
	removeFromDetailedSchedule,
	addToMySchedule,
	removeFromMySchedule,
} from "redux/actions";
import { FetchState } from "types/apiResponseType";
const ListRow = React.lazy(() => import("features/CourseBrowser/ListRow"));

interface Props {
	listData: SectionsBrowserType[];
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
				<ErrorTemplate
					message={
						<>
							We encountered an error while getting data from server. Make
							sure no network requests are being blocked.
						</>
					}
				/>
			) : props.listData && props.listData.length > 0 ? (
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
							{props.listData.length > 0 &&
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
								})}
						</React.Suspense>
					</div>
				</>
			) : (
				<div className="text-center bg-white dark:bg-slate-700 dark:text-white my-4 bg-opacity-50 rounded px-4 py-12 shadow">
					<span className="text-red-500 dark:text-white material-icons text-lg align-middle">
						cancel
					</span>
					<span className="font-bold align-middle pl-2">
						No sections found for your filter.
					</span>
				</div>
			)}
		</>
	);
}
