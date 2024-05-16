import { useEffect, useState } from "react";

export const useMediaQuery = (query: string) => {
	const mediaMatch = window.matchMedia(query);
	const [matches, setMatches] = useState(mediaMatch.matches);

	useEffect(() => {
		const handler = (e: any) => setMatches(e.matches);
		mediaMatch.addListener(handler);
		return () => mediaMatch.removeListener(handler);
	});
	return matches;
};

export const useSmMediaQuery = () => useMediaQuery("(max-width: 639px)");
export const useMdMediaQuery = () => useMediaQuery("(max-width: 767px)");
export const useLgMediaQuery = () => useMediaQuery("(max-width: 1023px)");
