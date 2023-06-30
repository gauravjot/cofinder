export const sectionsEP = (term: string, encodedCRNs: string | null = null): string => {
	if (encodedCRNs) {
		return (
			import.meta.env.VITE_SPECIFIC_SECTION_EP?.replace(
				import.meta.env.VITE_INSERTION_IDENTIFIER || "{}",
				term
			)?.replace(import.meta.env.VITE_INSERTION_IDENTIFIER || "{}", encodedCRNs) ||
			""
		);
	}
	return (
		import.meta.env.VITE_SECTION_EP?.replace(
			import.meta.env.VITE_INSERTION_IDENTIFIER || "{}",
			term
		) || ""
	);
};

export const EP_TERMS: string = import.meta.env.VITE_TERM_EP || "";

export const subjectsEP = (term: string) => {
	return (
		import.meta.env.VITE_SUBJECTS_EP?.replace(
			import.meta.env.VITE_INSERTION_IDENTIFIER || "{}",
			term
		) || ""
	);
};

export const coursesEP = (term: string) => {
	return (
		import.meta.env.VITE_COURSES_EP?.replace(
			import.meta.env.VITE_INSERTION_IDENTIFIER || "{}",
			term
		) || ""
	);
};

export const instructorsEP = (term: string) => {
	return (
		import.meta.env.VITE_INSTRUCTORS_EP?.replace(
			import.meta.env.VITE_INSERTION_IDENTIFIER || "{}",
			term
		) || ""
	);
};

export const seatsEP = (term_name: string | number, crn: string | number) => {
	return (
		import.meta.env.VITE_SEATS_EP?.replace(
			import.meta.env.VITE_INSERTION_IDENTIFIER || "{}",
			term_name.toString()
		)?.replace(import.meta.env.VITE_INSERTION_IDENTIFIER || "{}", crn.toString()) ||
		""
	);
};

export const startSessionEP = (sut: string): string => {
	return (
		import.meta.env.VITE_START_AUTH_SESSION.replace(
			import.meta.env.VITE_INSERTION_IDENTIFIER || "{}",
			sut
		) || ""
	);
};
