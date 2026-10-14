import os
from flask import Flask, jsonify
from flask_cors import CORS
from app.database import db, get_database_uri

def create_app(test_config=None):
    app = Flask(__name__)
    
    # Configuration
    app.config["SQLALCHEMY_DATABASE_URI"] = get_database_uri()
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["MAX_CONTENT_LENGTH"] = 4 * 1024 * 1024  # 4MB max request payload
    app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "codedna-3-secret-flask-key")

    if test_config:
        app.config.update(test_config)

    # Enable CORS
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

    # Initialize extensions
    db.init_app(app)

    # Register Blueprints
    from app.routes.auth import auth_bp
    from app.routes.analysis import analysis_bp
    from app.routes.projects import projects_bp
    from app.routes.comparison import comparison_bp
    from app.routes.dsa import dsa_bp
    from app.routes.health import health_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(analysis_bp, url_prefix="/api")
    app.register_blueprint(projects_bp, url_prefix="/api")
    app.register_blueprint(comparison_bp, url_prefix="/api")
    app.register_blueprint(dsa_bp, url_prefix="/api")
    app.register_blueprint(health_bp, url_prefix="/api")

    # Error Handlers (safe JSON responses, no raw internal stack leaks)
    @app.errorhandler(400)
    def handle_bad_request(e):
        return jsonify({"error": "Bad request", "details": str(e.description if hasattr(e, 'description') else e)}), 400

    @app.errorhandler(404)
    def handle_not_found(e):
        return jsonify({"error": "Resource not found"}), 404

    @app.errorhandler(413)
    def handle_payload_too_large(e):
        return jsonify({"error": "Payload exceeds maximum allowed size (4MB)"}), 413

    @app.errorhandler(500)
    def handle_internal_server_error(e):
        return jsonify({"error": "An internal server error occurred while processing the request."}), 500

    # Auto-create database tables
    with app.app_context():
        db.create_all()

    return app
