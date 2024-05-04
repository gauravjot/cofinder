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

export const authWithDiscordEP = (): string => {
	return import.meta.env.VITE_AUTH_DISCORD;
};

export const userLogoutEP = (): string => {
	return import.meta.env.VITE_USER_LOGOUT;
};

export const saveScheduleEP = (term_id: string): string => {
	return (
		import.meta.env.VITE_SAVE_SCHEDULE.replace(
			import.meta.env.VITE_INSERTION_IDENTIFIER || "{}",
			term_id
		) || ""
	);
};

export const EP_USER_INFO: string = import.meta.env.VITE_USER_INFO || "";

export const EP_SAVE_BULK_SCHEDULE: string =
	import.meta.env.VITE_SAVE_BULK_SCHEDULE || "";
