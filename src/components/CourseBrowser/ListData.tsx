import * as React from "react";
import Spinner from "components/Utils/Spinner";
import { ErrorTemplate } from "components/Utils/ErrorTemplate";
import { useAppSelector, useAppDispatch } from "redux/hooks";
import { RootState } from "index";
import { checkCollision } from "components/Utils/CheckTimeSlotCollision";
import { SectionsBrowserType } from "data/dbTypes";
import {
	addToDetailedSchedule,
	removeFromDetailedSchedule,
	addToMySchedule,
	removeFromMySchedule,
} from "redux/actions";
const ListRow = React.lazy(() => import("components/CourseBrowser/ListRow"));

interface Props {
	listData: SectionsBrowserType[];
	isLoading: boolean;
	isError: boolean;
}

export default function ListData(props: Props) {
	const dispatch = useAppDispatch();
	const [data, setData] = React.useState<SectionsBrowserType[]>();
	const detailedSchedule = useAppSelector((state: RootState) => state.detailedSchedule);
	const currentTerm = useAppSelector((state: RootState) => state.currentTerm);

	React.useEffect(() => {
		setData(props.listData);
	}, [props.listData]);

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
			{data && data.length > 0 ? (
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
							{data.length > 0 &&
								data.map((item) => {
									return (
										<ListRow
											key={item.crn}
											section={item}
											term={currentTerm}
											isSelected={
												detailedSchedule?.sections.findIndex(
													(o) => o.crn === item.crn
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
			) : props.isLoading ? (
				<div className="py-14 text-center">
					<Spinner />
					<p className="text-black dark:text-white mt-6 font-medium">
						Getting data for you, hold on!
					</p>
				</div>
			) : props.isError ? (
				<ErrorTemplate
					message={
						<>
							We encountered an error while getting data from server. Make
							sure no network requests are being blocked.
						</>
					}
				/>
			) : (
				<></>
			)}
		</>
	);
}
