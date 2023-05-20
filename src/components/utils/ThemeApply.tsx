export function themeApply() {
	let darkMode = localStorage.getItem("darkMode");
	if (darkMode === "enabled") {
		document.body.classList.add("dark");
	} else {
		document.body.classList.remove("dark");
	}
}
