import React from "react";
import Sidebar from "@/features/Sidebar/Sidebar";
import Spinner from "@/components/ui/Spinner";
import ErrorBoundary from "@/components/utils/ErrorBoundary";
import { Helmet } from "react-helmet";
import { APP_NAME, SCHOOL_FULL_NAME, SCHOOL_SHORT_NAME, SCHOOL_WEBSITE } from "@/config";
import { ROUTE } from "@/routes";
import { Link } from "react-router-dom";

const Topbar = React.lazy(() => import("@/features/Home/Topbar/Topbar"));
const MyCourses = React.lazy(() => import("@/features/Home/MyCourses"));
const BrowseSubjects = React.lazy(() => import("@/features/Home/BrowseSubjects"));
const UpcomingClasses = React.lazy(() => import("@/features/Home/UpcomingClasses"));
const NewsFeed = React.lazy(() => import("@/features/Home/NewsFeed"));

function Home() {
	React.useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	return (
		<div className="App">
			<Helmet>
				<title>
					{SCHOOL_SHORT_NAME} {APP_NAME} - Plan, Organize & Succeed
				</title>
			</Helmet>
			<div className="flex relative">
				<div className="flex-none xl:sticky fixed top-0 xl:h-screen z-20">
					{/* Sidebar */}
					<Sidebar current="home" />
				</div>
				<div className="min-h-screen flex-1">
					<React.Suspense
						fallback={
							<div className="bg-slate-200 dark:bg-slate-900 grid items-center justify-center h-full">
								<Spinner />
							</div>
						}
					>
						<div className="sticky top-0 min-h-max bg-white dark:bg-slate-1000 z-10">
							<Topbar title="Plan, Organize & Succeed" />
						</div>
						<div>
							<div className="bg-slate-200 bg-opacity-80 dark:bg-slate-900 z-10">
								<div className="p-4 py-8 container mx-auto min-h-screen">
									<div className="shadow rounded p-4 bg-white dark:bg-slate-1000 mb-8">
										<h4 className="font-medium mb-1">
											Welcome to CoFinder
										</h4>
										<div className="text-gray-700 dark:text-slate-400 py-2 mb-1">
											CoFinder helps you find course offerings for{" "}
											<Link
												to={SCHOOL_WEBSITE}
												target="_blank"
												rel="noopener noreferrer"
											>
												{SCHOOL_FULL_NAME}
											</Link>
											. We are not yet affiliated with any of
											{" " + SCHOOL_SHORT_NAME}'s department, but
											this tool was developed as part of a course
											project within{" " + SCHOOL_SHORT_NAME}.
										</div>
										<Link to={ROUTE.About}>Learn more here</Link>
									</div>
									<div className="grid md:grid-cols-2 gap-12 xl:gap-16 2xl:gap-24 mt-4">
										<div>
											<ErrorBoundary>
												<MyCourses />
											</ErrorBoundary>
											<div className="p-8"></div>
											<ErrorBoundary>
												<UpcomingClasses />
											</ErrorBoundary>
										</div>
										<div>
											<NewsFeed />
											<div className="p-8"></div>
											<BrowseSubjects />
										</div>
									</div>
								</div>
							</div>
						</div>
					</React.Suspense>
				</div>
			</div>
		</div>
	);
}

export default Home;
