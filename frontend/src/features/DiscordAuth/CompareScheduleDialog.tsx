import { SectionsBrowserType, TermType } from "@/types/dbTypes";
import { useState } from "react";

export default function CompareScheduleDialog({
	local_schedule,
	server_schedule,
	saveScheduleCallback,
}: {
	local_schedule: SectionsBrowserType[];
	server_schedule: SectionsBrowserType[];
	saveScheduleCallback: (selected_schedule: "cloud" | "local") => void;
}) {
	const [selectSchToKeep, setSelectSchToKeep] = useState<"local" | "cloud">("cloud");

	function getUniqueTerms(schedule: SectionsBrowserType[]) {
		let terms: Set<string> = new Set();
		for (let i = 0; i < schedule.length; i++) {
			terms.add(schedule[i].term.toString());
		}
		// Convert set to array
		let arr = Array.from(terms);
		console.log(arr);
		return arr;
	}

	return (
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
						There seems to be some difference between schedule saved in your
						account and the schedule you made earlier.
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
									<h5 className="font-bold mb-0.5">Local</h5>
									{local_schedule && selectSchToKeep === "cloud" && (
										<p className="leading-6 text-slate-600 text-sm dark:text-slate-400">
											Schedules saved for:{" "}
											{getUniqueTerms(local_schedule)
												.map((t) => getTermFromID(t).name)
												.join(", ")}
										</p>
									)}
									{local_schedule && selectSchToKeep === "local" && (
										<ListSections
											schedule={local_schedule}
											terms={getUniqueTerms(local_schedule)}
											key={1}
										/>
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
								{selectSchToKeep === "local" && server_schedule && (
									<p className="leading-6 text-slate-600 text-sm dark:text-slate-400">
										Schedules saved for:{" "}
										{getUniqueTerms(server_schedule)
											.map((t) => getTermFromID(t).name)
											.join(", ")}
									</p>
								)}
								{selectSchToKeep === "cloud" && server_schedule ? (
									<ListSections
										schedule={server_schedule}
										terms={getUniqueTerms(server_schedule)}
										key={2}
									/>
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
					onClick={() => {
						saveScheduleCallback(selectSchToKeep);
					}}
				>
					PROCEED
				</button>
			</div>
		</div>
	);
}

function ListSections({
	schedule,
	terms,
}: {
	schedule: SectionsBrowserType[];
	terms: string[];
}) {
	return (
		<div className="mt-2">
			<table>
				<tbody>
					{terms.map((term_code) => {
						return (
							<tr className="place-items-baseline border-b-2 border-black/5 dark:border-white/10">
								<td className="w-28 text-sm align-baseline py-1.5 pt-2">
									{getTermFromID(term_code).name}
								</td>
								<td className="ml-4 mt-1 font-mono py-1.5">
									{schedule
										.filter((s) => s.term.toString() === term_code)
										.map((section) => {
											return (
												<span className="px-1 inline-block">
													• {section.name}
												</span>
											);
										})}
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}

function getTermFromID(term_id: string) {
	// format 202405
	let year = term_id.slice(0, 4);
	let month = term_id.slice(4);
	let term = month === "01" ? "Winter" : month === "05" ? "Summer" : "Fall";
	return { code: term_id, name: term + " " + year } as TermType;
}
