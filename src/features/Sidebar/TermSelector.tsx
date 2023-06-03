import * as React from "react";
import { RootState } from "@/App";
import { TermsReducerType, TermType } from "@/types/dbTypes";
import axios from "axios";
import { setTerms, setCurrentTerm } from "@/redux/actions";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { clearAllVariableStates } from "@/redux/actions";
import { EP_TERMS } from "@/server_eps";

export default function TermSelector() {
	const dispatch = useAppDispatch();
	const termsData: TermsReducerType = useAppSelector((state: RootState) => state.terms);
	const currentTerm: TermType = useAppSelector((state: RootState) => state.currentTerm);
	const [isFetching, setIsFetching] = React.useState<boolean>(false);
	const termsButtonRef = React.useRef<HTMLButtonElement>(null);
	const termsMenuRef = React.useRef<HTMLDivElement>(null);
	const [isTermsExpanded, setIsTermsExpanded] = React.useState<boolean>(false);

	React.useEffect(() => {
		let interrupt: boolean = false;
		if (
			!(
				termsData.terms &&
				termsData.terms.length > 0 &&
				new Date().getTime() - termsData.fetched < 60 * 60 * 1000
			)
		) {
			// fetch
			setIsFetching(true);
			console.log("eo", EP_TERMS);
			axios
				.get(EP_TERMS, {
					headers: {
						"Content-Type": "application/json",
					},
				})
				.then(function (response) {
					if (!interrupt) {
						dispatch(
							setTerms({
								terms: response.data.terms,
								fetched: new Date().getTime(),
							})
						);
						if (currentTerm && currentTerm.id === "0") {
							dispatch(
								setCurrentTerm({
									id: response.data.terms[0].id,
									name: response.data.terms[0].name,
									date: response.data.terms[0].date,
									term_ident: response.data.terms[0].term_ident || "",
								})
							);
							setIsFetching(false);
						}
					}
				})
				.catch(function (error) {
					console.log(error);
					setIsFetching(false);
				});
		}
		return () => {
			interrupt = true;
		};
	}, [termsData.fetched, termsData.terms, dispatch, currentTerm]);

	const setAppTerm = (term: TermType) => {
		if (currentTerm.id !== term.id) {
			clearAllVariableStates(dispatch);
			dispatch(setCurrentTerm(term));
			toggleTermsMenu();
			// reload browser window
			// window.location.replace(window.location.pathname);
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
			<div className="text-base pb-2 text-gray-600">Current Term</div>
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
					className={(isTermsExpanded ? "rotate-180" : "") + " -mr-1 h-5 w-5"}
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
			{currentTerm.name === "0" ? (
				<div className="pt-3">
					{isFetching && (
						<p className="dark:text-red-400 text-red-700 leading-5">
							Error fetching terms. Failed to reach server.
						</p>
					)}
					<button
						onClick={() =>
							dispatch(
								setCurrentTerm({
									id: "0",
									name: "0",
									date: 0,
									term_ident: "",
								})
							)
						}
						className="mt-2 bg-accent-600 hover:bg-accent-700 text-white font-medium rounded-md px-3 py-1.5 text-sm"
						disabled={isFetching}
					>
						{isFetching ? "Getting terms..." : "Try again"}
					</button>
				</div>
			) : (
				<></>
			)}
			<div
				className="bg-white dark:bg-slate-700 text-gray-700 dark:text-slate-200 tw-lbr-shadow-sm border-l px-2 border-r border-b border-gray-300 dark:border-slate-800 tw-term-accordion accordion absolute left-4 right-4 top-[4.5rem] z-20 origin-top-right rounded-b-md shadow-lg"
				aria-orientation="vertical"
				aria-labelledby="menu-button"
				aria-expanded={isTermsExpanded}
				ref={termsMenuRef}
			>
				<div className="h-px border-t border-gray-300 dark:border-slate-800 mt-px"></div>
				<div className="py-2" role="none">
					{termsData.terms.map((term) => {
						return (
							<button
								className="term-selector-dropdown-item"
								key={term.id}
								onClick={() => setAppTerm(term)}
								aria-current={term.id === currentTerm.id}
							>
								{term.name}
							</button>
						);
					})}
				</div>
			</div>
		</nav>
	);
}
