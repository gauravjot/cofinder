interface Props {
	fade?: boolean;
	size?: "default" | "small";
}

export default function Spinner({ fade = true, size = "default" }: Props) {
	return (
		<div
			className={
				(fade ? "" : "fade-in-100 ") +
				(size === "small" ? "lds-sm " : "") +
				"lds-ring"
			}
		>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
		</div>
	);
}
