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
					{APP_NAME}: Plan, Organize, & Succeed | Find Courses for{" "}
					{SCHOOL_SHORT_NAME}
				</title>
			</Helmet>
			<div className="relative flex">
				<div className="fixed top-0 z-20 flex-none xl:sticky xl:h-screen">
					{/* Sidebar */}
					<Sidebar current="home" />
				</div>
				<div className="flex-1 min-h-screen">
					<React.Suspense
						fallback={
							<div className="grid items-center justify-center h-full bg-slate-100 dark:bg-slate-900">
								<Spinner />
							</div>
						}
					>
						<div className="sticky top-0 z-10 bg-white min-h-max dark:bg-slate-1000">
							<Topbar title="Plan, Organize & Succeed" />
						</div>
						<div>
							<div className="z-10 bg-slate-100 bg-opacity-80 dark:bg-slate-900">
								<div className="border-b bg-white/50 dark:bg-slate-700/20 border-zinc-300 dark:border-slate-800">
									<div className="container p-4 py-6 mx-auto">
										<WelcomeComponent />
									</div>
								</div>
								<div className="container min-h-screen px-4 pb-8 mx-auto">
									<div className="p-4 lg:p-6"></div>
									<div className="grid gap-12 mt-4 md:grid-cols-2 xl:gap-16 xl:gap-y-12 2xl:gap-24 2xl:gap-y-14">
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
		<div className="grid gap-4 md:grid-cols-2 md:gap-16">
			<div className="col-span-1">
				<div className="flex flex-col gap-2 mt-2 mb-1.5 sm:flex-row">
					{/* <div className="text-sm font-bold uppercase text-zinc-500 dark:text-slate-500">
						Updated daily
					</div> */}
					<div className="-mt-0.5">
						<div className="px-1.5 inline-block rounded-md bg-sky-200 border border-sky-300 dark:bg-sky-800/50 dark:border-sky-700 dark:text-white/90 text-[0.95rem]">
							Fall 2024 Now Available!
						</div>
					</div>
				</div>
				<h2 className="mb-1 font-medium">Welcome to CoFinder</h2>
				<div className="py-2 mb-1 text-gray-700 dark:text-slate-400">
					CoFinder helps you find course offerings for{" "}
					<Link to={SCHOOL_WEBSITE} target="_blank" rel="noopener noreferrer">
						{SCHOOL_FULL_NAME}
					</Link>
					.
				</div>
			</div>
			<div className="flex col-span-1 place-items-center">
				<ul className="flex flex-col w-full gap-1 px-5 py-6 border rounded-3xl border-slate-300 dark:border-slate-700">
					<li className="flex gap-3 place-items-center">
						<img
							className="transition-transform size-4 dark:invert"
							src={github}
							alt="GitHub"
						/>
						<a
							href={GITHUB_URL}
							className="inline-block mt-px font-medium"
							rel="noopener noreferrer"
							target="_blank"
						>
							Star us on GitHub
						</a>
						<iframe
							src="https://ghbtns.com/github-btn.html?user=gauravjot&repo=cofinder&type=star&count=true"
							frameBorder="0"
							scrolling="0"
							width="150"
							height="20"
							title="GitHub"
						></iframe>
					</li>
					<li>
						<span className="text-base text-black align-top scale-125 material-icons dark:text-white">
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
