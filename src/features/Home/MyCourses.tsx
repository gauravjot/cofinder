import { useNavigate } from "react-router-dom";
import { SectionsBrowserType, TermType } from "@/types/dbTypes";
import { ROUTE } from "@/routes";
import { FetchState } from "@/types/apiResponseType";
import { API_FAIL_RETRY_TIMER } from "@/config";
import { ErrorTemplate } from "@/components/utils/ErrorTemplate";
import Spinner from "@/components/ui/Spinner";
import { useFetchSpecificSections } from "@/services/core/fetch_specific_sections";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/App";
import { queryFetchSeats } from "@/services/core/fetch_seats";

export default function MyCourses() {
	const navigate = useNavigate();
	const schedule = useFetchSpecificSections();
	const currentTerm = useAppSelector((state: RootState) => state.currentTerm);

	return (
		<div>
			<h2 className="mb-6 font-medium font-serif dark:text-white">
				My Courses{" "}
				<span className="dark:text-slate-400 text-slate-500">
					/ {currentTerm.name}
				</span>
			</h2>
			{schedule?.fetched === FetchState.Error ? (
				<div className="bg-red-200/50 rounded dark:bg-red-900/20">
					<ErrorTemplate
						message={
							<>
								There was an error getting upcoming classes over network.
								We will try again in {API_FAIL_RETRY_TIMER / 1000} secs.
							</>
						}
					/>
				</div>
			) : schedule?.fetched === FetchState.Fetching ? (
				<>
					<Spinner />
				</>
			) : schedule && schedule.sections?.length > 0 ? (
				<div className="grid 3xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1">
					{schedule.sections.map((section: SectionsBrowserType) => (
						<SectionItem
							key={section.crn}
							section={section}
							term={currentTerm}
						/>
					))}
				</div>
			) : (
				<>
					<div className="mt-4 px-4 text-center border-dashed border-4 bg-slate-100 dark:bg-slate-800 bg-opacity-40 border-slate-300 dark:border-slate-700 rounded-xl h-80 flex place-items-center justify-center">
						<div>
							<span className="material-icons text-gray-400 dark:text-slate-300 text-opacity-40 text-6xl font-bold">
								category
							</span>
							<p className="text-lg text-gray-900 dark:text-white font-medium mt-4">
								You have no course added.
							</p>
							<p className="text-[0.95rem] leading-6 text-gray-600 dark:text-slate-400 mt-2 lg:w-2/3 mx-auto">
								Select a course and we will take care of the rest. Start
								now!
							</p>
							<br />
							<button
								onClick={() => {
									navigate(ROUTE.CourseBrowser);
								}}
								className="tw-animate-to-90-parent bg-accent-700 px-4 pr-4 py-1.5 align-top font-medium text-white rounded-lg shadow-lg hover:bg-accent-800"
							>
								<span className="tw-animate-to-90 material-icons align-middle text-white text-base">
									add
								</span>
								<span className="align-middle ml-2 text-base font-medium">
									Add Course
								</span>
							</button>
						</div>
					</div>
				</>
			)}
		</div>
	);
}

export function getColor(s: string): string {
	let sum = 0;
	let colors = [
		"#DFE1F5",
		"#FFDEDE",
		"#FFFCD9",
		"#DDEDEA",
		"#DAEAF6",
		"#FFE6CA",
		"#F2DCFF",
	];
	for (let i = 0; i < s.length; i++) {
		sum += s.charCodeAt(i);
	}
	let result = sum % colors.length;
	return colors[result];
}

