import json
import requests
import argparse
import sys
from bs4 import BeautifulSoup


def get_seats(crn, s):
    '''Takes CRN and semester code as input and outputs a dictionary of the available and waitlisted seats of a course'''

    # Change the "crn_in" part of the url
    url = f"https://bn9-sso-prod.ufv.ca/prdssb8/bwckschd.p_disp_detail_sched?term_in={s}&crn_in={crn}"

    # Grab raw HTML of website
    try:
        soup = BeautifulSoup(requests.get(url).content, 'html.parser')
    except:
        sys.exit("ERROR - Unable to parse website. Verify website is up and running.")

    # Get list of seats from HTML
    dddefault_tags = soup.find_all(class_="dddefault")
    seats_cleaned = [tag.text for tag in dddefault_tags[1:7]]

    # Check for invalid combination error
    if (len(seats_cleaned) <= 0):
        sys.exit(
            "ERROR - Unable to process seat information. Check CRN / semester combination.")

    # Restriction information
    restrictions = []
    for r in dddefault_tags[0].text.split("Restrictions:")[1].split("\n\n"):
        r = r.replace("\u00a0", "").strip()
        if r != "":
            restrictions.append(r)

    # Input values into a dictionary
    availability = {
        "seats": {
            'Capacity': seats_cleaned[0],
            'Actual': seats_cleaned[1],
            'Remaining': seats_cleaned[2]
        },
        "waitlist": {
            'Capacity': seats_cleaned[3],
            'Actual': seats_cleaned[4],
            'Remaining': seats_cleaned[5]
        },
        "restrictions": restrictions
    }
    return availability


if __name__ == '__main__':

    # Output
    print(json.dumps(get_seats("50174", "202405")))
