import React from "react";
import github from "@/assets/svg/github.svg";
import Sidebar from "@/features/Sidebar/Sidebar";
import Spinner from "@/components/ui/Spinner";
import ErrorBoundary from "@/components/utils/ErrorBoundary";
import { Helmet } from "react-helmet";
import {
	APP_NAME,
	GITHUB_URL,
	SCHOOL_FULL_NAME,
	SCHOOL_SHORT_NAME,
	SCHOOL_WEBSITE,
} from "@/config";
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
								<div className="bg-white/50 dark:bg-slate-700/20 border-b border-zinc-300 dark:border-slate-800">
									<div className="p-4 py-6 container mx-auto">
										<WelcomeComponent />
									</div>
								</div>
								<div className="px-4 pb-8 container mx-auto min-h-screen">
									<div className="lg:p-6 p-4"></div>
									<div className="grid md:grid-cols-2 gap-12 xl:gap-16 xl:gap-y-12 2xl:gap-24 2xl:gap-y-14 mt-4">
										<div className="order-1">
											<ErrorBoundary>
												<MyCourses />
											</ErrorBoundary>
										</div>
										<div className="order-2">
											<ErrorBoundary>
												<UpcomingClasses />
											</ErrorBoundary>
										</div>
										<div className="order-3">
											<NewsFeed />
										</div>
										<div className="order-4">
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

function WelcomeComponent() {
	return (
		<div className="grid md:grid-cols-2 gap-4 md:gap-16">
			<div className="col-span-1">
				<div className="font-bold uppercase text-zinc-500 dark:text-slate-500 text-sm mt-2 mb-1">
					Updated daily
				</div>
				<h2 className="font-medium mb-1">Welcome to CoFinder</h2>
				<div className="text-gray-700 dark:text-slate-400 py-2 mb-1">
					CoFinder helps you find course offerings for{" "}
					<Link to={SCHOOL_WEBSITE} target="_blank" rel="noopener noreferrer">
						{SCHOOL_FULL_NAME}
					</Link>
					.
				</div>
			</div>
			<div className="col-span-1 flex place-items-center">
				<ul className="flex flex-col gap-1 py-6 px-5 w-full rounded-3xl border border-slate-300 dark:border-slate-700">
					<li className="flex gap-3 place-items-center">
						<img
							className="size-4 transition-transform dark:invert"
							src={github}
							alt="GitHub"
						/>
						<a
							href={GITHUB_URL}
							className="font-medium inline-block mt-px"
							rel="noopener noreferrer"
							target="_blank"
						>
							Star us on GitHub
						</a>
						<iframe
							src="https://ghbtns.com/github-btn.html?user=gauravjot&repo=cofinder-frontend&type=star&count=true"
							frameBorder="0"
							scrolling="0"
							width="150"
							height="20"
							title="GitHub"
						></iframe>
					</li>
					<li>
						<span className="material-icons align-top text-black dark:text-white scale-125 text-base">
							arrow_forward
						</span>
						<Link to={ROUTE.About} className="pl-3 font-medium">
							Contact Us
						</Link>
					</li>
				</ul>
			</div>
		</div>
	);
}
