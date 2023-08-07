import * as React from "react";
import Spinner from "@/components/ui/Spinner";
import { ErrorTemplate } from "@/components/utils/ErrorTemplate";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { checkCollision } from "@/utils/CheckTimeSlotCollision";
import { SectionsBrowserType } from "@/types/dbTypes";
import { FetchState } from "@/types/apiResponseType";
import { API_FAIL_RETRY_TIMER } from "@/config";
import { selectCurrentTerm } from "@/redux/terms/currentTermSlice";
import { selectAllSections } from "@/redux/sections/sectionSlice";
import {
	add as addToMySchedule,
	remove as removeFromMySchedule,
} from "@/redux/schedules/scheduleSlice";
import {
	add as addToTermSchedule,
	remove as removeFromTermSchedule,
} from "@/redux/schedules/termScheduleSlice";
import { useFetchSchedule } from "@/services/core/fetch_schedule";
import { MyScheduleTypeItem } from "@/types/stateTypes";
import { Virtuoso } from "react-virtuoso";
import { useLgMediaQuery } from "@/hooks/useMediaQuery";
import { selectUser } from "../../redux/users/userSlice";

const ListRow = React.lazy(() => import("@/features/CourseBrowser/ListRow"));

interface Props {
	mySchedule: MyScheduleTypeItem[];
	listData: SectionsBrowserType[];
	isKFA: boolean;
	isTFA: boolean;
	showOnlySelected: boolean;
}

export default function List(props: Props) {
	const dispatch = useAppDispatch();
	const detailedSchedule = useFetchSchedule(props.mySchedule);
	const currentTerm = useAppSelector(selectCurrentTerm);
	const userToken = useAppSelector(selectUser)?.token;
	const fetchState = useAppSelector(selectAllSections).fetched;

	const isLargeScreenSize = useLgMediaQuery();

	const addToSchedule = (section: SectionsBrowserType) => {
		dispatch(
			addToMySchedule([
				{
					term: currentTerm.id,
					section: section.crn,
					userToken: userToken,
				},
			])
		);
		dispatch(addToTermSchedule(section));
	};

	const removeFromSchedule = (section: SectionsBrowserType) => {
		dispatch(removeFromTermSchedule(section.crn));
		dispatch(
			removeFromMySchedule([
				{
					term: currentTerm.id,
					section: section.crn,
					userToken: userToken,
				},
			])
		);
	};

	const Row = ({ index }: { index: number }) => {
		return (
			<ListRow
				key={props.listData[index].crn}
				section={props.listData[index]}
				term={currentTerm}
				isSelected={
					detailedSchedule?.sections.findIndex(
						(o: SectionsBrowserType) => o.crn === props.listData[index].crn
					) !== -1
				}
				doesCollide={
					props.listData[index].is_active
						? checkCollision(props.listData[index].schedule, detailedSchedule)
						: false
				}
				addToSchedule={addToSchedule}
				removeFromSchedule={removeFromSchedule}
			/>
		);
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
					<div className="bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-md py-2 h-full overflow-hidden">
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
							{props.showOnlySelected ? (
								detailedSchedule.sections.map((item) => {
									return (
										<ListRow
											key={item.crn}
											section={item}
											term={currentTerm}
											isSelected={true}
											doesCollide={false}
											addToSchedule={addToSchedule}
											removeFromSchedule={removeFromSchedule}
										/>
									);
								})
							) : props.listData.length > 0 ? (
								<Virtuoso
									style={{
										height: isLargeScreenSize
											? "calc(100% - 0rem)"
											: "calc(100% - 3.25rem)",
										overflowX: "hidden",
									}}
									totalCount={props.listData.length}
									itemContent={(index) => {
										return <Row index={index} />;
									}}
								/>
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
