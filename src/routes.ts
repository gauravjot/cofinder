export const ROUTE = {
	Home: "/",
	About: "/about",
	CourseBrowser: "/browser/courses",
	CourseBrowserSubjectFilter: (subject?: string): string => {
		return subject ? "/browser/courses/" + subject : "/browser/courses/:subject";
	},
	CourseBrowserKeywordFilter: (keyword?: string): string => {
		return keyword
			? "/browser/courses/search/" + encodeURI(keyword)
			: "/browser/courses/search/:keyword";
	},
	Calendar: "/calendar",
	DiscordAuthHandling: "/auth/sut/:token",
};
