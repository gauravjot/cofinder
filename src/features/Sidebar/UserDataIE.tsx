import * as React from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { TermType } from "@/types/dbTypes";
import { MyScheduleTypeItem } from "@/types/stateTypes";
import { selectAllSchedules } from "@/redux/schedules/scheduleSlice";
import { selectCurrentTerm } from "@/redux/terms/currentTermSlice";
import { set as setMySchedule } from "@/redux/schedules/scheduleSlice";
import { set as setCurrentTerm } from "@/redux/terms/currentTermSlice";

export default function UserDataIE() {
	const dispatch = useAppDispatch();
	const mySchedule = useAppSelector(selectAllSchedules);
	const currentTerm = useAppSelector(selectCurrentTerm);
	const [importPrompt, setImportPrompt] = React.useState<boolean>(false);
	const [importData, setImportData] = React.useState<ImportFormat>();
	let importFileRef = React.useRef<HTMLInputElement>(null);

	interface ImportFormat {
		schedule: MyScheduleTypeItem[];
		currentTerm: TermType;
	}

	const openFile = function (event: React.ChangeEvent<HTMLInputElement>) {
		let input = event.target;

		let reader = new FileReader();
		reader.onload = function () {
			if (reader.result) {
				try {
					let f: ImportFormat = JSON.parse(reader.result.toString());
					setImportData(f);
				} catch (err) {}
				setImportPrompt(true);
			}
		};
		if (input.files) {
			reader.readAsText(input.files[0]);
		}
	};

	const exportToFile = () => {
		const blob = new Blob(
			[
				JSON.stringify({
					schedule: mySchedule,
					currentTerm: currentTerm,
				}),
			],
			{
				type: "text/json",
			}
		);
		const link = document.createElement("a");

		console.log(new Date().toLocaleString().toString());
		link.download = "cofinder-export-" + new Date().toLocaleDateString() + ".json";
		link.href = window.URL.createObjectURL(blob);
		link.dataset.downloadurl = ["text/json", link.download, link.href].join(":");

		const evt = new MouseEvent("click", {
			view: window,
			bubbles: true,
			cancelable: true,
		});

		link.dispatchEvent(evt);
		link.remove();
	};

	return (
		<>
			<button
				aria-current="false"
				className="tw-sidebar-nav-btn"
				onClick={() => {
					exportToFile();
				}}
			>
				<span className="material-icons">ios_share</span>
				<span>Export Data</span>
			</button>
			<button
				aria-current="false"
				className="tw-sidebar-nav-btn"
				onClick={() => {
					importFileRef?.current?.click();
				}}
			>
				<span className="material-icons">system_update_alt</span>
				<span>Import from File</span>
			</button>
			<input
				type="file"
				accept="text/json"
				className="hidden"
				ref={importFileRef}
				onChange={(event) => {
					openFile(event);
				}}
			/>

			<div
				className="tw-screen-prompt inset-0 z-20 flex place-items-center place-content-center"
				aria-selected={importPrompt ? "true" : "false"}
			>
				{importData?.schedule && importData.schedule.length > 0 ? (
					<div className="max-w-[30rem] w-[80%] bg-white dark:bg-slate-700 rounded shadow-xl lg:right-[calc(50%-15rem)] p-4 -mt-20">
						<h3 className="text-black dark:text-white font-medium mb-3">
							<span className="material-icons text-2xl mr-2 align-middle">
								help_outline
							</span>
							<span className="align-middle tracking-[-0.025rem]">
								Confirm changes
							</span>
						</h3>
						<p className="leading-6 my-3 text-gray-500 dark:text-slate-200">
							If you import this file, your current saved courses will be
							overridden.
							<div className="py-1"></div>
							Are you sure you want to do this?
						</p>
						<div className="text-right mt-6">
							<button
								onClick={() => {
									setImportPrompt(false);
								}}
								className="px-4 py-1.5 bg-gray-200 dark:bg-slate-800 font-medium rounded-md mr-4 hover:bg-gray-300 dark:hover:bg-slate-900 transition-colors"
							>
								Cancel
							</button>
							<button
								onClick={() => {
									dispatch(setMySchedule(importData.schedule));
									dispatch(setCurrentTerm(importData.currentTerm));
									setImportPrompt(false);
								}}
								className="px-4 py-1.5 bg-laccent-800 text-white font-medium rounded-md shadow hover:bg-laccent-700 transition-colors"
							>
								Continue
							</button>
						</div>
					</div>
				) : (
					<div className="rounded shadow-lg border-red-300 m-4 top-16 right-12 fixed bg-red-200 dark:bg-red-700 text-red-800 dark:text-red-200">
						<div className="flex">
							<div className="flex-none">
								<button
									className="rounded-l w-14 h-16 hover:bg-red-300 dark:hover:bg-red-900"
									onClick={() => {
										setImportPrompt(false);
									}}
								>
									<span className="material-icons text-black dark:text-white text-lg">
										close
									</span>
								</button>
							</div>
							<div className="flex-1 ml-3 pt-1.5 mr-8">
								<h5 className="font-medium">Failed to import</h5>
								<p className="text-sm">
									Import file is possibly corrupted.
								</p>
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	);
}
