from flask import Blueprint, request, jsonify
from app.services.dsa_curriculum import get_categories, get_topics, get_topic_by_id

dsa_bp = Blueprint("dsa", __name__)

@dsa_bp.route("/dsa/categories", methods=["GET"])
def categories_endpoint():
    return jsonify({
        "categories": get_categories()
    }), 200

@dsa_bp.route("/dsa/topics", methods=["GET"])
def topics_endpoint():
    cat = request.args.get("category_id")
    return jsonify({
        "topics": get_topics(cat)
    }), 200

@dsa_bp.route("/dsa/topic/<topic_id>", methods=["GET"])
def topic_detail_endpoint(topic_id):
    topic = get_topic_by_id(topic_id)
    if not topic:
        return jsonify({"error": "Topic not found."}), 404
    return jsonify(topic), 200

@dsa_bp.route("/dsa/examples", methods=["GET"])
def sample_examples_endpoint():
    topics = get_topics()
    examples = []
    for t in topics:
        examples.append({
            "id": t["id"],
            "title": t["title"],
            "category_id": t["category_id"],
            "code": t["c_code"],
            "time_complexity": t["time_complexity"],
            "space_complexity": t["space_complexity"]
        })
    return jsonify({
        "examples": examples
    }), 200
