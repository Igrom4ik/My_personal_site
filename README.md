# My Personal Site

## Installation

Install Python dependencies using pip:

```bash
pip install -r server/requirements.txt
```

## Running the Server

Start the Flask server with:

```bash
python server/app.py
```

The application will run on port `3001` by default.

When running, the Flask server also serves the front-end from the `docs`
directory. Open `http://localhost:3001/` in your browser to view the site.

## Default Credentials

The project starts with two users defined in `data/users.json`:

- `admin` / `admin`
- `editor` / `editor123`

The first login as `admin` requires the credentials to be changed. After a successful login with the default `admin` credentials, the browser is redirected to `change-credentials.html`.
