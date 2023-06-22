import useTheme from "@/utils/useTheme";

export default function ThemeToggle() {
	const theme = useTheme();
	return (
		<div className="darkmode-toggle" onClick={theme.toggle}>
			<button>
				<span className="material-icons dm-moon-icon">dark_mode</span>
				<span className="material-icons dm-sun-icon">light_mode</span>
			</button>
		</div>
	);
}
