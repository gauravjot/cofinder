import { useAppDispatch } from "@/redux/hooks";
import { clear as clearSchedule } from "@/redux/schedules/scheduleSlice";
import { clear as clearTermSchedule } from "@/redux/schedules/termScheduleSlice";
import { useContext } from "react";
import { UserContext } from "@/App";
import { useMutation } from "react-query";
import { logoutUser } from "@/services/user/logout";
import { AxiosError } from "axios";

export default function TopbarUserDrop() {
	const dispatch = useAppDispatch();

	const user = useContext(UserContext);
	const logoutMutation = useMutation({
		mutationFn: () => logoutUser(),
		onSuccess: () => {
			dispatch(clearSchedule());
			dispatch(clearTermSchedule());
			user.setData(null);
		},
		onError: (error: AxiosError) => {
			alert("Unable to logout. Please try again later.\n" + error.message);
		},
		retry: false,
	});

	return (
		<div className="dark:text-gray-100 shadow dark:shadow-slate-700/30 flex place-items-center rounded-md border dark:border-slate-700">
			<div className="flex-1 flex place-items-center">
				<svg
					className="ml-3 h-5 w-5 mt-px"
					fill="rgb(114, 137, 218)"
					xmlns="http://www.w3.org/2000/svg"
					fillRule="evenodd"
					clipRule="evenodd"
					viewBox="0 0 24 24"
				>
					<path d="M19.54 0c1.356 0 2.46 1.104 2.46 2.472v21.528l-2.58-2.28-1.452-1.344-1.536-1.428.636 2.22h-13.608c-1.356 0-2.46-1.104-2.46-2.472v-16.224c0-1.368 1.104-2.472 2.46-2.472h16.08zm-4.632 15.672c2.652-.084 3.672-1.824 3.672-1.824 0-3.864-1.728-6.996-1.728-6.996-1.728-1.296-3.372-1.26-3.372-1.26l-.168.192c2.04.624 2.988 1.524 2.988 1.524-1.248-.684-2.472-1.02-3.612-1.152-.864-.096-1.692-.072-2.424.024l-.204.024c-.42.036-1.44.192-2.724.756-.444.204-.708.348-.708.348s.996-.948 3.156-1.572l-.12-.144s-1.644-.036-3.372 1.26c0 0-1.728 3.132-1.728 6.996 0 0 1.008 1.74 3.66 1.824 0 0 .444-.54.804-.996-1.524-.456-2.1-1.416-2.1-1.416l.336.204.048.036.047.027.014.006.047.027c.3.168.6.3.876.408.492.192 1.08.384 1.764.516.9.168 1.956.228 3.108.012.564-.096 1.14-.264 1.74-.516.42-.156.888-.384 1.38-.708 0 0-.6.984-2.172 1.428.36.456.792.972.792.972zm-5.58-5.604c-.684 0-1.224.6-1.224 1.332 0 .732.552 1.332 1.224 1.332.684 0 1.224-.6 1.224-1.332.012-.732-.54-1.332-1.224-1.332zm4.38 0c-.684 0-1.224.6-1.224 1.332 0 .732.552 1.332 1.224 1.332.684 0 1.224-.6 1.224-1.332 0-.732-.54-1.332-1.224-1.332z" />
				</svg>
				<div className="font-medium pl-2.5 pr-4 text-sm">
					{user?.data?.user.name}
				</div>
			</div>
			<button
				onClick={() => {
					logoutMutation.mutate();
				}}
				title="Logout"
				aria-label="Logout"
				className="hover:bg-slate-400/20 px-4 py-1.5 pb-[7px] rounded-tr-md rounded-br-md border-l dark:border-l-slate-700"
			>
				<span className="tw-animate-to-90 material-icons align-middle text-black dark:text-white text-base">
					logout
				</span>
			</button>
		</div>
	);
}
