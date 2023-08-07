import Spinner from "@/components/ui/Spinner";
import { themeApply } from "@/components/utils/ThemeApply";
import logo from "@/assets/images/branding.png";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import React from "react";
import { useStartSession } from "@/services/auth/start_session";
import { queryFetchUserInfo } from "@/services/user/fetch_info";
import { ROUTE } from "@/routes";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectAllSchedules, set as setSchedule } from "@/redux/schedules/scheduleSlice";
import { isEqual } from "lodash";
import { selectAllTerms } from "@/redux/terms/termSlice";
import { MyScheduleTypeItem } from "../../../types/stateTypes";
import alterBulkSchedule from "@/services/user/section/alter_bulk_schedule";

export default function StartSessionPage() {
	themeApply();
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const [scheduleDiff, setScheduleDiff] = React.useState<boolean>(false);
	const [localSchedule, setLocalSchedule] = React.useState<{
		[key: string]: string[];
	}>();
	const [selectSchToKeep, setSelectSchToKeep] = React.useState<"local" | "cloud">(
		"cloud"
	);
	let token = useParams().token || "";
	let startSession = useStartSession(token);
	let userInfo = queryFetchUserInfo(startSession.token || "");
	const scheduleLocal = useAppSelector(selectAllSchedules);
	const terms = useAppSelector(selectAllTerms);

	React.useEffect(() => {
		if (userInfo.isSuccess && userInfo.data !== null) {
			// Compare Schedules
			let dict: { [key: string]: string[] } = {};
			for (let i = 0; i < scheduleLocal.length; i++) {
				if (scheduleLocal[i].term in dict) {
					dict[scheduleLocal[i].term].push(scheduleLocal[i].section.toString());
				} else {
					dict[scheduleLocal[i].term] = new Array(
						scheduleLocal[i].section.toString()
					);
				}
			}
			let isSchDifferent = !isEqual(JSON.parse(userInfo.data.schedule), dict);
			setScheduleDiff(isSchDifferent);
			setLocalSchedule(dict);
			if (!isSchDifferent) {
				setTimeout(() => {
					navigate(ROUTE.Home);
				}, 1250);
			}
		}
	}, [userInfo.isSuccess, userInfo.data, scheduleLocal]);

	function getTermFromID(term_id: string) {
		return terms.terms.filter((t) => t.id === term_id)[0];
	}

	function saveSchedule() {
		if (selectSchToKeep === "cloud" && userInfo.data) {
			let sch: MyScheduleTypeItem[] = [];
			let data = JSON.parse(userInfo.data.schedule);
			for (let i = 0; i < Object.keys(data).length; i++) {
				for (let j = 0; j < data[Object.keys(data)[i]].length; j++) {
					sch.push({
						section: data[Object.keys(data)[i]][j],
						term: Object.keys(data)[i],
					});
				}
			}
			dispatch(setSchedule(sch));
			navigate(ROUTE.Home);
		} else if (selectSchToKeep === "local" && userInfo.data) {
			// Send schedule to server
			alterBulkSchedule(scheduleLocal, startSession.token).then(() => {
				navigate(ROUTE.Home);
			});
		}
	}

	// If schedule difference is detected due to local schedule being empty
	React.useEffect(() => {
		if (scheduleDiff) {
			if (scheduleLocal.length < 1) {
				saveSchedule();
			}
		}
	}, [scheduleDiff]);

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
					<h3 className="mt-6 mb-4 font-black">Starting session</h3>
					<p className="dark:text-slate-400">
						Please wait while we log you in. It usually take couple of
						seconds.
					</p>
					<div className="text-center mt-6">
						<Spinner />
					</div>
				</div>
				{scheduleDiff && (
					<div className="absolute h-screen w-screen flex place-content-center place-items-center">
						<div className="w-[36rem] max-w-[96%] h-max ml-auto mr-auto dark:bg-slate-800 bg-white rounded-md card-shadow relative z-20">
							<div className="px-8 py-6">
								<div className="mt-3 mb-5 flex place-items-center">
									<div className="bg-orange-200 dark:bg-orange-100/80 p-2 mr-4 leading-[0] rounded-full">
										<span className="ic-xl ic-warning-circle ic-color-warning-700 inline-block"></span>
									</div>
									<h3 className="font-black inline-block">
										Multiple schedules detected
									</h3>
								</div>
								<p className="dark:text-slate-400 text-slate-800 leading-6">
									There seems to be some difference between schedule
									saved in your account and the schedule you made
									earlier.
								</p>

								{/* select start */}
								<div>
									<div>
										<div
											className={
												(selectSchToKeep === "local"
													? "bg-blue-100 border-sky-800/40 border-2 hover:border-sky-800/20 " +
													  "dark:bg-slate-600 dark:border-blue-500/70 "
													: "border border-gray-200 hover:border-gray-300 dark:border-slate-600 hover:dark:border-slate-500 ") +
												"flex border border-gray-200 card-shadow rounded-lg" +
												" py-3 px-5 mt-7 mb-4 cursor-pointer hover:border-gray-300"
											}
											onClick={() => setSelectSchToKeep("local")}
										>
											<div className="flex-1">
												<h5 className="font-bold mb-0.5">
													Local
												</h5>
												{localSchedule &&
													selectSchToKeep === "cloud" && (
														<p className="leading-6 text-slate-600 text-sm dark:text-slate-400">
															Schedules saved for:{" "}
															{Object.keys(
																localSchedule
															).map((term_id) => {
																return (
																	<span>
																		{
																			getTermFromID(
																				term_id
																			).name
																		}
																		,{" "}
																	</span>
																);
															})}
														</p>
													)}
												{localSchedule &&
													selectSchToKeep === "local" && (
														<div className="mt-2">
															<table>
																<tbody>
																	{Object.keys(
																		localSchedule
																	).map((term_id) => {
																		return (
																			<tr className="place-items-baseline border-b-2 border-black/5 dark:border-white/10">
																				<td className="w-28 text-sm align-baseline py-1.5 pt-2">
																					{
																						getTermFromID(
																							term_id
																						)
																							.name
																					}
																				</td>
																				<td className="ml-4 mt-1 font-mono py-1.5">
																					{localSchedule[
																						term_id
																					].map(
																						(
																							section
																						) => {
																							return (
																								<span className="px-1 inline-block">
																									•{" "}
																									{
																										section
																									}
																								</span>
																							);
																						}
																					)}
																				</td>
																			</tr>
																		);
																	})}
																</tbody>
															</table>
														</div>
													)}
											</div>
											<div>
												{selectSchToKeep === "local" ? (
													<div className="leading-0 mt-4 mr-2 border-2 border-blue-300 dark:border-blue-400 bg-blue-200 dark:bg-blue-400/30 p-2 rounded-full hover:border-blue-400">
														<span className="ic ic-md ic-done block dark:invert"></span>
													</div>
												) : (
													<div className="w-5 h-5 border-2 border-gray-300 rounded-full mt-4 mr-5 hover:border-accent-600"></div>
												)}
											</div>
										</div>
									</div>

									<div
										className={
											(selectSchToKeep === "cloud"
												? "bg-blue-100 border-sky-800/40 border-2 hover:border-sky-800/20 " +
												  "dark:bg-slate-600 dark:border-blue-500/70 "
												: "border border-gray-200 hover:border-gray-300 dark:border-slate-600 hover:dark:border-slate-500 ") +
											"flex border border-gray-200 card-shadow rounded-lg" +
											" py-3 px-5 mt-7 mb-4 cursor-pointer hover:border-gray-300"
										}
										onClick={() => setSelectSchToKeep("cloud")}
									>
										<div className="flex-1">
											<h5 className="font-bold mb-0.5">Cloud</h5>
											{selectSchToKeep === "local" &&
												userInfo.isSuccess &&
												userInfo.data !== null && (
													<p className="leading-6 text-slate-600 text-sm dark:text-slate-400">
														Schedules saved for:{" "}
														{Object.keys(
															JSON.parse(
																userInfo.data.schedule
															)
														).map((term_id) => {
															return (
																<span>
																	{
																		getTermFromID(
																			term_id
																		).name
																	}
																	,{" "}
																</span>
															);
														})}
													</p>
												)}
											{selectSchToKeep === "cloud" &&
											userInfo.isSuccess &&
											userInfo.data !== null ? (
												<div className="mt-2">
													<table>
														<tbody>
															{Object.keys(
																JSON.parse(
																	userInfo.data.schedule
																)
															).map((term_id) => {
																return (
																	<tr className="place-items-baseline border-b-2 border-black/5 dark:border-white/10">
																		<td className="w-28 text-sm align-baseline py-1.5 pt-2">
																			{
																				getTermFromID(
																					term_id
																				).name
																			}
																		</td>
																		<td className="ml-4 mt-1 font-mono py-1.5">
																			{JSON.parse(
																				userInfo
																					.data
																					?.schedule
																			)[
																				term_id
																			].map(
																				(
																					section: any
																				) => {
																					return (
																						<span className="px-1 inline-block">
																							•{" "}
																							{
																								section
																							}
																						</span>
																					);
																				}
																			)}
																		</td>
																	</tr>
																);
															})}
														</tbody>
													</table>
												</div>
											) : (
												<></>
											)}
										</div>
										<div>
											{selectSchToKeep === "cloud" ? (
												<div className="leading-0 mt-4 mr-2 border-2 border-blue-300 dark:border-blue-400 bg-blue-200 dark:bg-blue-400/30 p-2 rounded-full hover:border-blue-400">
													<span className="ic ic-md ic-done block dark:invert"></span>
												</div>
											) : (
												<div className="w-5 h-5 border-2 border-gray-300 rounded-full mt-4 mr-5 hover:border-accent-600"></div>
											)}
										</div>
									</div>
								</div>
								{/* select ends */}
							</div>
							<button
								className={
									"bg-accent-700 hover:bg-accent-800 w-full " +
									"text-white tracking-widest font-semibold text-center " +
									"py-4 rounded-b-md"
								}
								onClick={saveSchedule}
							>
								PROCEED
							</button>
						</div>
					</div>
				)}
			</div>
		</>
	);
}
