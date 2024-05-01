def setup_section_data(crn, name, is_active, is_lab, status, enrolled, capacity, waitlist, note):
    return dict(crn=crn,
                name=name,
                is_active=is_active,
                is_lab=is_lab,
                status=status,
                enrolled=enrolled,
                capacity=capacity,
                waitlist=waitlist,
                note=note
                )
