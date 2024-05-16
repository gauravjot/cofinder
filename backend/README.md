## Using this Package

### Pre-requisites

1. Use it on a Linux or MacOS. If you are using Windows, use WSL.
2. Have `make` installed. On Debian/Ubuntu, it can be with `sudo apt install make`
3. Make sure you have Python v3.8 or higher installed.
4. Make sure you have a PostgreSQL database up and running.

### Run the project

1. Make a copy of `.env.sample` file and save it as `.env`.

    ```bash
    cp .env.sample .env
    ```

2. Find and fill these values in `.env`

    ```text
    ...
    SECRET_KEY=
    ...
    DB_USERNAME=
    DB_PASSWORD=
    DB_HOST=
    DB_PORT=
    DB_NAME=
    ```

3. Run these commands

    ```bash
    make venv
    make migratedb
    make autopush
    ```

    If you get errors at `make migratedb` then your database values are incorrect.
    
    If `make autopush` fails, open an issue in this repository. This command scrap data from UFV website and add it to the database.

4. Start the server

    ```bash
    make run
    ```

    You should be running at <http://localhost:8000>

## Admin Portal

Django has in-built Admin portal that you can browse at <http://localhost:8000/admin/>

To create an account, use:

```bash
make su
```

## Schedule `make autopush` to Auto Update Periodically

You can use crontab to accomplish this.

```bash
crontab -e
```

At the bottom of that file, add something like this

```text
0 2 * * * /bin/bash /absolute/path/to/backend/folder/.venv/bin/python manage.py auto_push
```

Now you have automated this job to run every night at 2am.

Use this to learn more about crontab <https://www.geeksforgeeks.org/crontab-in-linux-with-examples/>

## Triggering Auto Push from REST API

This is not recommended, but if you have to then go to `.env` and fill in `DB_PUSH_PASSWORD=` with hex digest of SHA256 password. Use the Python commandline to generate it with hashlib library.

Then you can make a request to this endpoint

```text
POST http://localhost:8000/api/push/

{
    "password": "your-password"
}
```

This will take few minutes while data is fetched and saved to database. You may cancel/close this request but Django will continue to work on it in background. There is not way to stop it unless you shut the server down.