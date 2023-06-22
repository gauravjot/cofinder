import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
/* CSS */
import "@/assets/css/common.css";
import "@/assets/css/global.css";
/* Redux */
import { compose } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import {
	subjectsReducer,
	instructorsReducer,
	termsReducer,
	coursesReducer,
	currentTermReducer,
	myScheduleReducer,
	detailedScheduleReducer,
} from "@/redux/reducers";
/* Cookies */
import { useCookies } from "react-cookie";
/* Pages */
import Home from "@/pages/home";
import About from "@/pages/about";
import Courses from "@/pages/courses";
import Calendar from "@/pages/calendar";
import { sectionsReducer } from "@/redux/reducers";
import { ROUTE } from "@/routes";
import StartSessionPage from "@/pages/auth/sut/session";
import { userReducer } from "@/redux/user_reducers";
import { cloneDeep } from "lodash";

/*
 * LocalStorage and Redux
 */
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof _store.getState>;
export type AppDispatch = typeof _store.dispatch;
// this store is only used for typing
const reducer_list = {
	detailedSchedule: detailedScheduleReducer,
	subjects: subjectsReducer,
	instructors: instructorsReducer,
	courses: coursesReducer,
	terms: termsReducer,
	currentTerm: currentTermReducer,
	mySchedule: myScheduleReducer,
	sections: sectionsReducer,
	user: userReducer,
};
const _store = configureStore({
	reducer: reducer_list,
});
// Redux browser extension support
const composeEnhancers =
	((window as any)["__REDUX_DEVTOOLS_EXTENSION_COMPOSE__"] as typeof compose) ||
	compose;

export default function App() {
	// Using cookies to for user session
	const [cookies, setCookie] = useCookies(["user"]);

	// Save to LocalStorage in browser
	function saveToLocalStorage(state: RootState) {
		try {
			let data = cloneDeep(state);
			data.user = null;
			const serializedState = JSON.stringify(data);
			localStorage.setItem("state", serializedState);
		} catch (e) {
			console.log(e);
		}
	}

	// Load from LocalStorage in browser
	function loadFromLocalStorage() {
		try {
			const serializedState = localStorage.getItem("state");
			if (serializedState === null) return undefined;
			let data = JSON.parse(serializedState);
			Object.keys(data).forEach(function (key) {
				/*
          This is for cleanup in case a request was interrupted while
          fetching prveiously. This can be because user lost internet,
          lost power, decided to close tab or computer decided to died
          in middle of request. We will clear error codes.
        */
				if (key !== "user") {
					if (data[key]["fetched"] && data[key]["fetched"] < 0) {
						data[key]["fetched"] = 0;
					}
				}
			});
			return data;
		} catch (e) {
			console.log(e);
			return undefined;
		}
	}

	// Save cookies
	function saveToCookies(state: RootState) {
		try {
			const serializedState = JSON.parse(JSON.stringify(state));
			setCookie(
				"user",
				encodeURIComponent(JSON.stringify(serializedState["user"])),
				{
					path: "/",
					expires: new Date(
						new Date().setFullYear(new Date().getFullYear() + 1)
					),
					sameSite: "lax",
				}
			);
		} catch (e) {}
	}

	// Read cookies
	function loadFromCookies() {
		try {
			const serializedState = cookies.user;
			if (serializedState === null) return null;
			return JSON.parse(decodeURIComponent(serializedState));
		} catch (e) {
			return null;
		}
	}

	const persistedState = { ...loadFromLocalStorage(), user: loadFromCookies() };
	const store = configureStore({
		reducer: reducer_list,
		enhancers: composeEnhancers,
		preloadedState: persistedState,
	});
	// Subscribe to store changes
	store.subscribe(() => {
		saveToCookies(store.getState());
		saveToLocalStorage(store.getState());
	});

	return (
		<Provider store={store}>
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
