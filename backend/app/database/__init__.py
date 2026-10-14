import os
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def get_database_uri():
    # Centralized database configuration: can be overridden via DATABASE_URL for MySQL or PostgreSQL
    db_url = os.environ.get("DATABASE_URL")
    if db_url:
        return db_url
    
    # Default to persistent SQLite in instance folder or backend folder
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
    db_path = os.path.join(base_dir, "codedna.db")
    return f"sqlite:///{db_path}"
