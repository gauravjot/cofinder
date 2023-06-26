import * as React from "react";
import Sidebar from "@/features/Sidebar/Sidebar";
import Spinner from "@/components/ui/Spinner";
import { SectionsBrowserType } from "@/types/dbTypes";
import ErrorBoundary from "@/components/utils/ErrorBoundary";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { APP_NAME } from "@/config";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { FetchState } from "@/types/apiResponseType";
import { MyScheduleTypeItem } from "@/types/stateTypes";
import ScrollToTopBtn from "@/components/ui/ScrollToTop";

const CourseFilter = React.lazy(() => import("@/features/CourseBrowser/CourseFilter"));
const ListData = React.lazy(() => import("@/features/CourseBrowser/ListData"));

export default function Courses() {
	const mySchedule = useAppSelector((state: RootState) => state.mySchedule);
	let params = useParams();
	const [listData, setListData] = React.useState<SectionsBrowserType[]>([]);
	const [isTrustedFilterActive, setIsTrustedFilterActive] =
		React.useState<boolean>(false);
	const [isKeywordFilterActive, setIsKeywordFilterActive] =
		React.useState<boolean>(false);
	const [showOnlySelected, setShowOnlySelected] = React.useState<boolean>(false);
	const fetchState = useAppSelector((state: RootState) => state.sections).fetched;

	React.useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	React.useEffect(() => {
		if (fetchState === FetchState.Fetching && listData && listData.length > 0) {
			setListData([]);
		}
	}, [fetchState, listData]);

	React.useEffect(() => {
		// If show selected is enabled but schedule is empty, disable it.
		if (mySchedule.length === 0) {
			setShowOnlySelected(false);
		}
	}, [mySchedule]);

	return (
		<div className="App">
			<ScrollToTopBtn />
			<Helmet>
				<title>Course Browser - {APP_NAME}</title>
			</Helmet>
			<div className="flex relative">
				<div className="flex-none xl:sticky fixed top-0 xl:h-screen z-30">
					{/* Sidebar */}
					<Sidebar current="course_browser" />
				</div>
				<div className="min-h-screen flex-1">
					<div className="bg-slate-200 dark:bg-slate-900 bg-opacity-80 z-10 h-full relative">
						<ErrorBoundary>
							<React.Suspense
								fallback={
									<div className="bg-slate-200 dark:bg-slate-900 grid items-center justify-center h-full">
										<Spinner />
									</div>
								}
							>
								<CourseFilter
									setData={setListData}
									setIsTFA={setIsTrustedFilterActive}
									setIsKFA={setIsKeywordFilterActive}
									setSubjectFilter={params.subject}
									setKeywordFilter={params.keyword}
									showOnlySelected={showOnlySelected}
									schedule={mySchedule}
								/>
								<div className="p-4 py-8 container mx-auto min-h-screen">
									<div className="flex flex-wrap relative place-items-center mb-4">
										<div className="flex-1">
											<h3 className="font-medium font-serif dark:text-white">
												Course Browser
											</h3>
											<div className="flex gap-4 place-items-center my-1">
												<span className="text-sm text-gray-600 dark:text-slate-400">
													{fetchState > 0
														? "showing " +
														  listData?.length +
														  " sections"
														: "loading sections..."}
												</span>
												{isTrustedFilterActive && (
													<span className="bg-orange-200 dark:bg-opacity-10 text-orange-800 dark:text-orange-300 px-2 py-1 rounded text-sm">
														Filters Selected
													</span>
												)}
												{isKeywordFilterActive && (
													<span className="bg-orange-200 dark:bg-opacity-10 text-orange-800 dark:text-orange-300 px-2 py-1 rounded text-sm">
														Keyword Applied
													</span>
												)}
											</div>
										</div>
										<div>
											{fetchState > 0 ? (
												<div className="flex place-items-center">
													<ShowSelectedToggle
														mySchedule={mySchedule}
														setShowOnlySelected={
															setShowOnlySelected
														}
														showOnlySelected={
															showOnlySelected
														}
													/>
												</div>
											) : (
												<></>
											)}
										</div>
									</div>
									<div className="w-full">
										<ListData
											listData={listData}
											isTFA={isTrustedFilterActive}
											isKFA={isKeywordFilterActive}
										/>
									</div>
								</div>
							</React.Suspense>
						</ErrorBoundary>
					</div>
				</div>
			</div>
		</div>
	);
}

function ShowSelectedToggle({
	mySchedule,
	setShowOnlySelected,
	showOnlySelected,
}: {
	mySchedule: MyScheduleTypeItem[];
	setShowOnlySelected: React.Dispatch<React.SetStateAction<boolean>>;
	showOnlySelected: boolean;
}) {
	const currentTerm = useAppSelector((state: RootState) => state.currentTerm);

	React.useEffect(() => {
		setShowOnlySelected(false);
	}, [currentTerm]);

	return (
		<button
			className={
				(showOnlySelected
					? "bg-laccent-800 hover:bg-laccent-900 text-white "
					: "bg-gray-900/5 dark:bg-white/5 hover:bg-black/10 hover:dark:bg-gray-400/20 ") +
				"disabled:opacity-50 flex place-items-center py-2 px-5 rounded-full"
			}
			disabled={
				mySchedule.filter((sch) => {
					return sch.term === currentTerm.id;
				}).length < 1
			}
			onClick={() => {
				setShowOnlySelected(!showOnlySelected);
			}}
		>
			{showOnlySelected ? (
				<span className="ic invert ic-check-box-ticked"></span>
			) : (
				<span className="ic dark:invert ic-check-box-empty"></span>
			)}
			<span className="pt-px pl-2.5">Show Selected</span>
		</button>
	);
}
