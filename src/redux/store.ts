import { compose, configureStore } from "@reduxjs/toolkit";
import sectionsReducer from "@/redux/sections/sectionSlice";
import coursesReducer from "@/redux/courses/courseSlice";
import termsReducer from "@/redux/terms/termSlice";
import currentTermReducer from "@/redux/terms/currentTermSlice";
import instructorsReducer from "@/redux/instructor/instructorSlice";
import subjectsReducer from "@/redux/subjects/subjectSlice";
import termScheduleReducer from "@/redux/schedules/termScheduleSlice";
import schedulesReducer from "@/redux/schedules/scheduleSlice";
import userReducer from "@/redux/users/userSlice";

export type RootState = ReturnType<typeof reduxStore.getState>;
export type AppDispatch = typeof reduxStore.dispatch;

const composeEnhancers =
	((window as any)["__REDUX_DEVTOOLS_EXTENSION_COMPOSE__"] as typeof compose) ||
	compose;

export const reduxStore = configureStore({
	enhancers: composeEnhancers,
	preloadedState: { ...loadFromLocalStorage() },
	reducer: {
		courses: coursesReducer,
		currentTerm: currentTermReducer,
		instructors: instructorsReducer,
		mySchedule: schedulesReducer,
		sections: sectionsReducer,
		subjects: subjectsReducer,
		terms: termsReducer,
		termSchedule: termScheduleReducer,
		user: userReducer,
	},
});

reduxStore.subscribe(() => {
	saveToLocalStorage(reduxStore.getState());
});

// Save to LocalStorage in browser
function saveToLocalStorage(state: ReturnType<typeof reduxStore.getState>) {
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
