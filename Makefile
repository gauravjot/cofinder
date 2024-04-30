# Only to be used in development environment

apps := course user

.PHONY: all

venv:
	rm -rf .venv
	python3 -m venv .venv
	.venv/bin/python -m pip install -r requirements.txt

resetdb:
	rm -rf ./db
	mkdir db
	find . -type d -name migrations -prune -not -path "./.venv/*" -exec rm -rf {} \;
	.venv/bin/python manage.py makemigrations $(apps)
	.venv/bin/python manage.py migrate

superuser:
	.venv/bin/python manage.py createsuperuser

run:
	.venv/bin/python manage.py runserver 0.0.0.0:8000

su:
	.venv/bin/python manage.py createsuperuser