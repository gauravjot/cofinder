import { Calendar, momentLocalizer } from "react-big-calendar";
import React from "react";
import moment from "moment";
import {
	combineDateTime,
	convertToJsDate,
	getDayAfterDate,
	Weekdays,
} from "@/utils/CheckTimeSlotCollision";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "@/assets/css/calendar.css";
import { ScheduleType } from "@/types/dbTypes";
import { useAppSelector } from "@/redux/hooks";
import { selectAllSchedules } from "@/redux/schedules/scheduleSlice";
import { selectCurrentTerm } from "@/redux/terms/currentTermSlice";

const localizer = momentLocalizer(moment);
interface Event {
	id: string;
	title: string;
	start: Date;
	end: Date;
}

export default function Content() {
	const schedule_sections = useAppSelector(selectAllSchedules);
	const currentTerm = useAppSelector(selectCurrentTerm);
	const [events, setEvents] = React.useState<Event[]>([]);

	// Get "events" for Calendar to populate
	React.useEffect(() => {
		let sections = schedule_sections.filter((s) => s.term === currentTerm.code);
		if (sections.length > 0) {
			let local_list: Event[] = [];
			// Iterate over all the sections user is enrolled in
			for (let i = 0; i < sections.length; i++) {
				let section = sections[i];
				if (!section.is_active || !section.schedule) {
					continue;
				}
				// Iterate all schedule enteries that section has
				for (let j = 0; j < section.schedule.length; j++) {
					// days
					if (!section.schedule[j].hasOwnProperty("days")) {
						continue;
					}
					let days = section.schedule[j].days;
					if (!days) {
						continue;
					}
					let section_schedule: ScheduleType = section.schedule[j];
					for (let k = 0; k < days.length; k++) {
						// Get the first date of class for this schedule
						let start_date = getDayAfterDate(
							convertToJsDate(section_schedule.date_start.toString()),
							Weekdays[days[k] as keyof typeof Weekdays]
						);
						let end_date = convertToJsDate(
							section_schedule.date_end.toString()
						);
						let calendar_entry_title =
							section.name +
							" - " +
							section_schedule.location?.building +
							" " +
							section_schedule.location?.room;
						// If the start date and end date are different then we have
						// a date range.
						if (start_date !== end_date) {
							for (
								let d = start_date;
								d <= end_date;
								d.setDate(d.getDate() + 7)
							) {
								let obj = {
									id:
										calendar_entry_title.trim() +
										section_schedule.time_start +
										d,
									title: calendar_entry_title,
									start: combineDateTime(
										d,
										section_schedule.time_start
									),
									end: combineDateTime(d, section_schedule.time_end),
								};
								local_list.push({ ...obj });
							}
						} else {
							// If start date and end date are same then it is one
							// time occurance schedule
							let obj = {
								id:
									calendar_entry_title +
									section_schedule.time_start +
									start_date,
								title: calendar_entry_title,
								start: combineDateTime(
									start_date,
									section_schedule.time_start
								),
								end: combineDateTime(end_date, section_schedule.time_end),
							};
							local_list.push({ ...obj });
						}
					}
				}
			}
			setEvents(local_list);
		}
	}, [schedule_sections, currentTerm]);

	return (
		<div className="mt-28 md:mt-12 xl:mt-0">
			<Calendar
				localizer={localizer}
				events={events}
				views={["month", "week", "day"]}
				min={moment("2023-03-26T07:00:00").toDate()}
				max={moment("2023-03-26T23:00:00").toDate()}
			/>
		</div>
	);
}
