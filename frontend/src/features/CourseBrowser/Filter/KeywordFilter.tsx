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
		<div className="relative inline w-full md:w-auto">
			<input
				type="text"
				className={
					(deferredKeyword.length > 0
						? "bg-accent-100 border-accent-400 dark:bg-accent-400/30 dark:border-accent-500 "
						: "") +
					"font-medium tw-input-focus border rounded-lg border-gray-300 dark:bg-slate-700" +
					" dark:border-slate-900 dark:text-white py-2 px-10 pl-12 disabled:opacity-50" +
					" shadow w-full md:w-full lg:w-[24rem] xl:w-[26rem] 2xl:w-[28rem]"
				}
				placeholder="Search keyword e.g. CIS"
				value={filter_context.keywordFilter}
				disabled={props.fetchState < 0}
				onChange={(e) => filter_context.setKeywordFilter(e.target.value)}
			/>
			<div className="absolute left-1.5 top-[0.35rem] tw-show-on-hover-parent">
				<span className="grid items-center w-8 h-8 text-xl text-center rounded-full material-icons hover:bg-accent-100 dark:text-white dark:hover:bg-slate-900">
					search
				</span>
				<div className="text-gray-600 tw-show-on-hover dark:bg-slate-800 dark:text-slate-300 dark:border-slate-900">
					<span className="block mb-1 font-medium text-gray-800 dark:text-white text-smb">
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
					className="w-8 h-8 text-lg text-gray-500 rounded-full material-icons dark:text-white hover:bg-gray-300 dark:hover:bg-slate-700 hover:text-gray-700"
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
