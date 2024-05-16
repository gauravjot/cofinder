import * as React from "react";
import logo from "@/assets/images/branding.png";
import { useNavigate } from "react-router-dom";
import { ROUTE } from "@/routes";

const Search = React.lazy(() => import("@/features/Home/Topbar/Search"));

interface Props {
	title: string;
}

export default function Topbar(props: Props) {
	const navigate = useNavigate();
	return (
		<div className="border-b border-gray-300 dark:border-slate-800 h-16">
			<div className="text-gray-800 container mx-auto py-2.5 pt-[0.666rem]">
				<div className="hidden xl:flex items-center">
					<h5 className="flex-none px-4 font-semibold font-serif lg:min-w-[19rem] dark:text-white">
						{props.title}
					</h5>
					<div className="flex-1 text-center">
						<React.Suspense
							fallback={
								<div className="grid items-center justify-center h-full">
									...
								</div>
							}
						>
							<Search />
						</React.Suspense>
					</div>
					<div className="flex-none lg:min-w-[19rem] flex items-center justify-end">
						<button
							onClick={() => {
								navigate(ROUTE.CourseBrowser);
							}}
							className="tw-animate-to-right-parent bg-accent-600 hover:bg-accent-800 transition-colors duration-150 text-white px-5 py-2 mr-4 rounded-md shadow hover:shadow-lg"
						>
							<span className="font-medium">Find Courses</span>
							<span className="tw-animate-to-right material-icons align-top text-white text-base">
								arrow_forward
							</span>
						</button>
						{/* <button className="hover:bg-black hover:bg-opacity-10 rounded py-2 px-4 transition-colors duration-150">
							Import
						</button> */}
					</div>
				</div>
				<div className="flex xl:hidden">
					<h5 className="flex-1 pt-2 px-4 pl-16 md:pl-16 lg:pl-20 xl:pl-4 font-semibold font-serif">
						{props.title}
					</h5>
					<a
						href="/"
						className="block xl:mr-0 mr-4 flex-none hover:border-0 tw-hover-no-underline"
					>
						<div className="flex items-center ml-3 mt-1.5">
							<img
								src={logo}
								alt="UFV Sidebar Logo"
								className="w-8 md:w-9 xl:w-8"
							/>
						</div>
					</a>
				</div>
			</div>
		</div>
	);
}
