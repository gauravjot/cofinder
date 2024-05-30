import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { SectionsBrowserType } from "@/types/dbTypes";
import * as React from "react";

export default function ShowSelectedToggle({
	mySchedule,
	showOnlySelectedToggle,
}: {
	mySchedule: SectionsBrowserType[];
	showOnlySelectedToggle: (active: boolean) => boolean;
}) {
	const currentTerm = useAppSelector((state: RootState) => state.currentTerm);
	const [toggleActive, setToggleActive] = React.useState(false);

	return (
		<button
			className={
				(toggleActive
					? "bg-laccent-800 hover:bg-laccent-900 text-white "
					: "bg-gray-900/5 dark:bg-white/5 hover:bg-black/10 hover:dark:bg-gray-400/20 ") +
				"disabled:opacity-50 flex place-items-center py-2 px-2 sm:px-5 rounded-full"
			}
			disabled={
				mySchedule.filter((sch) => {
					return sch.term === currentTerm.code;
				}).length < 1
			}
			onClick={() => {
				const active = showOnlySelectedToggle(!toggleActive);
				setToggleActive(active);
			}}
		>
			{toggleActive ? (
				<span className="ic invert ic-check-box-ticked"></span>
			) : (
				<span className="ic dark:invert ic-check-box-empty"></span>
			)}
			<span className="pt-px pl-1.5 md:pl-2.5 xl:text-base text-sm">
				Show My Schedule
			</span>
		</button>
	);
}
