import Spinner from "@/components/ui/Spinner";
import { themeApply } from "@/components/utils/ThemeApply";
import logo from "@/assets/images/branding.png";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import React from "react";
import { ROUTE } from "@/routes";
import { useStartSession } from "@/services/auth/start_session";

export default function StartSessionPage() {
	const navigate = useNavigate();
	let token = useParams().token || "";
	let startSession = useStartSession(token);

	React.useEffect(() => {
		if (startSession.token.length > 0) {
			const timer = setTimeout(() => {
				navigate(ROUTE.Home);
			}, 1250);
			return () => clearTimeout(timer);
		}
	}, [startSession]);

	themeApply();

	return (
		<>
			<Helmet>
				<title>Authenticating with CoFinder</title>
			</Helmet>
			<div className="h-screen bg-gray-200 dark:bg-slate-900 flex place-items-center place-content-center relative">
				<div className="fog-up absolute inset-0 z-5 opacity-20 invert dark:invert-0"></div>
				<div className="dark:bg-slate-800/60 backdrop-blur-sm bg-white/50 rounded-md shadow-xl w-[32rem] px-8 py-6 relative z-10">
					<div className="flex items-center my-4">
						<img
							src={logo}
							alt="UFV Sidebar Logo"
							className="w-8 md:w-9 xl:w-8"
						/>
						<span className="font-serif font-bold text-gray-800 dark:text-white text-3xl pt-[0.3rem] hidden xl:inline">
							<span className="text-accent-700">o</span>Finder
						</span>
					</div>
					<h3 className="mt-6 mb-4 font-black">Starting session</h3>
					<p className="dark:text-slate-400">
						Please wait while we log you in. It usually take couple of
						seconds.
					</p>
					<div className="text-center mt-6">
						<Spinner />
					</div>
				</div>
			</div>
		</>
	);
}
