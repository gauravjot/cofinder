interface Props {
	fade?: boolean;
}

export default function Spinner({ fade = true }: Props) {
	return (
		<div className={(fade ? "" : "fade-in-100") + " lds-ring"}>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
		</div>
	);
}
