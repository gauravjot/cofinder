import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
/* CSS */
import "@/assets/css/common.css";
import "@/assets/css/icons.css";
import "@/assets/css/global.css";
/* Redux */
import { Provider } from "react-redux";
import { reduxStore } from "./redux/store";
/* Pages */
import { ROUTE } from "@/routes";
import Home from "@/pages/home";
import About from "@/pages/about";
import Courses from "@/pages/courses";
import Calendar from "@/pages/calendar";
import StartAuthPage from "./pages/auth/discord";
import { createContext, useEffect, useState } from "react";
import { UserType } from "./types/userTypes";
import { useQuery } from "react-query";
import { getUserInfo } from "./services/user/get_user_info";

export const UserContext = createContext({
	data: null,
	setData: () => {
		return null;
	},
	isLoading: false,
} as {
	data: UserType | null;
	setData: React.Dispatch<React.SetStateAction<UserType | null>>;
	isLoading: boolean;
});

export default function App() {
	const [user, setUser] = useState<UserType | null>(null);

	const user_query = useQuery("user", async () => await getUserInfo(), {
		refetchOnWindowFocus: false,
		enabled: false,
		retry: false,
		onSuccess: (data) => {
			setUser(data);
		},
	});

	useEffect(() => {
		if (!user) {
			user_query.refetch();
		}
	}, []);

	return (
		<Provider store={reduxStore}>
			<UserContext.Provider
				value={{
					data: user,
					setData: setUser,
					isLoading: user_query.isLoading,
				}}
			>
				<Router>
					<Routes>
						<Route path={ROUTE.Home} element={<Home />} />
						<Route path={ROUTE.About} element={<About />} />
						<Route path={ROUTE.Calendar} element={<Calendar />} />
						<Route path={ROUTE.CourseBrowser} element={<Courses />} />
						<Route
							path={ROUTE.CourseBrowserSubjectFilter()}
							element={<Courses />}
						/>
						<Route
							path={ROUTE.CourseBrowserKeywordFilter()}
							element={<Courses />}
						/>
						<Route
							path={ROUTE.DiscordAuthHandling}
							element={<StartAuthPage />}
						/>
					</Routes>
				</Router>
			</UserContext.Provider>
		</Provider>
	);
}
