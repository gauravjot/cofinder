import { FilterContext } from "@/pages/courses";
import { ROUTE } from "@/routes";
import * as React from "react";
import { useNavigate } from "react-router-dom";

export interface IKeywordFilterProps {
	fetchState: number;
}

export default function KeywordFilter(props: IKeywordFilterProps) {
	const navigate = useNavigate();
	const filter_context = React.useContext(FilterContext);
	const deferredKeyword = React.useDeferredValue(filter_context.keywordFilter);

	React.useEffect(() => {
		filter_context.setKeywordFilter(deferredKeyword);
	}, [deferredKeyword]);

	return (
		<div className="inline relative">
			<input
				type="text"
				className={
					"font-medium tw-input-focus border rounded-lg border-gray-300 dark:bg-slate-700" +
					" dark:border-slate-900 dark:text-white py-2 px-10 pl-12 disabled:opacity-50" +
					" shadow w-[calc(100vw-3rem)] sm:w-[18rem] md:w-[20rem] lg:w-[24rem] xl:w-[26rem] 2xl:w-[28rem]"
				}
				placeholder="Search keyword e.g. CIS"
				value={filter_context.keywordFilter}
				disabled={props.fetchState < 0}
				onChange={(e) => filter_context.setKeywordFilter(e.target.value)}
			/>
			<div className="absolute left-1.5 top-[0.35rem] tw-show-on-hover-parent">
				<span className="material-icons text-xl w-8 h-8 hover:bg-accent-100 rounded-full text-center grid items-center dark:text-white dark:hover:bg-slate-900">
					bolt
				</span>
				<div className="tw-show-on-hover text-gray-600 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-900">
					<span className="block font-medium mb-1 text-gray-800 dark:text-white text-smb">
						Advanced Filtering
					</span>
					Use comma separated values for multiple filters. For example
					<br />
					<code className="block mt-1.5 ml-4 pb-1">cis,comp,math</code>
				</div>
			</div>
			<div
				className={
					deferredKeyword === ""
						? "hidden"
						: "absolute right-[.325rem] top-[0.31rem]"
				}
			>
				<button
					className="material-icons text-gray-500 dark:text-white text-lg rounded-full w-8 h-8 hover:bg-gray-300 dark:hover:bg-slate-700 hover:text-gray-700"
					onClick={() => {
						filter_context.setKeywordFilter("");
						navigate(ROUTE.CourseBrowser, { replace: true });
					}}
				>
					close
				</button>
			</div>
		</div>
	);
}
