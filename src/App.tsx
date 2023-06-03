import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
/* CSS */
import "./assets/css/common.css";
import "./assets/css/global.css";
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
} from "./redux/reducers";
/* Pages */
import Home from "./pages/home";
import About from "./pages/about";
import Courses from "./pages/courses";
import Calendar from "./pages/calendar";
import { sectionsReducer } from "./redux/reducers";
import { ROUTE } from "@/routes";

/*
 * LocalStorage and Redux
 */

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Save to LocalStorage in browser
function saveToLocalStorage(state: RootState) {
	try {
		const serializedState = JSON.stringify(state);
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
			if (data[key]["fetched"] && data[key]["fetched"] < 0) {
				data[key]["fetched"] = 0;
			}
		});
		return data;
	} catch (e) {
		console.log(e);
		return undefined;
	}
}

// Configure Redux store
const composeEnhancers =
	((window as any)["__REDUX_DEVTOOLS_EXTENSION_COMPOSE__"] as typeof compose) ||
	compose;
const persistedState = loadFromLocalStorage();
const store = configureStore({
	reducer: {
		detailedSchedule: detailedScheduleReducer,
		subjects: subjectsReducer,
		instructors: instructorsReducer,
		courses: coursesReducer,
		terms: termsReducer,
		currentTerm: currentTermReducer,
		mySchedule: myScheduleReducer,
		sections: sectionsReducer,
	},
	enhancers: composeEnhancers,
	preloadedState: persistedState,
});

// Subscribe to store changes
store.subscribe(() => saveToLocalStorage(store.getState()));

export default function App() {
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
				</Routes>
			</Router>
		</Provider>
	);
}
