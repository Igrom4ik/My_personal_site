from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import json
import jwt
import datetime

# Загрузка переменных окружения
load_dotenv()

app = Flask(__name__)
CORS(app)

# Секреты из .env
JWT_SECRET = os.getenv("JWT_SECRET", "changeme")

# Простой словарь пользователей (логин: пароль)
USERS = {
    "admin": "admin",       # <-- логин и пароль
    "editor": "editor123"
}

DATA_FILE = os.path.join(os.path.dirname(__file__), "../data/posts.json")


# ==== Декоратор для защиты маршрутов ====
def authenticate_token(func):
    def wrapper(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        token = auth_header.replace("Bearer ", "")

        if not token:
            return jsonify({"error": "Отсутствует токен"}), 401

        try:
            jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Срок действия токена истёк"}), 403
        except jwt.InvalidTokenError:
            return jsonify({"error": "Неверный токен"}), 403

        return func(*args, **kwargs)

    wrapper.__name__ = func.__name__
    return wrapper


# ==== Логин ====
@app.post("/api/login")
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Имя пользователя и пароль обязательны"}), 400

    if USERS.get(username) != password:
        return jsonify({"error": "Неверные данные"}), 401

    token = jwt.encode(
        {
            "user": username,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=2)
        },
        JWT_SECRET,
        algorithm="HS256"
    )

    return jsonify({"token": token})


# ==== Получение постов ====
@app.get("/api/posts")
@authenticate_token
def get_posts():
    try:
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            posts = json.load(f)
        return jsonify(posts)
    except Exception as e:
        return jsonify({"error": "Ошибка чтения постов", "details": str(e)}), 500


# ==== Сохранение постов ====
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


# ==== Запуск ====
if __name__ == "__main__":
    app.run(port=3001)
