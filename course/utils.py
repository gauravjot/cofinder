def setup_location_for_section(campus, building, room):
    return dict(campus=campus, building=building, room=room)


def setup_schedule_for_section(is_weekly, weekday, time_start, time_end, date_start, date_end, location):
    return dict(is_weekly=is_weekly,
                weekday=weekday,
                time_start=time_start,
                time_end=time_end,
                date_start=date_start,
                date_end=date_end,
                location=location
                )


def setup_section_data(crn, name, term_code, instructor, course_id, medium_code, is_active, is_lab, status, enrolled, capacity, waitlist, waitlist_capacity, note):
    return dict(crn=crn,
                name=name,
                term_code=term_code,
                instructor=instructor,
                course_id=course_id,
                medium_code=medium_code,
                is_active=is_active,
                is_lab=is_lab,
                status=status,
                enrolled=enrolled,
                capacity=capacity,
                waitlist=waitlist,
                waitlist_capacity=waitlist_capacity,
                note=note
                )
