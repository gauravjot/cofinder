import * as React from "react";
import { useLocation } from "react-router-dom";

export interface IKeywordFilterProps {
	keyword: string;
	fetchState: number;
	setKeyword: React.Dispatch<React.SetStateAction<string>>;
}

export default function KeywordFilter(props: IKeywordFilterProps) {
	const location = useLocation();
	// filter keyword from input bar
	const [keyword, setKeyword] = React.useState<string>(
		location.state?.keyword ? location.state.keyword : ""
	);
	const deferredKeyword = React.useDeferredValue(keyword);

	React.useEffect(() => {
		props.setKeyword(deferredKeyword);
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
				value={keyword}
				disabled={props.fetchState < 0}
				onChange={(e) => setKeyword(e.target.value)}
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
					onClick={() => setKeyword("")}
				>
					close
				</button>
			</div>
		</div>
	);
}
