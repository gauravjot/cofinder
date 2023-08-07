import { useAppSelector } from "@/redux/hooks";
import DiscordLogin from "@/features/User/LoginButton/DiscordLogin";
import TopbarUserDrop from "@/features/User/TopbarUserDrop/TopbarUserDrop";
import { selectUser } from "@/redux/users/userSlice";

export function User() {
	const user = useAppSelector(selectUser);

	return user ? (
		<div className="flex flex-col px-4 w-full">
			<div className="flex-1 font-medium pb-2 text-gray-600 dark:text-slate-400">
				Welcome
			</div>
			<TopbarUserDrop user={user} />
		</div>
	) : (
		<div className="w-full px-4 flex flex-col">
			<div className="flex-1 text-base font-medium pb-1 text-gray-800 dark:text-slate-200">
				Join CoFinder
			</div>
			<p className="text-[0.925rem] mb-3 text-gray-600 dark:text-slate-400">
				Save you course selections in cloud.
			</p>
			<DiscordLogin />
		</div>
	);
}
