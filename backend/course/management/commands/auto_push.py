from course.grabber.do_database import push


from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = 'Fetch fresh course data from UFV and push it to server'

    def handle(self, *args, **kwargs):
        push()
