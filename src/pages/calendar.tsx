import * as React from "react";
import Sidebar from "@/features/Sidebar/Sidebar";
import Spinner from "@/components/ui/Spinner";
import { Helmet } from "react-helmet";
import { APP_NAME } from "@/config";
const Content = React.lazy(() => import("@/features/Calendar/CalendarContent"));

export default function Calendar() {
	React.useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	return (
		<div className="App">
			<Helmet>
				<title>Your Calendar - {APP_NAME}</title>
			</Helmet>
			<div className="flex relative">
				<div className="flex-none xl:sticky fixed top-0 h-screen z-20">
					{/* Sidebar */}
					<Sidebar current="calendar" />
				</div>
				<div className="min-h-screen flex-1">
					<React.Suspense
						fallback={
							<div className="bg-slate-200 dark:bg-slate-900 grid items-center justify-center h-full">
								<Spinner />
							</div>
						}
					>
						<div className="bg-slate-200 dark:bg-slate-900 bg-opacity-80 z-10">
							<div className="p-4 py-8 container mx-auto min-h-screen overflow-x-auto">
								<Content />
							</div>
						</div>
					</React.Suspense>
				</div>
			</div>
		</div>
	);
}
