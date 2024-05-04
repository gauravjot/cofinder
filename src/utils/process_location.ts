export function abbreviateLocation(location: string) {
	location = location.replace("Abbotsford Bldg ", "AB");
	location = location.replace("Canada Education Park Bldg", "CH");
	location = location.replaceAll(". ", "");

	return location;
}
