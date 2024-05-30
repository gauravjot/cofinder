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
	selectAllSchedules,
} from "@/redux/schedules/scheduleSlice";
import { Virtuoso } from "react-virtuoso";
import { useLgMediaQuery } from "@/hooks/useMediaQuery";
import { useMutation } from "react-query";
import { AddScheduleRequestType, addScheduleRequest } from "@/services/user/schedule/add";
import { UserContext } from "@/App";
import { removeScheduleRequest } from "@/services/user/schedule/remove";

const ListRow = React.lazy(() => import("@/features/CourseBrowser/ListRow"));

interface Props {
	listData: SectionsBrowserType[];
	isKFA: boolean;
	isTFA: boolean;
}

export default function List(props: Props) {
	const user_context = React.useContext(UserContext);
	const dispatch = useAppDispatch();
	const schedule = useAppSelector(selectAllSchedules);
	const currentTerm = useAppSelector(selectCurrentTerm);
	const fetchState = useAppSelector(selectAllSections).fetched;

	console.log("render");

	const isLargeScreenSize = useLgMediaQuery();

	const addScheduleMutation = useMutation({
		mutationFn: (payload: AddScheduleRequestType) => {
			return addScheduleRequest(payload);
		},
		onError: (error) => {
			console.error(error);
		},
	});

	const removeScheduleMutation = useMutation({
		mutationFn: (payload: AddScheduleRequestType) => {
			return removeScheduleRequest(payload);
		},
		onError: (error) => {
			console.error(error);
		},
	});

	const addToSchedule = (section: SectionsBrowserType) => {
		if (user_context.data) {
			// Add to schedule in the backend
			let payload = [{ term: currentTerm.code, section: section.crn }];
			addScheduleMutation.mutate(payload);
		}
		// Add to schedule in local
		dispatch(addToMySchedule(section));
	};

	const removeFromSchedule = (section: SectionsBrowserType) => {
		if (user_context.data) {
			// Remove from schedule in the backend
			let payload = [{ term: currentTerm.code, section: section.crn }];
			removeScheduleMutation.mutate(payload);
		}
		// Remove from schedule in local
		dispatch(removeFromMySchedule(section));
	};

	const Row = ({ index }: { index: number }) => {
		return (
			<ListRow
				key={props.listData[index].crn}
				section={props.listData[index]}
				term={currentTerm}
				isSelected={
					schedule.findIndex(
						(o: SectionsBrowserType) => o.crn === props.listData[index].crn
					) !== -1
				}
				doesCollide={
					props.listData[index].is_active
						? checkCollision(props.listData[index].schedule, schedule)
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
				<div className="text-center py-14">
					<Spinner />
					<p className="mt-6 font-medium text-black dark:text-white">
						Getting data for you, hold on!
					</p>
				</div>
			) : fetchState === FetchState.Error ? (
				<div className="rounded bg-red-200/50 dark:bg-red-900/20">
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
					<div className="h-full overflow-hidden bg-white dark:bg-slate-900">
						<div className="border-b border-gray-300 dark:border-slate-800 dark:bg-black/20">
							<div className="container mx-auto">
								<div className="hidden lg:grid grid-cols-[repeat(13,minmax(0,1fr))] tracking-wide font-medium dark:text-white pt-4 pb-3 ">
									<div className="col-span-3 pl-16">Course</div>
									<div className="col-span-1 pr-4">Seats</div>
									<div className="col-span-3 pr-4">Name (credits)</div>
									<div className="col-span-3 pr-4">Instructor</div>
									<div className="col-span-1 pr-4">Medium</div>
									<div className="col-span-2 pr-4">Weekday/s</div>
								</div>
							</div>
						</div>
						<React.Suspense
							fallback={
								<div className="grid items-center justify-center h-full py-24 dark:text-slate-300">
									Processing...
								</div>
							}
						>
							{props.listData.length > 0 ? (
								<Virtuoso
									style={{
										height: isLargeScreenSize
											? "calc(100% - 0rem)"
											: "calc(100% - 3.1rem)",
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
