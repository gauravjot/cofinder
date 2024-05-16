export function themeApply() {
	let darkMode = localStorage.getItem("nzran-theme");
	if (darkMode === "dark") {
		document.body.classList.add("dark");
	} else {
		document.body.classList.remove("dark");
	}
}
