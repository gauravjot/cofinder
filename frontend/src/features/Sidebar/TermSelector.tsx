import * as React from "react";
import { TermType } from "@/types/dbTypes";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { EP_TERMS } from "@/server_eps";
import { useQuery } from "@tanstack/react-query";
import { selectCurrentTerm, set as setCurrentTerm } from "@/redux/terms/currentTermSlice";
import { clear as clearSections } from "@/redux/sections/sectionSlice";
import { clear as clearInstructors } from "@/redux/instructor/instructorSlice";
import { clear as clearSubjects } from "@/redux/subjects/subjectSlice";
import { clear as clearCourses } from "@/redux/courses/courseSlice";

export default function TermSelector() {
	const dispatch = useAppDispatch();
	const currentTerm: TermType = useAppSelector(selectCurrentTerm);
	const termsButtonRef = React.useRef<HTMLButtonElement>(null);
	const termsMenuRef = React.useRef<HTMLDivElement>(null);
	const [isTermsExpanded, setIsTermsExpanded] = React.useState<boolean>(false);

	/**
	 * Get terms from localstorage. If it is stale,
	 * then it queries the API.
	 * @returns Terms
	 */
	const getTerms = () => {
		console.log("Fetching terms");
		return axios
			.get(EP_TERMS, {
				headers: {
					"Content-Type": "application/json",
				},
			})
			.then((res) => {
				let terms = res.data.terms;

				terms.sort((a: TermType, b: TermType) => {
					if (parseInt(a.code) < parseInt(b.code)) return 1;
					if (parseInt(a.code) > parseInt(b.code)) return -1;
					return 0;
				});
				console.log("Terms fetched");
				console.log(terms);
				return terms;
			});
	};
	const query = useQuery({ queryKey: ["terms"], queryFn: getTerms });

	React.useEffect(() => {
		if (!query.data) {
			return;
		}
		if (currentTerm && currentTerm.code === "0") {
			let term = query.data[0];
			dispatch(
				setCurrentTerm({
					code: term.code,
					name: term.name,
				})
			);
		}
	}, [query.data]);

	const setAppTerm = (term: TermType) => {
		if (currentTerm.code !== term.code) {
			// Clear all states
			dispatch(clearCourses());
			dispatch(clearInstructors());
			dispatch(clearSections());
			dispatch(clearSubjects());
			// Set new Term state
			dispatch(setCurrentTerm(term));
			toggleTermsMenu();
		}
	};

	const toggleTermsMenu = () => {
		if (termsMenuRef.current) {
			let attribValue = termsMenuRef.current.getAttribute("aria-expanded");
			termsMenuRef.current.setAttribute(
				"aria-expanded",
				attribValue === "true" ? "false" : "true"
			);
			if (attribValue === "true" ? false : true) {
				// Detect clicks outside of filter box
				window.addEventListener("click", toggleEventHandler);
			} else {
				window.removeEventListener("click", toggleEventHandler);
			}
			// setting state to re-render
			setIsTermsExpanded(attribValue === "true" ? false : true);
		}
	};

	const toggleEventHandler = React.useCallback((e: MouseEvent) => {
		/* useCallback so function doesnt change in re-renders
       otherwise our add/remove eventListeners will go haywire */
		if (
			!termsMenuRef.current?.contains(e.target as Node) &&
			!termsButtonRef.current?.contains(e.target as Node)
		) {
			termsMenuRef.current?.setAttribute("aria-expanded", "false");
			setIsTermsExpanded(false);
		}
	}, []);

	return (
		<nav aria-label="Terms" className="relative px-4">
			<div className="pb-2 text-base text-gray-600 dark:text-slate-400">
				Current Term
			</div>
			{query.isError ? (
				<div className="pt-1">
					<p className="leading-5 text-red-700 dark:text-red-400">
						Failed to reach server. Refresh the page or try again later.
					</p>
				</div>
			) : query.isSuccess ? (
				<>
					<button
						type="button"
						className={
							(isTermsExpanded
								? "rounded-t-md border border-gray-300 dark:border-slate-800 dark:bg-slate-700 border-b-transparent dark:text-slate-100"
								: "rounded-md border border-gray-300 dark:border-slate-800 dark:bg-slate-800") +
							" bg-white inline-flex w-full text-gray-900 dark:text-white justify-center gap-x-1.5 px-4 py-2.5 text-sm font-semibold tw-shadow-sm hover:text-black transition-colors"
						}
						id="menu-button"
						aria-haspopup="true"
						ref={termsButtonRef}
						onClick={() => {
							toggleTermsMenu();
						}}
					>
						<span className="flex-1 text-left">
							{currentTerm.name !== "0" ? currentTerm.name : ""}
						</span>
						<svg
							className={
								(isTermsExpanded ? "rotate-180" : "") + " -mr-1 h-5 w-5"
							}
							viewBox="0 0 20 20"
							fill="currentColor"
							aria-hidden="true"
						>
							<path
								fillRule="evenodd"
								d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
								clipRule="evenodd"
							/>
						</svg>
					</button>
					<div
						className="bg-white dark:bg-slate-700 text-gray-700 dark:text-slate-200 tw-lbr-shadow-sm border-l px-2 border-r border-b border-gray-300 dark:border-slate-800 tw-term-accordion accordion absolute left-4 right-4 top-[4.5rem] z-20 origin-top-right rounded-b-md shadow-lg"
						aria-orientation="vertical"
						aria-labelledby="menu-button"
						aria-expanded={isTermsExpanded}
						ref={termsMenuRef}
					>
						<div className="h-px mt-px border-t border-gray-300 dark:border-slate-800"></div>
						<div className="py-2" role="none">
							{query.isSuccess &&
								query.data &&
								query.data.map((term: TermType) => {
									return (
										<button
											className="term-selector-dropdown-item"
											key={term.code}
											onClick={() => setAppTerm(term)}
											aria-current={term.code === currentTerm.code}
										>
											{term.name}
										</button>
									);
								})}
						</div>
					</div>
				</>
			) : (
				<></>
			)}
		</nav>
	);
}
