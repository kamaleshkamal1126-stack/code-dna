from flask import Blueprint, request, jsonify, g
from app.database import db
from app.models.history import AnalysisHistory
from app.routes.auth import jwt_optional, jwt_required
from app.services.c_analyzer_service import analyze_c_with_engine, analyze_code_python_fallback
from app.services.fingerprint_service import generate_code_fingerprints

analysis_bp = Blueprint("analysis", __name__)

@analysis_bp.route("/analyze", methods=["POST"])
@jwt_optional
def analyze_code():
    data = request.get_json(silent=True) or {}
    source_code = data.get("code", "")
    language = data.get("language", "c").lower()
    title = data.get("title", "").strip() or "C Code Analysis"
    project_id = data.get("project_id")
    save_to_history = data.get("save_history", True)

    if not source_code or not source_code.strip():
        return jsonify({"error": "No source code provided for analysis."}), 400

    # 1. Run static analysis
    if language == "c":
        analysis_result = analyze_c_with_engine(source_code)
    else:
        analysis_result = analyze_code_python_fallback(source_code, language=language)

    # 2. Generate SHA-256 fingerprints
    fingerprint_data = generate_code_fingerprints(source_code, language=language)
    analysis_result["fingerprint"] = fingerprint_data

    # 3. Save to database history
    history_record = None
    if save_to_history and g.user:
        try:
            complexity = analysis_result.get("complexity", {})
            history_record = AnalysisHistory(
                user_id=g.user.id,
                project_id=project_id,
                title=title,
                language=language,
                source_code=source_code,
                time_complexity=complexity.get("worst_case", "Undetermined"),
                space_complexity=complexity.get("space_complexity", "Undetermined"),
                fingerprint=fingerprint_data.get("normalized_fingerprint", "")
            )
            history_record.set_algorithms(analysis_result.get("algorithms", []))
            history_record.set_structures(analysis_result.get("data_structures", []))
            history_record.set_statistics(analysis_result.get("statistics", {}))
            
            db.session.add(history_record)
            db.session.commit()
            analysis_result["history_id"] = history_record.id
        except Exception as e:
            db.session.rollback()
            analysis_result["history_save_warning"] = f"Could not persist history: {str(e)}"

    return jsonify(analysis_result), 200

@analysis_bp.route("/analysis-history", methods=["GET"])
@jwt_optional
def get_analysis_history():
    query = AnalysisHistory.query.filter_by(user_id=g.user.id).order_by(AnalysisHistory.created_at.desc())
    records = query.limit(50).all()
    return jsonify({
        "total": len(records),
        "history": [r.to_dict() for r in records]
    }), 200

@analysis_bp.route("/analysis-history/<int:record_id>", methods=["GET"])
@jwt_optional
def get_analysis_record(record_id):
    record = AnalysisHistory.query.filter_by(id=record_id, user_id=g.user.id).first()
    if not record:
        return jsonify({"error": "Analysis record not found."}), 404
    return jsonify(record.to_dict()), 200

@analysis_bp.route("/analysis-history/<int:record_id>", methods=["DELETE"])
@jwt_optional
def delete_analysis_record(record_id):
    record = AnalysisHistory.query.filter_by(id=record_id, user_id=g.user.id).first()
    if not record:
        return jsonify({"error": "Analysis record not found."}), 404
    db.session.delete(record)
    db.session.commit()
    return jsonify({"message": "Analysis record deleted successfully."}), 200

@analysis_bp.route("/analysis-history", methods=["DELETE"])
@jwt_optional
def clear_analysis_history():
    AnalysisHistory.query.filter_by(user_id=g.user.id).delete()
    db.session.commit()
    return jsonify({"message": "All analysis history cleared."}), 200
