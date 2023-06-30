import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { SectionsBrowserType } from "@/types/dbTypes";
import * as React from "react";
import List from "./List";
import ShowSelectedToggle from "./ShowSelectedToggle";

export interface ICourseBrowserContentProps {
	data: SectionsBrowserType[];
	isTrustedFilterActive: boolean;
	isKeywordFilterActive: boolean;
}

export default function CourseBrowserContent(props: ICourseBrowserContentProps) {
	const mySchedule = useAppSelector((state: RootState) => state.mySchedule);
	const fetchState = useAppSelector((state: RootState) => state.sections).fetched;
	const [showOnlySelected, setShowOnlySelected] = React.useState<boolean>(false);

	return (
		<div className="p-4 py-6 md:py-8 container mx-auto h-[calc(100vh-12rem)] sm:h-[calc(100vh-8rem)] lg:h-[calc(100vh-8rem)]">
			<div className="flex flex-wrap relative place-items-center mb-4">
				<div className="flex-1">
					<h3 className="font-medium text-xl font-serif dark:text-white">
						Course Browser
					</h3>
					<div className="flex gap-4 place-items-center my-1">
						<span className="text-sm text-gray-600 dark:text-slate-400">
							{fetchState > 0
								? "showing " + props.data?.length + " sections"
								: "loading sections..."}
						</span>
						{props.isTrustedFilterActive && (
							<span className="bg-orange-200 dark:bg-opacity-10 text-orange-800 dark:text-orange-300 px-2 py-1 rounded text-sm">
								Filters Selected
							</span>
						)}
						{props.isKeywordFilterActive && (
							<span className="bg-orange-200 dark:bg-opacity-10 text-orange-800 dark:text-orange-300 px-2 py-1 rounded text-sm">
								Keyword Applied
							</span>
						)}
					</div>
				</div>
				<div>
					{fetchState > 0 ? (
						<div className="flex place-items-center">
							<ShowSelectedToggle
								mySchedule={mySchedule}
								setShowOnlySelected={setShowOnlySelected}
								showOnlySelected={showOnlySelected}
							/>
						</div>
					) : (
						<></>
					)}
				</div>
			</div>
			<div className="w-full h-full overflow-y-hidden">
				<List
					mySchedule={mySchedule}
					listData={props.data}
					showOnlySelected={showOnlySelected}
					isTFA={props.isTrustedFilterActive}
					isKFA={props.isKeywordFilterActive}
				/>
			</div>
		</div>
	);
}
