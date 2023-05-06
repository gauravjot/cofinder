import * as React from "react";
import Sidebar from "components/Sidebar/Sidebar";
import Spinner from "components/Utils/Spinner";
import { SectionsBrowserType } from "../data/dbTypes";
import ErrorBoundary from "components/Utils/ErrorBoundary";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";

const CourseFilter = React.lazy(() => import("components/CourseBrowser/CourseFilter"));
const ListData = React.lazy(() => import("components/CourseBrowser/ListData"));
const SelectionBar = React.lazy(() => import("components/CourseBrowser/SelectionBar"));

export default function Courses() {
	let params = useParams();
	const [listData, setListData] = React.useState<SectionsBrowserType[]>([]);
	const [isLoading, setIsLoading] = React.useState<boolean>(true);
	const [isError, setIsError] = React.useState<boolean>(false);

	React.useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const setDisplayListData = React.useCallback((data: SectionsBrowserType[]) => {
		setListData(data);
	}, []);

	const setLoadingState = React.useCallback((data: boolean) => {
		setIsLoading(data);
	}, []);

	const setErrorState = React.useCallback((data: boolean) => {
		setIsError(data);
	}, []);

	return (
		<div className="App">
			<Helmet>
				<title>Course Browser • Cofinder</title>
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
									setData={setDisplayListData}
									setLoading={setLoadingState}
									setError={setErrorState}
									setSubjectFilter={params.subject}
									setKeywordFilter={params.keyword}
								/>
								<div className="p-4 py-8 container mx-auto min-h-screen">
									<div className="flex flex-wrap relative">
										<div className="pt-3 flex-1 mb-4">
											<h3 className="font-medium font-serif dark:text-white">
												Course Browser
											</h3>
											<span className="text-sm text-gray-600 dark:text-slate-400">
												{listData.length > 0
													? "showing " +
													  listData.length +
													  " sections"
													: ""}
											</span>
										</div>
										<div className="mt-3">
											{listData.length > 0 ? (
												<SelectionBar />
											) : (
												<></>
											)}
										</div>
										<div className="basis-full h-0"></div>
										<div className="w-full">
											{listData.length > 0 ? (
												<ListData
													listData={listData}
													isLoading={isLoading}
													isError={isError}
												/>
											) : !isLoading ? (
												<div className="text-center bg-white dark:bg-slate-700 dark:text-white my-4 bg-opacity-50 rounded px-4 py-12 shadow">
													<span className="text-red-500 dark:text-white material-icons text-lg align-middle">
														cancel
													</span>
													<span className="font-bold align-middle pl-2">
														No sections found for your filter.
													</span>
												</div>
											) : (
												<div className="grid items-center justify-center h-48">
													<Spinner />
												</div>
											)}
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
