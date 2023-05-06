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

export function refactorTime(fourDigitTime: number) {
	let time = fourDigitTime.toString().padStart(4, "0");
	let hours24 = parseInt(time.substring(0, 2), 10);
	let hours = ((hours24 + 11) % 12) + 1;
	let amPm = hours24 > 11 ? "pm" : "am";
	let minutes = time.substring(2);

	return hours + ":" + minutes + amPm;
}

export function refactorDate(date: number) {
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
		M: "Monday",
		T: "Tuesday",
		W: "Wednesday",
		R: "Thursday",
		F: "Friday",
		S: "Saturday",
		U: "Sunday",
	};
	return d in days ? days[d] : "Day N/A";
}
