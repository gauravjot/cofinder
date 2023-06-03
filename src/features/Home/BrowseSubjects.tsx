import { useNavigate } from "react-router-dom";
import { ReduxSubjectType } from "@/types/stateTypes";
import { ROUTE } from "@/routes";
import { ErrorTemplate } from "@/components/utils/ErrorTemplate";
import Spinner from "@/components/ui/Spinner";
import { useFetchSubjects } from "@/services/core/fetch_subjects";
import { FetchState } from "@/types/apiResponseType";
import { API_FAIL_RETRY_TIMER } from "@/config";

export default function BrowseSubjects() {
	const navigate = useNavigate();

	const subjects: ReduxSubjectType = useFetchSubjects();

	return (
		<div>
			<h2 className="font-medium font-serif dark:text-white">
				Browse courses this semester
			</h2>
			<p className="mt-4 mb-4 text-gray-600 dark:text-slate-100">
				You can also browse our{" "}
				<button
					onClick={() => {
						navigate(ROUTE.CourseBrowser);
					}}
					className="tw-a-button"
				>
					Course Catalogue
				</button>{" "}
				to browse in list form.
			</p>
			{subjects && subjects.subjects.length > 0 ? (
				subjects.subjects.map((subject, index) => (
					<span key={index}>
						{(index > 0 &&
							subjects.subjects[index - 1].name.charAt(0) !==
								subject.name.charAt(0)) ||
						index === 0 ? (
							<div className="border-b font-serif border-gray-300 dark:border-slate-700 mt-4 text-slate-800 dark:text-slate-300">
								<span className="px-2 py-0.5">
									{subject.name.charAt(0)}
								</span>
							</div>
						) : (
							<></>
						)}
						<button
							onClick={() => {
								navigate(ROUTE.CourseBrowserSubjectFilter(subject.id));
							}}
							className="font-medium text-sm text-gray-800 bg-slate-300 dark:text-slate-200 dark:bg-slate-800 px-4 py-2 rounded-md shadow-sm dark:shadow-slate-700 inline-block mt-2.5 mr-2.5 hover:cursor-pointer dark:hover:bg-slate-700 hover:bg-slate-400"
						>
							{subject.name}
						</button>
					</span>
				))
			) : subjects?.fetched === FetchState.Error ? (
				<div className="bg-red-200/50 rounded dark:bg-red-900/20 mt-10">
					<ErrorTemplate
						message={
							<>
								There was an error getting subject list over network. We
								will try again in {API_FAIL_RETRY_TIMER / 1000} secs.
							</>
						}
					/>
				</div>
			) : (
				<>
					<Spinner />
				</>
			)}
		</div>
	);
}
