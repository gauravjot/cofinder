import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { MyScheduleTypeItem } from "@/types/stateTypes";
import * as React from "react";

export default function ShowSelectedToggle({
	mySchedule,
	setShowOnlySelected,
	showOnlySelected,
}: {
	mySchedule: MyScheduleTypeItem[];
	setShowOnlySelected: React.Dispatch<React.SetStateAction<boolean>>;
	showOnlySelected: boolean;
}) {
	const currentTerm = useAppSelector((state: RootState) => state.currentTerm);

	React.useEffect(() => {
		setShowOnlySelected(false);
	}, [currentTerm]);

	React.useEffect(() => {
		// If show selected is enabled but schedule is empty, disable it.
		if (mySchedule.length === 0) {
			setShowOnlySelected(false);
		}
	}, [mySchedule]);

	return (
		<button
			className={
				(showOnlySelected
					? "bg-laccent-800 hover:bg-laccent-900 text-white "
					: "bg-gray-900/5 dark:bg-white/5 hover:bg-black/10 hover:dark:bg-gray-400/20 ") +
				"disabled:opacity-50 flex place-items-center py-2 px-3 sm:px-5 rounded-full"
			}
			disabled={
				mySchedule.filter((sch) => {
					return sch.term === currentTerm.id;
				}).length < 1
			}
			onClick={() => {
				setShowOnlySelected(!showOnlySelected);
			}}
		>
			{showOnlySelected ? (
				<span className="ic invert ic-check-box-ticked"></span>
			) : (
				<span className="ic dark:invert ic-check-box-empty"></span>
			)}
			<span className="pt-px pl-2.5">Show Selected</span>
		</button>
	);
}
