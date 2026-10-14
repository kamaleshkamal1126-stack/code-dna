import os
import sys
from flask import Blueprint, jsonify
from app.database import db
from app.models.project import Project
from app.models.history import AnalysisHistory
from app.services.c_analyzer_service import get_c_engine_executable_path

health_bp = Blueprint("health", __name__)

@health_bp.route("/health", methods=["GET"])
def health_check():
    c_engine_path = get_c_engine_executable_path()
    c_engine_ready = os.path.exists(c_engine_path)

    # Check database connectivity
    db_connected = False
    total_projects = 0
    total_analyses = 0
    try:
        db.session.execute(db.text("SELECT 1"))
        db_connected = True
        total_projects = Project.query.count()
        total_analyses = AnalysisHistory.query.count()
    except Exception as e:
        db_error = str(e)
    else:
        db_error = None

    return jsonify({
        "status": "healthy" if db_connected else "degraded",
        "service": "CODE DNA 3.0 Backend API",
        "version": "3.0.0",
        "database": {
            "connected": db_connected,
            "error": db_error,
            "total_saved_projects": total_projects,
            "total_analyses_performed": total_analyses
        },
        "c_analysis_engine": {
            "binary_path": c_engine_path,
            "binary_found": c_engine_ready,
            "status": "Ready (Native C Engine)" if c_engine_ready else "Fallback Mode"
        },
        "environment": {
            "platform": sys.platform,
            "python_version": sys.version.split(" ")[0]
        }
    }), 200
