import * as React from "react";
import Sidebar from "@/features/Sidebar/Sidebar";
import Spinner from "@/components/ui/Spinner";
import { SectionsBrowserType } from "@/types/dbTypes";
import ErrorBoundary from "@/components/utils/ErrorBoundary";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { APP_NAME } from "@/config";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/App";
import { FetchState } from "@/types/apiResponseType";

const CourseFilter = React.lazy(() => import("@/features/CourseBrowser/CourseFilter"));
const ListData = React.lazy(() => import("@/features/CourseBrowser/ListData"));
const SelectionBar = React.lazy(() => import("@/features/CourseBrowser/SelectionBar"));

export default function Courses() {
	let params = useParams();
	const [listData, setListData] = React.useState<SectionsBrowserType[]>([]);
	const [isTrustedFilterActive, setIsTrustedFilterActive] =
		React.useState<boolean>(false);
	const [isKeywordFilterActive, setIsKeywordFilterActive] =
		React.useState<boolean>(false);
	const fetchState = useAppSelector((state: RootState) => state.sections).fetched;

	React.useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	React.useEffect(() => {
		if (fetchState === FetchState.Fetching && listData && listData.length > 0) {
			setListData([]);
		}
	}, [fetchState, listData]);

	return (
		<div className="App">
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
								/>
								<div className="p-4 py-8 container mx-auto min-h-screen">
									<div className="flex flex-wrap relative">
										<div className="pt-3 flex-1 mb-4">
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
										<div className="mt-3">
											{fetchState > 0 ? <SelectionBar /> : <></>}
										</div>
										<div className="basis-full h-0"></div>
										<div className="w-full">
											<ListData
												listData={listData}
												isTFA={isTrustedFilterActive}
												isKFA={isKeywordFilterActive}
											/>
										</div>
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
