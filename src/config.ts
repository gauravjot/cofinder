export const APP_NAME = "CoFinder";
export const VERSION_CODE: string = "0.1.2";

// Refresh Component Data at set interval
export const FETCH_TIME_GAP: number = 60 * 60 * 1000;

// School
export const SCHOOL_FULL_NAME: string = "University of the Fraser Valley";
export const SCHOOL_SHORT_NAME: string = "UFV";
export const SCHOOL_WEBSITE: string = "https://ufv.ca";

// URLs
export const REPO_URL = "https://cisgitlab.ufv.ca/300186344/UniversityFuture";
export const GITHUB_URL: string = "https://github.com/gauravjot/cofinder-frontend";
export const NEWS_URL: string = "https://blogs.ufv.ca/urgent-news/";
export const RSS_NEWS_URL: string =
	"https://corsproxy.io/?https://blogs.ufv.ca/urgent-news/feed/";
export const FEEDBACK_URL: string = "https://forms.office.com/r/6agnYan48K";

// UFV API Endpoints
export const sectionsEP = (term: string, encodedCRNs: string | null = null): string => {
	if (encodedCRNs) {
		return `https://uag.cofinder.ca/api/v1/sections?term=${term}&crns=${encodedCRNs}`;
	}
	return `https://uag.cofinder.ca/api/v1/sections?term=${term}`;
};
export const EP_TERMS = "https://uag.cofinder.ca/api/v1/terms";
export const subjectsEP = (term: string) => {
	return `https://uag.cofinder.ca/api/v1/subjects?term=${term}`;
};
export const coursesEP = (term: string) => {
	return `https://uag.cofinder.ca/api/v1/courses?term=${term}`;
};
export const instructorsEP = (term: string) => {
	return `https://uag.cofinder.ca/api/v1/instructors?term=${term}`;
};
export const seatsEP = (term_name: string | number, crn: string | number) => {
	return `https://uag.cofinder.ca/api/v1/seats?term_name=${term_name}&crn=${crn}`;
};
