from flask import Blueprint, request, jsonify, g
from app.database import db
from app.models.project import Project
from app.routes.auth import jwt_optional

projects_bp = Blueprint("projects", __name__)

@projects_bp.route("/projects", methods=["GET"])
@jwt_optional
def list_projects():
    category = request.args.get("category")
    search = request.args.get("q")
    query = Project.query.filter_by(user_id=g.user.id)
    
    if category:
        query = query.filter_by(category=category)
    if search:
        query = query.filter((Project.title.ilike(f"%{search}%")) | (Project.description.ilike(f"%{search}%")))
        
    projects = query.order_by(Project.updated_at.desc()).all()
    return jsonify({
        "total": len(projects),
        "projects": [p.to_dict() for p in projects]
    }), 200

@projects_bp.route("/projects", methods=["POST"])
@jwt_optional
def create_project():
    data = request.get_json(silent=True) or {}
    title = data.get("title", "").strip()
    source_code = data.get("source_code", "")
    description = data.get("description", "").strip()
    language = data.get("language", "c").lower()
    category = data.get("category", "General DSA").strip()
    tags = data.get("tags", [])
    
    if not title:
        return jsonify({"error": "Project title is required."}), 400
    if not source_code:
        return jsonify({"error": "Source code cannot be empty."}), 400

    tags_str = ",".join(tags) if isinstance(tags, list) else str(tags)

    project = Project(
        user_id=g.user.id,
        title=title,
        description=description,
        language=language,
        source_code=source_code,
        category=category,
        tags=tags_str
    )
    db.session.add(project)
    db.session.commit()
    return jsonify({
        "message": "Project saved successfully.",
        "project": project.to_dict()
    }), 201

@projects_bp.route("/projects/<int:project_id>", methods=["GET"])
@jwt_optional
def get_project(project_id):
    project = Project.query.filter_by(id=project_id, user_id=g.user.id).first()
    if not project:
        return jsonify({"error": "Project not found."}), 404
    return jsonify(project.to_dict()), 200

@projects_bp.route("/projects/<int:project_id>", methods=["PUT"])
@jwt_optional
def update_project(project_id):
    project = Project.query.filter_by(id=project_id, user_id=g.user.id).first()
    if not project:
        return jsonify({"error": "Project not found."}), 404

    data = request.get_json(silent=True) or {}
    if "title" in data:
        project.title = data["title"].strip()
    if "description" in data:
        project.description = data["description"].strip()
    if "source_code" in data:
        project.source_code = data["source_code"]
    if "category" in data:
        project.category = data["category"].strip()
    if "tags" in data:
        tags = data["tags"]
        project.tags = ",".join(tags) if isinstance(tags, list) else str(tags)

    db.session.commit()
    return jsonify({
        "message": "Project updated successfully.",
        "project": project.to_dict()
    }), 200

@projects_bp.route("/projects/<int:project_id>", methods=["DELETE"])
@jwt_optional
def delete_project(project_id):
    project = Project.query.filter_by(id=project_id, user_id=g.user.id).first()
    if not project:
        return jsonify({"error": "Project not found."}), 404

    db.session.delete(project)
    db.session.commit()
    return jsonify({"message": "Project deleted successfully."}), 200
