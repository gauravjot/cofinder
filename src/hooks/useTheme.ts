/*
 * Switch between light and dark theme
 * - Supports TailwindCSS
 * - Adds 'dark' class to <body>
 */
import useLocalStorage from "@/hooks/useLocalStorage";

export default function useTheme(autoapply = true): {
	isDarkMode: boolean;
	isLightMode: boolean;
	isSystemMode: boolean;
	dark: () => void;
	light: () => void;
	system: () => void;
	toggle: () => void;
} {
	const [theme, setTheme] = useLocalStorage("nzran-theme", "system");

	// DOM inserts
	function changeToDark() {
		document.body.classList.add("dark");
	}
	function changeToLight() {
		document.body.classList.remove("dark");
	}

	// Set default color accoriding to browser's theme
	if (autoapply) {
		if (
			window.matchMedia &&
			window.matchMedia("(prefers-color-scheme: dark)").matches
		) {
			if (theme === "dark" || theme === "system") {
				changeToDark();
			} else if (theme === "light") {
				changeToLight();
			}
		} else {
			if (theme === "light" || theme === "system") {
				changeToLight();
			} else if (theme === "dark") {
				changeToDark();
			}
		}

		// Detect browser's theme change
		window
			.matchMedia("(prefers-color-scheme: dark)")
			.addEventListener("change", (event) => {
				if (theme === null) {
					if (event.matches) {
						changeToDark();
					} else {
						changeToLight();
					}
				}
			});
	}

	return {
		isDarkMode: theme === "dark",
		isSystemMode: theme === "system",
		isLightMode: theme === "light",
		dark: () => {
			changeToDark();
			setTheme("dark");
		},
		light: () => {
			changeToLight();
			setTheme("light");
		},
		system: () => {
			if (
				window.matchMedia &&
				window.matchMedia("(prefers-color-scheme: dark)").matches
			) {
				changeToDark();
			} else {
				changeToLight();
			}
			setTheme("system");
		},
		toggle: () => {
			if (theme === "light") {
				// if it is light, switch to dark
				setTheme("dark");
				changeToDark();
			} else if (theme === "dark") {
				// if it is dark, switch to light
				setTheme("light");
				changeToLight();
			} else if (theme === "system") {
				// if it is system, we need to know what theme system has
				if (
					window.matchMedia &&
					window.matchMedia("(prefers-color-scheme: dark)").matches
				) {
					// system has dark theme
					setTheme("light");
					changeToLight();
				} else {
					// system has light theme
					setTheme("dark");
					changeToDark();
				}
			}
		},
	};
}
