import { Calendar, Event, ToolbarProps, momentLocalizer } from "react-big-calendar";
import React, { ComponentType } from "react";
import moment from "moment";
import { useFetchSpecificSectionData, FETCH } from "hooks/useFetchTermData";
import {
	combineDateTime,
	convertToJsDate,
	getDayAfterDate,
	Weekdays,
} from "components/Utils/CheckTimeSlotCollision";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "assets/css/calendar.css";

const localizer = momentLocalizer(moment);

export default function Content() {
	interface Event {
		id: string;
		title: string;
		start: Date;
		end: Date;
	}

	const [events, setEvents] = React.useState<Event[]>([]);
	const detailedSchedule = useFetchSpecificSectionData({
		fetch: FETCH.SpecificSections,
	});

	// Get "events" for Calendar to populate
	React.useEffect(() => {
		if (detailedSchedule && detailedSchedule.sections.length > 0) {
			let local_list: Event[] = [];
			// Iterate over all the sections user is enrolled in
			for (let i = 0; i < detailedSchedule.sections.length; i++) {
				let section = detailedSchedule.sections[i];
				// Iterate all schedule enteries that section has
				for (let j = 0; j < section.schedule.length; j++) {
					let section_schedule = detailedSchedule.sections[i].schedule[j];
					// Get the first date of class for this schedule
					let start_date = getDayAfterDate(
						convertToJsDate(section_schedule.date_start),
						Weekdays[section_schedule.weekday as keyof typeof Weekdays]
					);
					let end_date = convertToJsDate(section_schedule.date_end);
					let calendar_entry_title =
						section.subject_id +
						" " +
						section.course.code +
						" " +
						section.name +
						" - " +
						section_schedule.location.campus +
						section_schedule.location.building +
						" " +
						section_schedule.location.room;
					// If the start date and end date are different then we have
					// a date range.
					if (start_date !== end_date) {
						for (
							let d = start_date;
							d <= end_date;
							d.setDate(d.getDate() + 7)
						) {
							let obj = {
								id: section_schedule.id + d,
								title: calendar_entry_title,
								start: combineDateTime(d, section_schedule.time_start),
								end: combineDateTime(d, section_schedule.time_end),
							};
							local_list.push({ ...obj });
						}
					} else {
						// If start date and end date are same then it is one
						// time occurance schedule
						let obj = {
							id: section_schedule.id,
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
			setEvents(local_list);
		}
	}, [detailedSchedule]);

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
