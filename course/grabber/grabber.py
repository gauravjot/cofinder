import requests
import re
import sys
from bs4 import BeautifulSoup


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

        # Instructors
        html_select = soup.find(id='instruct_id').find_all('option')
        instructors = [dict(code=tag['value'], name=" ".join(
            tag.text.split(",")[::-1]).strip()) for tag in html_select]

        # Instruction Methods
        html_select = soup.find(id='insm_id').find_all('option')
        instruct_methods = [dict(code=tag['value'], name=tag.text.split(
            " (")[0]) for tag in html_select]

        return subjects, instructors, instruct_methods

    def subject_courses(self, term_code, subject_code):
        """ Return subject courses

        Args:
            term_code (int): Eg. 202401
            subject_code (str): Eg. ADED

        Returns:
            subjects, instructors, instruct_methods
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

        # Column names
        html_select = soup.find_all(class_='dataentrytable')[1].find_all('tr')
        columns = [tag.text for tag in html_select[0].find_all(
            class_='delabel')]

        # Courses
        i = 1
        courses = []
        while i < len(html_select):
            td = html_select[i].find_all('td')
            if len(td) == len(columns):
                # This is a course row
                values = [tag.text for tag in td]
                # If the second column is empty, it means the course is a duplicate
                # and we just add the second instructor name and instruction method
                if values[1] == f'\xa0' or values[1] == ' ' or values[1] == '':
                    courses[-1]['Instructor'] = courses[-1]['Instructor'] + \
                        ";"+values[-2]
                    courses[-1]['Instructional Method'] = values[-1]
                else:
                    courses.append(dict(zip(columns, values)))
                pass
            elif len(td) == len(columns)-1:
                # Next row is also course row with second instructor name and instruction method
                # last two columns but current row is missing one column
                courses.append(dict(zip(columns, [tag.text for tag in td])))
                pass
            elif len(td) == 2:
                # This is a schedule row
                schedule = td[1]
                pattern = r'(Dates|Days|Time|Building|Room):\s*([^:]+?(?=\s+(?:Dates|Days|Time|Building|Room)|$))'
                matches = re.findall(pattern, schedule.text)
                data = {key.strip(): value.strip() for key, value in matches}
                # add to course
                if 'Schedule' in courses[-1]:
                    schedules = courses[-1]['Schedule']
                    schedules.append(data)
                    courses[-1]['Schedule'] = schedules
                else:
                    courses[-1]['Schedule'] = [data]
                # add location
                if 'Building' in data:
                    if 'Location' in courses[-1]:
                        locations = courses[-1]['Location']
                        # Check if location already exists
                        if not any(d['Building'] == data['Building'] and d['Room'] == data['Room'] for d in locations):

                            locations.append(
                                dict(Building=data['Building'], Room=data['Room']))
                            courses[-1]['Location'] = locations
                    else:
                        courses[-1]['Location'] = [
                            dict(Building=data['Building'], Room=data['Room'])]
                pass
            elif len(td) == 3:
                # This is "Important" row
                message = td[2].text
                courses[-1]['Important'] = message
                pass
            else:
                # Ignore everything else
                pass
            i += 1
        # Remove 'Select' column from courses
        for course in courses:
            course.pop('Select', None)
        return courses


if __name__ == '__main__':

    grabber = GrabUFV()
    # terms = grabber.terms()
    # subjects, instructors, instruct_methods = grabber.term_details('202401')
    term_subject_courses = grabber.subject_courses(202401, 'ADED')
    print(term_subject_courses)
