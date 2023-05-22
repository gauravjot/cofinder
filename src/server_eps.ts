// UFV API Endpoints
// export const sectionsEP = (term: string, encodedCRNs: string | null = null): string => {
// 	if (encodedCRNs) {
// 		return `https://cf-api.cofinder.ca/sections?term=${term}&crns=${encodedCRNs}`;
// 	}
// 	return `https://cf-api.cofinder.ca/sections?term=${term}`;
// };
// export const EP_TERMS = "https://cf-api.cofinder.ca/terms";
// export const subjectsEP = (term: string) => {
// 	return `https://cf-api.cofinder.ca/subjects?term=${term}`;
// };
// export const coursesEP = (term: string) => {
// 	return `https://cf-api.cofinder.ca/courses?term=${term}`;
// };
// export const instructorsEP = (term: string) => {
// 	return `https://cf-api.cofinder.ca/instructors?term=${term}`;
// };
// export const seatsEP = (term_name: string | number, crn: string | number) => {
// 	return `https://cf-api.cofinder.ca/seats?term_name=${term_name}&crn=${crn}`;
// };

/* DEV */
export const sectionsEP = (term: string, encodedCRNs: string | null = null): string => {
	if (encodedCRNs) {
		return `http://localhost:8000/api/${term}/sections/${encodedCRNs}/`;
	}
	return `http://localhost:8000/api/${term}/sections/`;
};
export const EP_TERMS = "http://localhost:8000/api/terms/";
export const subjectsEP = (term: string) => {
	return `http://localhost:8000/api/${term}/subjects/`;
};
export const coursesEP = (term: string) => {
	return `http://localhost:8000/api/${term}/courses/`;
};
export const instructorsEP = (term: string) => {
	return `http://localhost:8000/api/${term}/instructors/`;
};
export const seatsEP = (term_name: string | number, crn: string | number) => {
	return `http://localhost:8000/api/section/seats/${term_name}/${crn}/`;
};
