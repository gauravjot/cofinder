export const months = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
];

export function refactorTime(time: string) {
	let hours24 = time.split(":")[0]
	let hours = ((parseInt(hours24) + 11) % 12) + 1;
	let amPm = parseInt(hours24) > 11 ? "pm" : "am";
	let minutes = time.split(":")[1];

	return hours + ":" + minutes + amPm;
}

export function refactorDate(date: string) {
	const months = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];
	let year = date.toString().substring(0, 4);
	let month = date.toString().substring(4, 6);
	let day = date.toString().substring(6, 8);

	let jsdate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
	return (
		jsdate.getDate() + " " + months[jsdate.getMonth()] + ", " + jsdate.getFullYear()
	);
}

export function refactorWeekDay(d: string) {
	const days: { [key: string]: string } = {
		Mon: "Monday",
		Tue: "Tuesday",
		Wed: "Wednesday",
		Thu: "Thursday",
		Fri: "Friday",
		Sat: "Saturday",
		Sun: "Sunday",
	};
	return d in days ? days[d] : "Day N/A";
}
