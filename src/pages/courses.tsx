import * as React from "react";
import Sidebar from "@/features/Sidebar/Sidebar";
import Spinner from "@/components/ui/Spinner";
import { SectionsBrowserType } from "@/types/dbTypes";
import ErrorBoundary from "@/components/utils/ErrorBoundary";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { APP_NAME } from "@/config";
import ScrollToTopBtn from "@/components/utils/ScrollToTop";

const Filter = React.lazy(() => import("@/features/CourseBrowser/Filter/Filter"));
const CourseBrowserContent = React.lazy(() => import("@/features/CourseBrowser/Content"));

export default function Courses() {
	let params = useParams();
	const [listData, setListData] = React.useState<SectionsBrowserType[]>([]);
	const [isTrustedFilterActive, setIsTrustedFilterActive] =
		React.useState<boolean>(false);
	const [isKeywordFilterActive, setIsKeywordFilterActive] =
		React.useState<boolean>(false);

	React.useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

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
								<Filter
									setData={setListData}
									setIsTFA={setIsTrustedFilterActive}
									setIsKFA={setIsKeywordFilterActive}
									setSubjectFilter={params.subject}
									setKeywordFilter={params.keyword}
								/>
								<CourseBrowserContent
									data={listData}
									isTrustedFilterActive={isTrustedFilterActive}
									isKeywordFilterActive={isKeywordFilterActive}
								/>
							</React.Suspense>
						</ErrorBoundary>
					</div>
				</div>
			</div>
		</div>
	);
}
