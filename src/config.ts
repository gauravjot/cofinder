export const APP_NAME = "CoFinder";
export const VERSION_CODE: string = "1.1.1";
export const VERSION_DATE: string = "May 13, 2024";
export const VERSION_RELEASE_PAGE =
	"https://github.com/gauravjot/cofinder-frontend/pull/18";

// School
export const SCHOOL_FULL_NAME: string = "University of the Fraser Valley";
export const SCHOOL_SHORT_NAME: string = "UFV";
export const SCHOOL_WEBSITE: string = "https://ufv.ca";

// URLs
export const REPO_URL = "https://github.com/gauravjot/cofinder-frontend";
export const GITHUB_URL: string = "https://github.com/gauravjot/cofinder-frontend";
export const NEWS_URL: string = "https://blogs.ufv.ca/urgent-news/";
export const RSS_NEWS_URL: string =
	"https://corsproxy.io/?https://blogs.ufv.ca/urgent-news/feed/";
export const FEEDBACK_URL: string = "https://forms.office.com/r/6agnYan48K";

export const API_FAIL_RETRY_TIMER = 5000;
// Refresh Component Data at set interval
export const FETCH_TIME_GAP: number = 60 * 60 * 1000;

export const BACKEND_URL: string = import.meta.env.VITE_BACKEND_URL || "";
