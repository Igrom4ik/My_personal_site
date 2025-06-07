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

The application will run on port `3001`.

## Default Credentials

The project starts with two users defined in `data/users.json`:

- `admin` / `admin`
- `editor` / `editor123`

The first login as `admin` requires the credentials to be changed. After a successful login with the default `admin` credentials, the browser is redirected to `change-credentials.html`.

Blog posts are stored in `docs/blog/posts.json` and served by the Flask application.
