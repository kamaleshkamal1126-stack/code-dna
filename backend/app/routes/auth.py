import os
from functools import wraps
from datetime import datetime, timezone, timedelta
import jwt
from flask import Blueprint, request, jsonify, g
from app.database import db
from app.models.user import User

auth_bp = Blueprint("auth", __name__)
JWT_SECRET = os.environ.get("JWT_SECRET", "codedna-3-jwt-super-secret-production-key-2026-secure-32bytes")
JWT_ALGORITHM = "HS256"

def generate_token(user: User) -> str:
    payload = {
        "user_id": user.id,
        "username": user.username,
        "email": user.email,
        "exp": datetime.now(timezone.utc) + timedelta(days=7)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def get_current_user_from_header():
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return None
    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("user_id")
        user = db.session.get(User, user_id)
        return user
    except Exception:
        return None

def jwt_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        user = get_current_user_from_header()
        if not user:
            return jsonify({"error": "Authentication required. Please log in."}), 401
        g.user = user
        return f(*args, **kwargs)
    return decorated

def jwt_optional(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        user = get_current_user_from_header()
        if not user:
            # Look up or create default guest user for seamless out-of-the-box experience
            guest = User.query.filter_by(username="guest_coder").first()
            if not guest:
                guest = User(username="guest_coder", email="guest@codedna.local")
                guest.set_password("guest123")
                db.session.add(guest)
                db.session.commit()
            g.user = guest
            g.is_guest = True
        else:
            g.user = user
            g.is_guest = False
        return f(*args, **kwargs)
    return decorated

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json(silent=True) or {}
    username = data.get("username", "").strip()
    email = data.get("email", "").strip()
    password = data.get("password", "")

    if not username or len(username) < 3:
        return jsonify({"error": "Username must be at least 3 characters long."}), 400
    if not email or "@" not in email:
        return jsonify({"error": "Valid email address is required."}), 400
    if not password or len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters long."}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username is already taken."}), 409
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email is already registered."}), 409

    user = User(username=username, email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    token = generate_token(user)
    return jsonify({
        "message": "User registered successfully.",
        "user": user.to_dict(),
        "token": token
    }), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}
    identifier = data.get("identifier", "").strip() or data.get("username", "").strip()
    password = data.get("password", "")

    if not identifier or not password:
        return jsonify({"error": "Username/Email and password are required."}), 400

    user = User.query.filter((User.username == identifier) | (User.email == identifier)).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid username or password."}), 401

    token = generate_token(user)
    return jsonify({
        "message": "Login successful.",
        "user": user.to_dict(),
        "token": token
    }), 200

@auth_bp.route("/me", methods=["GET"])
@jwt_optional
def get_me():
    return jsonify({
        "user": g.user.to_dict(),
        "is_guest": getattr(g, "is_guest", False)
    }), 200

@auth_bp.route("/logout", methods=["POST"])
def logout():
    return jsonify({"message": "Logout successful."}), 200
