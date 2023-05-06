import React from "react";
import { useNavigate } from "react-router-dom";
import { ReduxSubjectType } from "../../data/stateTypes";
import { FETCH } from "hooks/useFetchTermData";
import useFetchTermData from "hooks/useFetchTermData";
import { ROUTE } from "routes";
import { ErrorTemplate } from "components/Utils/ErrorTemplate";
import Spinner from "../Utils/Spinner";

export default function BrowseSubjects() {
	const navigate = useNavigate();

	const subjects: ReduxSubjectType = useFetchTermData({
		fetch: FETCH.Subjects,
	});

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
			{subjects && subjects.subjects ? (
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
			) : subjects?.fetched === -1 ? (
				<div className="border border-red-300 rounded dark:border-red-900">
					<ErrorTemplate message={<>Could not set or find any subjects.</>} />
				</div>
			) : (
				<>
					<Spinner />
				</>
			)}
		</div>
	);
}
