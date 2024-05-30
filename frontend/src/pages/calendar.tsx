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
			<div className="relative flex">
				<div className="fixed top-0 z-20 flex-none h-screen xl:sticky">
					{/* Sidebar */}
					<Sidebar current="calendar" />
				</div>
				<div className="flex-1 min-h-screen">
					<React.Suspense
						fallback={
							<div className="grid items-center justify-center h-full bg-slate-100 dark:bg-slate-900">
								<Spinner />
							</div>
						}
					>
						<div className="z-10 bg-slate-100 dark:bg-slate-900 bg-opacity-80">
							<div className="container min-h-screen p-4 py-8 mx-auto overflow-x-auto">
								<Content />
							</div>
						</div>
					</React.Suspense>
				</div>
			</div>
		</div>
	);
}
