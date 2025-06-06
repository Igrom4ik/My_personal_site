from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
import os
import json
import jwt
import datetime
from functools import wraps

# Загрузка переменных окружения
load_dotenv()

app = Flask(__name__, static_folder="static")
CORS(app)

# Секрет JWT
JWT_SECRET = os.getenv("JWT_SECRET", "changeme")

# Пути к файлам
USERS_FILE = os.path.join(os.path.dirname(__file__), "../data/users.json")
DATA_FILE = os.path.join(os.path.dirname(__file__), "../docs/blog/posts.json")

# Загрузка или создание пользователей
if os.path.exists(USERS_FILE):
    with open(USERS_FILE, "r", encoding="utf-8") as f:
        USERS = json.load(f)
else:
    USERS = {
        "admin": {"password": "admin", "must_change": True},
        "editor": {"password": "editor123", "must_change": False}
    }
    os.makedirs(os.path.dirname(USERS_FILE), exist_ok=True)
    with open(USERS_FILE, "w", encoding="utf-8") as f:
        json.dump(USERS, f, ensure_ascii=False, indent=2)

# ==== Защищённый маршрут ====
def authenticate_token(func):
    @wraps(func)
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

    return wrapper

# ==== Корневой маршрут ====
@app.get("/")
def index():
    return render_template("index.html")

# ==== Страницы сайта ====
@app.get("/blog")
def blog_page():
    return render_template("blog.html")

@app.get("/blog-view")
def blog_view():
    return render_template("blog-view.html")

@app.get("/blog-editor")
def blog_editor():
    return render_template("blog-editor.html")

@app.get("/dashboard")
def dashboard_page():
    return render_template("dashboard.html")

@app.get("/admin/login")
def admin_login():
    return render_template("admin/login.html")

@app.get("/admin/change-credentials")
def admin_change_credentials():
    return render_template("admin/change-credentials.html")

@app.get("/blog/post-1")
def blog_post_1():
    return render_template("blog/post-1.html")

@app.get("/blog/post-2")
def blog_post_2():
    return render_template("blog/post-2.html")

@app.get("/portfolio/work_1")
def portfolio_work_1():
    return render_template("portfolio/work_1.html")

@app.get("/blog/posts.json")
def blog_posts_json():
    return send_from_directory(
        os.path.join(os.path.dirname(__file__), "../docs/blog"),
        "posts.json"
    )

# ==== Логин ====
@app.post("/api/login")
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Имя пользователя и пароль обязательны"}), 400

    user = USERS.get(username)
    if not user or user.get("password") != password:
        return jsonify({"error": "Неверные данные"}), 401

    token = jwt.encode(
        {
            "user": username,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=2)
        },
        JWT_SECRET,
        algorithm="HS256"
    )

    response = {"token": token}
    if user.get("must_change"):
        response["must_change"] = True

    return jsonify(response)

# ==== Получение постов ====
@app.get("/api/posts")
@authenticate_token
def get_posts():
    try:
        if os.path.exists(DATA_FILE):
            with open(DATA_FILE, "r", encoding="utf-8") as f:
                posts = json.load(f)
        else:
            posts = []
        return jsonify(posts)
    except Exception as e:
        return jsonify({"error": "Ошибка чтения постов", "details": str(e)}), 500

# ==== Сохранение постов ====
@app.post("/api/posts")
@authenticate_token
def save_posts():
    try:
        posts = request.get_json()
        os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
        with open(DATA_FILE, "w", encoding="utf-8") as f:
            json.dump(posts, f, indent=2, ensure_ascii=False)
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"error": "Ошибка сохранения постов", "details": str(e)}), 500

# ==== Изменение логина и пароля ====
@app.post("/api/change_credentials")
@authenticate_token
def change_credentials():
    auth_header = request.headers.get("Authorization", "")
    token = auth_header.replace("Bearer ", "")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
    except jwt.InvalidTokenError:
        return jsonify({"error": "Неверный токен"}), 403

    current_user = payload.get("user")
    data = request.get_json()
    new_username = data.get("username")
    new_password = data.get("password")

    if not new_username or not new_password:
        return jsonify({"error": "Имя пользователя и пароль обязательны"}), 400

    user_info = USERS.pop(current_user, None)
    if not user_info:
        return jsonify({"error": "Пользователь не найден"}), 404

    user_info["password"] = new_password
    user_info["must_change"] = False
    USERS[new_username] = user_info

    with open(USERS_FILE, "w", encoding="utf-8") as f:
        json.dump(USERS, f, ensure_ascii=False, indent=2)

    return jsonify({"success": True})

# ==== Запуск сервера ====
if __name__ == "__main__":
    app.run(host="127.0.0.1", port=3001, debug=True)