function SectionItem({
	section,
	term,
}: {
	section: SectionsBrowserType;
	term: TermType;
}) {
	let color: string = getColor(section.subject_id);

	const query = queryFetchSeats(term.term_ident, section.crn);

	return (
		<div className="bg-white dark:bg-slate-800 border-[0.025rem] border-gray-400 dark:border-slate-600 border-opacity-30 shadow-sm relative z-0">
			{section.is_active ? (
				<div
					className={
						"tw-gradient-br-" +
						color.replace("#", "") +
						" dark:tw-gradient-br-" +
						color.replace("#", "") +
						" z-0 h-24 w-24 px-4 pt-4 absolute"
					}
				></div>
			) : (
				<></>
			)}
			<div className="relative z-10 px-4 py-4 h-full">
				{!section.is_active && (
					<div className="font-bold text-sm mb-4 uppercase py-0.5 mr-2 text-red-700 dark:text-red-200 bg-red-100 dark:bg-red-600/20 rounded inline-block px-2">
						Cancelled
					</div>
				)}
				<div
					className={
						(!section.is_active ? "line-through" : "") +
						" flex flex-col h-full"
					}
				>
					<div className="font-bold text-[1.125rem] dark:text-slate-100 leading-[1.125rem]">
						{section.is_lab ? (
							<span
								style={{ color: color }}
								className="mr-1.5 bg-black bg-opacity-80 align-top px-1 rounded text-[0.8rem] font-medium"
							>
								LAB
							</span>
						) : (
							<></>
						)}
						{section.subject_id} {section.course.code}
						{" - "}
						{section.name}
					</div>
					<div className="mt-2 mb-1 flex-1">
						<p className="text-gray-700 dark:text-slate-300 leading-[1.125rem]">
							<span className="block uppercase text-[0.9rem] font-bold">
								{section.course.name}
							</span>
							<span className="mt-2 block leading-[1.125rem] text-[0.925rem] text-gray-800 dark:text-slate-300">
								{section.crn} - {section.instructor}
							</span>
						</p>
					</div>

					{query.isLoading ? (
						<div className="pt-3">
							<Spinner size="small" />
						</div>
					) : query.isSuccess ? (
						<table className="mt-1.5 w-full border-spacing-y-1.5 border-separate">
							<tr>
								<td className="pr-2 w-20 text-gray-800 dark:text-slate-200 leading-[1.125rem] text-[0.95rem]">
									Seats:
								</td>
								<td>
									<div className="relative">
										<div className="relative z-20 text-sm text-center">
											{query.data.seats.Actual} /{" "}
											{query.data.seats.Capacity}
										</div>
										<div
											className="bg-black/10 dark:bg-white/10 absolute inset-0 z-10 rounded"
											style={{ width: "100%" }}
										>
											<div
												className="bg-accent-300 dark:bg-white/20 absolute inset-0 rounded"
												style={{
													width: `${
														(query.data.seats.Actual * 100) /
														(query.data.seats.Capacity > 0
															? query.data.seats.Capacity
															: 1)
													}%`,
												}}
											></div>
										</div>
									</div>
								</td>
							</tr>
							<tr>
								<td className="pr-2 w-20 text-gray-800 dark:text-slate-200 leading-[1.125rem] text-[0.95rem]">
									Waitlist:
								</td>
								<td>
									<div className="relative">
										<div className="relative z-20 text-sm text-center">
											{query.data.waitlist.Actual} /{" "}
											{query.data.waitlist.Capacity}
										</div>
										<div
											className="bg-black/10 dark:bg-white/10 absolute inset-0 z-10 rounded"
											style={{ width: "100%" }}
										>
											<div
												className="bg-accent-300 dark:bg-white/20 absolute inset-0 rounded"
												style={{
													width: `${
														(query.data.waitlist.Actual *
															100) /
														(query.data.waitlist.Capacity > 0
															? query.data.waitlist.Capacity
															: 1)
													}%`,
												}}
											></div>
										</div>
									</div>
								</td>
							</tr>
						</table>
					) : query.isError ? (
						<div className="text-gray-500 mt-2 leading-5 dark:text-slate-400 text-[0.95rem]">
							Error getting seats information.
						</div>
					) : (
						<></>
					)}
				</div>
			</div>
		</div>
	);
}
