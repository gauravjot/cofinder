import requests
import re
import sys
from bs4 import BeautifulSoup
from datetime import datetime


class GrabUFV():
    def terms(self):

        url = f'https://bn9-sso-prod.ufv.ca/prdssb8/bwysched.p_select_term?wsea_code=CRED'
        try:
            soup = BeautifulSoup(requests.get(url).content, 'html.parser')
        except:
            sys.exit(
                "ERROR - Unable to parse website. Verify website is up and running.")

        html_select = soup.find_all('option')

        return [dict(code=tag['value'], name=tag.text) for tag in html_select]

    def term_details(self, term_code):
        """ Return term details

        Args:
            term_code (int): Eg. 202401

        Returns:
            subjects, instructors, instruct_methods
        """
        url = f'https://bn9-sso-prod.ufv.ca/prdssb8/bwysched.p_search_fields'
        data = f'term_code={term_code}&wsea_code=CRED&term_code=201709&session_id=1005801'
        try:
            headers = {'Content-Type': 'application/x-www-form-urlencoded'}
            req = requests.post(url, data=data, headers=headers)
            soup = BeautifulSoup(req.content, 'html.parser')
        except:
            sys.exit(
                "ERROR - Unable to parse website. Verify website is up and running.")

        # Subjects
        html_select = soup.find(id='subj_id').find_all('option')
        subjects = [dict(code=tag['value'], name=tag.text.split(
            " (")[0]) for tag in html_select]
        if subjects[0]['name'] == 'All Subjects':
            del subjects[0]

        # Instructors
        html_select = soup.find(id='instruct_id').find_all('option')
        instructors = [dict(code=tag['value'], name=" ".join(
            tag.text.split(",")[::-1]).strip()) for tag in html_select]
        if instructors[0]['name'] == 'All Instructors':
            del instructors[0]

        # Instruction Methods
        html_select = soup.find(id='insm_id').find_all('option')
        instruct_methods = [dict(code=tag['value'], name=tag.text.split(
            " (")[0]) for tag in html_select]
        if instruct_methods[0]['name'] == 'All Instructional Methods':
            del instruct_methods[0]

        return subjects, instructors, instruct_methods

    def subject_courses(self, term_code, subject_code):
        """ Return subject courses

        Args:
            term_code (int): Eg. 202401
            subject_code (str): Eg. ADED

        Returns:
            sections, courses
        """
        url = f'https://bn9-sso-prod.ufv.ca/prdssb8/bwysched.p_course_search'
        data = f'wsea_code=CRED&term_code={term_code}&session_id=1005801&sel_subj=dummy&sel_camp=dummy&sel_sess=dummy&sel_attr=dummy&sel_levl=dummy&sel_schd=dummy&sel_ptrm=dummy&sel_insm=dummy&sel_link=dummy&sel_wait=dummy&sel_day=dummy&sel_begin_hh=dummy&sel_begin_mi=dummy&sel_begin_am_pm=dummy&sel_end_hh=dummy&sel_end_mi=dummy&sel_end_am_pm=dummy&sel_instruct=dummy&sel_open=dummy&sel_resd=dummy&sel_subj={subject_code}&sel_number=&sel_camp=&sel_sess=&sel_day=m&sel_day=t&sel_day=w&sel_day=r&sel_day=f&sel_day=s&sel_day=u&sel_instruct=&sel_wait=&sel_insm='
        try:
            headers = {'Content-Type': 'application/x-www-form-urlencoded'}
            req = requests.post(url, data=data, headers=headers)
            soup = BeautifulSoup(req.content, 'html.parser')
        except:
            sys.exit(
                "ERROR - Unable to parse website. Verify website is up and running.")
        if len(soup.find_all(class_='dataentrytable')) < 2:
            return [], []
        # Column names
        html_select = soup.find_all(class_='dataentrytable')[1].find_all('tr')
        columns = [tag.text for tag in html_select[0].find_all(
            class_='delabel')]

        # Sections
        i = 1
        sections = []
        while i < len(html_select):
            td = html_select[i].find_all('td')
            if len(td) == len(columns):
                # This is a course row with instruction medium
                values = [tag.text.replace('\xa0', '').strip() for tag in td]
                # If the second column is empty, it means the course is a duplicate
                # and we just add the second instructor name and instruction method
                if values[1] == f'\xa0' or values[1] == ' ' or values[1] == '':
                    sections[-1]['Instructor'] = sections[-1]['Instructor'] + \
                        ";"+values[-2]
                    sections[-1]['Instructional Method'] = values[-1]
                else:
                    sections.append(dict(zip(columns, values)))
                pass
            elif len(td) == len(columns)-1:
                # This row is missing instruction medium and thus has followup rows
                # It may possibly have rows before it as well.
                # Example:
                # 	DENT 162 CH1 	50400 	Clinical Patient Care 	2.5	CEP 	Full 	20 20 0 0	Yes 	Karen Klenk
                #  	  	  	  	                                              	  	  	  	  	  	  	  	Alisha Hilman
                #  	  	  	                                            	  	  	  	  	  	  	  	  	Simone Klassen
                #  	  	  	                                             	  	  	  	  	  	  	  	  	Erin Sawatzky
                #  	  	                                              	  	  	  	  	  	  	  	  	  	Debbie Ward 	Face-to-Face Learning (TRD)
                #
                values = [tag.text.replace('\xa0', '').strip() for tag in td]
                if values[1] == f'\xa0' or values[1] == ' ' or values[1] == '':
                    # If the second column is empty, it means the we just need to append the instructor name
                    sections[-1]['Instructor'] = sections[-1]['Instructor'] + \
                        ";"+values[-1]
                else:
                    # It is the first row with all the information
                    sections.append(
                        dict(zip(columns, [tag.text.replace('\xa0', '').strip() for tag in td])))
                pass
            elif len(td) == 2:
                # This is a schedule row
                schedule = td[1]
                pattern = r'(Dates|Days|Time|Building|Room):\s*([^:]+?(?=\s+(?:Dates|Days|Time|Building|Room)|$))'
                matches = re.findall(pattern, schedule.text)
                data = {key.strip(): value.strip() for key, value in matches}
                time_match = re.findall(r'\b\d{1,2}:\d{2}\b', schedule.text)
                if time_match:
                    data['time_start'] = time_match[0]
                    data['time_end'] = time_match[1]
                else:
                    data['time_start'] = None
                    data['time_end'] = None
                if 'Dates' in data:
                    dates = data['Dates'].split(' to ')
                    data['start_date'] = convert_date(dates[0])
                    data['end_date'] = convert_date(dates[1])
                else:
                    data['start_date'] = None
                    data['end_date'] = None
                # add to course
                data_processed = None
                if 'Days' in data:
                    data_processed = dict(
                        date_end=data['end_date'],
                        date_start=data['start_date'],
                        is_weekly=data['end_date'] != data['start_date'],
                        time_end=data['time_end'],
                        time_start=data['time_start'],
                        days=data['Days'].split(" "),
                        location=dict(
                            building=data['Building'] if 'Building' in data else None,
                            room=data['Room'] if 'Room' in data else None
                        )
                    )
                if data_processed:
                    # Check the latest section if it has `Schedule` key
                    if 'Schedule' in sections[-1]:
                        schedules = sections[-1]['Schedule']
                        schedules.append(data_processed)
                        sections[-1]['Schedule'] = schedules
                    else:
                        sections[-1]['Schedule'] = [data_processed]
                # add location
                if 'Building' in data:
                    building = data['Building']
                    room = data['Room'] if 'Room' in data else None
                    if 'Location' in sections[-1]:
                        locations = sections[-1]['Location']
                        # Check if location already exists
                        if not any(d['building'] == building and d['room'] == room for d in locations):
                            locations.append(
                                dict(building=building, room=room))
                            sections[-1]['Location'] = locations
                    else:
                        sections[-1]['Location'] = [
                            dict(building=building, room=room)]
                pass
            elif len(td) == 3:
                # This is "Important" row
                message = td[2].text
                sections[-1]['Important'] = message
                pass
            else:
                # Ignore everything else
                pass
            i += 1

        courses = []
        for section in sections:
            # Remove 'Select' column from courses
            section.pop('Select', None)

            # Courses
            try:
                code = section['Section'].split(" ")[1]
            except:
                code = section['Section']
            name = section['Title']
            credits = section['Credits']
            subject_code = section['Section'].split(" ")[0]
            if len(courses) > 0 and courses[-1]['code'] == code and courses[-1]['subject_code'] == subject_code:
                continue
            courses.append(dict(
                code=code,
                name=name,
                credits=credits,
                subject_code=subject_code
            ))
        return sections, courses


def convert_date(date_str):
    # Parse the input date string
    parsed_date = datetime.strptime(date_str, "%b %d, %Y")

    # Format the parsed date as YYYYMMDD
    formatted_date = parsed_date.strftime("%Y%m%d")

    return formatted_date


if __name__ == '__main__':

    grabber = GrabUFV()
    # terms = grabber.terms()
    # subjects, instructors, instruct_methods = grabber.term_details('202401')
    sections, courses = grabber.subject_courses(202405, 'PLA')
    print(sections)
    print("-----")
    print(courses)
