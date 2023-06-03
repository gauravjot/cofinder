import { ScheduleType } from "@/types/dbTypes";
import { ReduxDetailedScheduleType } from "@/types/stateTypes";

export enum Weekdays {
	"U",
	"M",
	"T",
	"W",
	"R",
	"F",
	"S",
}

// Takes Date obj given by convertToJsDate fnc and
// takes time in hours like 1930
// Gives out a valid Date obj with date and Time
export function combineDateTime(date: Date, time: number) {
	return new Date(
		date.toDateString() +
			" " +
			time.toString().substring(0, time.toString().length - 2) +
			":" +
			time.toString().slice(-2)
	);
}

// Convert string 20230521 to Date Obj
export function convertToJsDate(date: string) {
	let year = date.toString().substring(0, 4);
	let month = date.toString().substring(4, 6);
	let day = date.toString().substring(6, 8);
	return new Date(year + "/" + month + "/" + day);
}

export function getDayAfterDate(date: Date, weekday: Weekdays) {
	// Set the target day of the week (0-6, where 0 is Sunday)
	let nextDayOfWeek: number = weekday;
	let nextDate;

	// Check if the requested next day is the same as the day of the input date
	if (nextDayOfWeek === date.getDay()) {
		// If so, set the next date to the input date
		nextDate = date;
	} else {
		// Calculate the number of days until the next occurrence of the target day
		let daysUntilNextDay = (nextDayOfWeek - date.getDay() + 7) % 7;
		if (daysUntilNextDay === 0 || Number.isNaN(daysUntilNextDay)) {
			// If today is the target day, add 7 days to get to the next occurrence
			daysUntilNextDay = 7;
		}
		nextDate = new Date(
			date.getFullYear(),
			date.getMonth(),
			date.getDate() + daysUntilNextDay
		);
	}
	return nextDate;
}

export interface CollisionListItem {
	start: Date;
	end: Date;
}

export function checkCollision(
	schedule: ScheduleType[],
	detailedSchedule: ReduxDetailedScheduleType
) {
	// Get a timeslot list from sections in schedule
	let scheduleList: CollisionListItem[] = [];
	for (const slot of schedule) {
		let start_date = getDayAfterDate(
			convertToJsDate(slot.date_start.toString()),
			Weekdays[slot.weekday as keyof typeof Weekdays]
		);
		let end_date = convertToJsDate(slot.date_end.toString());
		if (start_date === end_date) {
			// We are fine, this is only one time class
			let obj: CollisionListItem = {
				start: combineDateTime(start_date, slot.time_start),
				end: combineDateTime(end_date, slot.time_end),
			};
			scheduleList.push({ ...obj });
		} else {
			for (
				let d = new Date(start_date);
				d <= new Date(end_date);
				d.setDate(d.getDate() + 7)
			) {
				let obj: CollisionListItem = {
					start: combineDateTime(d, slot.time_start),
					end: combineDateTime(d, slot.time_end),
				};
				scheduleList.push({ ...obj });
			}
		}
	}

	// Get time slot list from detailed schedule
	let alreadyScheduleList: CollisionListItem[] = [];
	for (const schedule of detailedSchedule.sections) {
		for (const slot of schedule.schedule) {
			let start_date = getDayAfterDate(
				convertToJsDate(slot.date_start.toString()),
				Weekdays[slot.weekday as keyof typeof Weekdays]
			);
			let end_date = convertToJsDate(slot.date_end.toString());
			if (start_date === end_date) {
				// We are fine, this is only one time class
				let obj: CollisionListItem = {
					start: combineDateTime(start_date, slot.time_start),
					end: combineDateTime(end_date, slot.time_end),
				};
				alreadyScheduleList.push({ ...obj });
			} else {
				for (
					let d = new Date(start_date);
					d <= new Date(end_date);
					d.setDate(d.getDate() + 7)
				) {
					let obj: CollisionListItem = {
						start: combineDateTime(d, slot.time_start),
						end: combineDateTime(d, slot.time_end),
					};
					alreadyScheduleList.push({ ...obj });
				}
			}
		}
	}

	// Loop through each item in the list of times to check
	for (const timeObj of scheduleList) {
		// Parse the start and end time of the current item
		const timeObjStartTime = new Date(timeObj.start).getTime();
		const timeObjEndTime = new Date(timeObj.end).getTime();

		// Loop through the dictionary list
		for (const dictObj of alreadyScheduleList) {
			// Parse the start and end time of the current object in the dictionary list
			const dictObjStartTime = new Date(dictObj.start).getTime();
			const dictObjEndTime = new Date(dictObj.end).getTime();

			// Check for collision
			if (timeObjStartTime < dictObjEndTime && timeObjEndTime > dictObjStartTime) {
				return true;
			}
		}
	}
	return false;
}
