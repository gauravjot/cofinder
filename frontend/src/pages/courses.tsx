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

// Main component
export default function Courses() {
	let params = useParams();

	// States handled by Context
	const [keywordFilter, setKeywordFilter] = React.useState<string>("");
	const [subjectFilter, setSubjectFilter] = React.useState<string[]>([]);
	const [instructorFilter, setInstructorFilter] = React.useState<string[]>([]);
	const [mediumsFilter, setMediumsFilter] = React.useState<string[]>([]); // Instruction Mediums
	const [showNonFullSections, setShowNonFullSections] = React.useState<boolean>(false);

	const [listData, setListData] = React.useState<SectionsBrowserType[]>([]);

	React.useEffect(() => {
		window.scrollTo(0, 0);
		if (params.subject) {
			setSubjectFilter(decodeURIComponent(params.subject).split(","));
		}
		if (params.keyword) {
			setKeywordFilter(decodeURIComponent(params.keyword));
		}
	}, []);

	return (
		<FilterContext.Provider
			value={{
				keywordFilter,
				setKeywordFilter,
				subjectFilter,
				setSubjectFilter,
				instructorFilter,
				setInstructorFilter,
				showNonFullSections,
				setShowNonFullSections,
				mediumsFilter,
				setMediumsFilter,
			}}
		>
			<div className="App">
				<ScrollToTopBtn />
				<Helmet>
					<title>Course Browser - {APP_NAME}</title>
				</Helmet>
				<div className="relative flex">
					<div className="fixed top-0 z-30 flex-none xl:sticky xl:h-screen">
						{/* Sidebar */}
						<Sidebar current="course_browser" />
					</div>
					<div className="flex-1 min-h-screen">
						<div className="relative z-10 h-full bg-slate-100 dark:bg-slate-900 bg-opacity-80">
							<ErrorBoundary>
								<React.Suspense
									fallback={
										<div className="grid items-center justify-center h-full bg-slate-100 dark:bg-slate-900">
											<Spinner />
										</div>
									}
								>
									<Filter setData={setListData} />
									<CourseBrowserContent
										data={listData}
										isTrustedFilterActive={
											subjectFilter.length > 0 ||
											instructorFilter.length > 0 ||
											mediumsFilter.length > 0
										}
										isKeywordFilterActive={keywordFilter.length > 0}
									/>
								</React.Suspense>
							</ErrorBoundary>
						</div>
					</div>
				</div>
			</div>
		</FilterContext.Provider>
	);
}

// Context for filters
export const FilterContext = React.createContext({
	keywordFilter: "",
	setKeywordFilter: () => {},
	subjectFilter: [],
	setSubjectFilter: () => {},
	instructorFilter: [],
	setInstructorFilter: () => {},
	showNonFullSections: false,
	setShowNonFullSections: () => {},
	mediumsFilter: [],
	setMediumsFilter: () => {},
} as {
	keywordFilter: string;
	setKeywordFilter: React.Dispatch<React.SetStateAction<string>>;
	subjectFilter: string[];
	setSubjectFilter: React.Dispatch<React.SetStateAction<string[]>>;
	instructorFilter: string[];
	setInstructorFilter: React.Dispatch<React.SetStateAction<string[]>>;
	showNonFullSections: boolean;
	setShowNonFullSections: React.Dispatch<React.SetStateAction<boolean>>;
	mediumsFilter: string[];
	setMediumsFilter: React.Dispatch<React.SetStateAction<string[]>>;
});
