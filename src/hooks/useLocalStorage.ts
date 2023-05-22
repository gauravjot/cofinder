/*
 * Usage: const [theme, setTheme] = useLocalStorage("theme", "light");
 */

import { useEffect, useState } from "react";

export default function useLocalStorage(key: string, initialValue: string) {
	// State to store our value
	// Pass initial state function to useState so logic is only executed once
	const [storedValue, setStoredValue] = useState(() => initialValue);

	const initialize = () => {
		try {
			// Get from local storage by key
			const item = window.localStorage.getItem(key);
			// Parse stored json or if none return initialValue
			return item ? item : initialValue;
		} catch (error) {
			// If error also return initialValue
			console.log(error);
			return initialValue;
		}
	};

	/* prevents hydration error so that state is only initialized after server is defined */
	useEffect(() => {
		setStoredValue(initialize());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Return a wrapped version of useState's setter function that ...
	// ... persists the new value to localStorage.
	const setValue = (value: string | ((val: string) => string)) => {
		try {
			// Allow value to be a function so we have same API as useState
			const valueToStore = value instanceof Function ? value(storedValue) : value;
			// Save state
			setStoredValue(valueToStore);
			// Save to local storage
			if (typeof window !== "undefined") {
				window.localStorage.setItem(key, valueToStore);
			}
		} catch (error) {
			// A more advanced implementation would handle the error case
			console.log("useLocalStorage()", error);
		}
	};
	return [storedValue, setValue] as const;
}
