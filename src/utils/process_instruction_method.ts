export function friendlyInstructionMethod(method_acronym: string) {
	switch (method_acronym) {
		case "HYB":
			return "Hybrid";
		case "TRD":
			return "In-person";
		case "HYX":
			return "Flexible";
		case "OLM":
			return "Online + Meetings";
		case "OLO":
			return "Online Only";
		default:
			return method_acronym;
	}
}
