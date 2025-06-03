from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import jwt
import os
import json
import datetime

load_dotenv()

app = Flask(__name__)
CORS(app)

JWT_SECRET = os.getenv("JWT_SECRET", "changeme")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "admin")

DATA_FILE = os.path.join(os.path.dirname(__file__), "../data/posts.json")


def authenticate_token(func):
    def wrapper(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        token = auth_header.replace("Bearer ", "")

        if not token:
            return jsonify({"error": "Missing token"}), 401

        try:
            jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token expired"}), 403
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 403

        return func(*args, **kwargs)

    wrapper.__name__ = func.__name__
    return wrapper


@app.post("/api/login")
def login():
    data = request.get_json()
    if not data or data.get("password") != ADMIN_PASSWORD:
        return jsonify({"error": "Неверный пароль"}), 401

    token = jwt.encode(
        {
            "user": "admin",
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=2)
        },
        JWT_SECRET,
        algorithm="HS256"
    )

    return jsonify({"token": token})


@app.get("/api/posts")
@authenticate_token
def get_posts():
    try:
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            posts = json.load(f)
        return jsonify(posts)
    except Exception as e:
        return jsonify({"error": "Ошибка чтения постов", "details": str(e)}), 500


@app.post("/api/posts")
@authenticate_token
def save_posts():
    try:
        posts = request.get_json()
        with open(DATA_FILE, "w", encoding="utf-8") as f:
            json.dump(posts, f, indent=2, ensure_ascii=False)
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"error": "Ошибка сохранения постов", "details": str(e)}), 500


if __name__ == "__main__":
    app.run(port=3001)
