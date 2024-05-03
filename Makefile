# Only to be used in development environment

apps := course user

.PHONY: all

venv:
	rm -rf .venv
	python3 -m venv .venv
	.venv/bin/python -m pip install -r requirements.txt

resetdb:
	find . -type d -name migrations -prune -not -path "./.venv/*" -exec rm -rf {} \;
	.venv/bin/python manage.py makemigrations
	.venv/bin/python manage.py makemigrations $(apps)
	.venv/bin/python manage.py migrate

superuser:
	.venv/bin/python manage.py createsuperuser

autopush:
	.venv/bin/python manage.py auto_push

run:
	.venv/bin/python manage.py runserver 0.0.0.0:8000

su:
	.venv/bin/python manage.py createsuperuser