from flask import Blueprint, request, jsonify, g
from app.database import db
from app.models.comparison import CodeComparison
from app.routes.auth import jwt_optional
from app.services.c_analyzer_service import analyze_c_with_engine, analyze_code_python_fallback
from app.services.fingerprint_service import generate_code_fingerprints
from app.services.diff_service import compute_code_diff

comparison_bp = Blueprint("comparison", __name__)

@comparison_bp.route("/compare", methods=["POST"])
@jwt_optional
def compare_code():
    data = request.get_json(silent=True) or {}
    code_a = data.get("code_a", "")
    code_b = data.get("code_b", "")
    language = data.get("language", "c").lower()
    title = data.get("title", "").strip() or "Program Comparison"
    save_comparison = data.get("save_comparison", True)

    if not code_a or not code_b:
        return jsonify({"error": "Both program A and program B source codes are required."}), 400

    # 1. Analyze both programs
    if language == "c":
        analysis_a = analyze_c_with_engine(code_a)
        analysis_b = analyze_c_with_engine(code_b)
    else:
        analysis_a = analyze_code_python_fallback(code_a, language=language)
        analysis_b = analyze_code_python_fallback(code_b, language=language)

    # 2. Fingerprints
    fp_a = generate_code_fingerprints(code_a, language=language)
    fp_b = generate_code_fingerprints(code_b, language=language)

    exact_match = (fp_a["exact_fingerprint"] == fp_b["exact_fingerprint"])
    norm_match = (fp_a["normalized_fingerprint"] == fp_b["normalized_fingerprint"])

    fingerprint_comparison = {
        "program_a_exact": fp_a["exact_fingerprint"],
        "program_b_exact": fp_b["exact_fingerprint"],
        "exact_match": exact_match,
        "program_a_normalized": fp_a["normalized_fingerprint"],
        "program_b_normalized": fp_b["normalized_fingerprint"],
        "normalized_match": norm_match,
        "fingerprint_interpretation": (
            "Identical normalized fingerprint indicates both source snippets share an equivalent "
            "token sequence after comment stripping and whitespace canonicalization. "
            "This does NOT guarantee semantic behavioral equivalence."
            if norm_match else
            "Fingerprints differ, confirming distinct syntax structures and implementation representations."
        )
    }

    # 3. Diff and structural comparison
    diff_results = compute_code_diff(code_a, code_b, analysis_a, analysis_b)
    diff_results["fingerprint_comparison"] = fingerprint_comparison
    diff_results["analysis_a"] = analysis_a
    diff_results["analysis_b"] = analysis_b

    # 4. Save to database if requested
    comparison_record = None
    if save_comparison and g.user:
        try:
            comparison_record = CodeComparison(
                user_id=g.user.id,
                title=title,
                language=language,
                source_code_a=code_a,
                source_code_b=code_b,
                similarity_score=diff_results.get("similarity_percentage", 0.0)
            )
            comparison_record.set_results(diff_results)
            db.session.add(comparison_record)
            db.session.commit()
            diff_results["comparison_id"] = comparison_record.id
        except Exception as e:
            db.session.rollback()
            diff_results["save_warning"] = f"Could not persist comparison: {str(e)}"

    return jsonify(diff_results), 200

@comparison_bp.route("/comparisons", methods=["GET"])
@jwt_optional
def list_comparisons():
    records = CodeComparison.query.filter_by(user_id=g.user.id).order_by(CodeComparison.created_at.desc()).limit(30).all()
    return jsonify({
        "total": len(records),
        "comparisons": [r.to_dict() for r in records]
    }), 200

@comparison_bp.route("/comparisons/<int:comp_id>", methods=["GET"])
@jwt_optional
def get_comparison(comp_id):
    rec = CodeComparison.query.filter_by(id=comp_id, user_id=g.user.id).first()
    if not rec:
        return jsonify({"error": "Comparison record not found."}), 404
    return jsonify(rec.to_dict()), 200

@comparison_bp.route("/comparisons/<int:comp_id>", methods=["DELETE"])
@jwt_optional
def delete_comparison(comp_id):
    rec = CodeComparison.query.filter_by(id=comp_id, user_id=g.user.id).first()
    if not rec:
        return jsonify({"error": "Comparison record not found."}), 404
    db.session.delete(rec)
    db.session.commit()
    return jsonify({"message": "Comparison record deleted successfully."}), 200
