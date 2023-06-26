import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
/* CSS */
import "@/assets/css/common.css";
import "@/assets/css/icons.css";
import "@/assets/css/global.css";
/* Redux */
import { Provider } from "react-redux";
import { reduxStore } from "./redux/store";
/* Cookies */
/* Pages */
import { ROUTE } from "@/routes";
import Home from "@/pages/home";
import About from "@/pages/about";
import Courses from "@/pages/courses";
import Calendar from "@/pages/calendar";
import StartSessionPage from "@/pages/auth/sut/session";

export default function App() {
	return (
		<Provider store={reduxStore}>
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
						element={<StartSessionPage />}
					/>
				</Routes>
			</Router>
		</Provider>
	);
}
