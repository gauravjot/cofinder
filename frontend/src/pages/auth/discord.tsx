import Spinner from "@/components/ui/Spinner";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectAllSchedules } from "@/redux/schedules/scheduleSlice";
import { ROUTE } from "@/routes";
import { authWithDiscord } from "@/services/auth/discord";
import { handleAxiosError } from "@/utils/handleAxiosError";
import { AxiosError } from "axios";
import { isEqual } from "lodash";
import { useContext, useState } from "react";
import { Helmet } from "react-helmet";
import { useQuery, useQueryClient } from "react-query";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import logo from "@/assets/images/branding.png";
import { set as setSchedule } from "@/redux/schedules/scheduleSlice";
import { themeApply } from "@/components/utils/ThemeApply";
import { UserContext } from "@/App";
import CompareScheduleDialog from "@/features/DiscordAuth/CompareScheduleDialog";
import { SectionsBrowserType } from "@/types/dbTypes";
import { addFromScratchScheduleRequest } from "@/services/user/schedule/add_from_scratch";

export default function StartAuthPage() {
	themeApply();
	const queryclient = useQueryClient();
	const navigate = useNavigate();
	const [params, _] = useSearchParams();
	const code = params.get("code") || "";
	const discord_error = params.get("error");
	const dispatch = useAppDispatch();
	const [error, setError] = useState<string | null>(null);
	const [scheduleDiff, setScheduleDiff] = useState<boolean>(false); // Flag if schedule is different
	const user_context = useContext(UserContext);

	const schedule = useAppSelector(selectAllSchedules);
	const [schedule_local, setScheduleLocal] = useState<SectionsBrowserType[]>(schedule);
	const [schedule_from_server, setScheduleFromServer] = useState<SectionsBrowserType[]>(
		[]
	);

	if (discord_error) {
		navigate(ROUTE.Home);
	}

	useQuery(["auth"], () => authWithDiscord(code), {
		retry: false,
		refetchOnWindowFocus: false,
		onSuccess: (response) => {
			setError(null);
			// Set user data
			setScheduleLocal(schedule);
			setScheduleFromServer(response.schedule);
			user_context.setData(response.user);
			// Check course collisions
			let isDifferent = compareSchedules(response.schedule);
			if (isDifferent) {
				// Set schedule diff flag
				setScheduleDiff(true);
			} else {
				// If no schedule changes, navigate to home
				saveServerScheduleToRedux();
				setTimeout(() => {
					navigate(ROUTE.Home);
				}, 1250);
			}
		},
		onError: (error: AxiosError) => {
			handleAxiosError(error, setError);
		},
	});

	function compareSchedules(schedule_from_server: SectionsBrowserType[]) {
		let isDifferent = false;
		// Compare user schedules: local and from server
		isDifferent = !isEqual(schedule_from_server, schedule_local);
		// Check if local schedule is empty
		if (schedule_local.length === 0) {
			isDifferent = false;
		}
		return isDifferent;
	}

	function saveServerScheduleToRedux() {
		dispatch(setSchedule(schedule_from_server));
	}

	function saveSchedule(selected_schedule: "cloud" | "local") {
		if (selected_schedule === "cloud") {
			saveServerScheduleToRedux();
			navigate(ROUTE.Home);
		} else if (selected_schedule === "local") {
			// Send schedule to server
			let payload = [];
			for (let i = 0; i < schedule_local.length; i++) {
				payload.push({
					section: schedule_local[i].crn,
					term: schedule_local[i].term,
				});
			}
			addFromScratchScheduleRequest(payload).then(() => {
				// Invalidate user schedule query
				queryclient.invalidateQueries("user_schedule");
				navigate(ROUTE.Home);
			});
		}
	}

	return (
		<>
			<Helmet>
				<title>Authenticating with CoFinder</title>
			</Helmet>
			<div className="h-screen bg-gray-200 dark:bg-slate-900 flex place-items-center place-content-center relative">
				<div className="fog-up absolute inset-0 z-5 opacity-20 invert dark:invert-0"></div>
				<div className="dark:bg-slate-800/60 backdrop-blur-sm bg-white/50 rounded-md shadow-xl w-[32rem] max-w-[96%] px-8 py-6 relative z-10">
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
					{!error ? (
						<>
							<h3 className="mt-6 mb-4 font-black">Starting session</h3>
							<p className="dark:text-slate-400">
								Please wait while we log you in. It usually take couple of
								seconds.
							</p>
							<div className="text-center mt-6">
								<Spinner />
							</div>
						</>
					) : error && user_context.data ? (
						<>
							<h3 className="mt-6 mb-4 font-black">
								Hi, {user_context.data.user.name}!
							</h3>
							<p className="dark:text-slate-400">
								You are already logged in. Click on the button below to go
								to homepage.
							</p>
							<Link
								to={ROUTE.Home}
								className="block mt-6 bg-accent-700 hover:bg-accent-800 w-full text-white hover:text-white hover:no-underline tracking-widest font-semibold text-center py-4 rounded-md"
							>
								Back to Home
							</Link>
						</>
					) : (
						<>
							<h3 className="mt-6 mb-4 font-black">
								Sorry, we could not log you in
							</h3>
							<p className="dark:text-slate-400">Error: {error}</p>
							<Link
								to={ROUTE.Home}
								className="block mt-6 bg-accent-700 hover:bg-accent-800 w-full text-white hover:text-white hover:no-underline tracking-widest font-semibold text-center py-4 rounded-md"
							>
								Back to Home
							</Link>
						</>
					)}
				</div>
				{scheduleDiff && (
					<CompareScheduleDialog
						local_schedule={schedule_local}
						server_schedule={schedule_from_server}
						saveScheduleCallback={saveSchedule}
					/>
				)}
			</div>
		</>
	);
}
