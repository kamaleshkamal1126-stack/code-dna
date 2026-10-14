import json
from datetime import datetime, timezone
from app.database import db

def utc_now():
    return datetime.now(timezone.utc)

class AnalysisHistory(db.Model):
    __tablename__ = "analysis_history"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    project_id = db.Column(db.Integer, db.ForeignKey("projects.id", ondelete="SET NULL"), nullable=True, index=True)
    title = db.Column(db.String(150), default="Untitled C Analysis")
    language = db.Column(db.String(30), default="c")
    source_code = db.Column(db.Text, nullable=False)
    detected_algorithms = db.Column(db.Text, default="[]")
    detected_data_structures = db.Column(db.Text, default="[]")
    time_complexity = db.Column(db.String(64), default="O(n)")
    space_complexity = db.Column(db.String(64), default="O(1)")
    fingerprint = db.Column(db.String(128), default="")
    statistics = db.Column(db.Text, default="{}")
    created_at = db.Column(db.DateTime, default=utc_now, index=True)

    def set_algorithms(self, algos):
        self.detected_algorithms = json.dumps(algos)

    def get_algorithms(self):
        try:
            return json.loads(self.detected_algorithms or "[]")
        except Exception:
            return []

    def set_structures(self, structs):
        self.detected_data_structures = json.dumps(structs)

    def get_structures(self):
        try:
            return json.loads(self.detected_data_structures or "[]")
        except Exception:
            return []

    def set_statistics(self, stats):
        self.statistics = json.dumps(stats)

    def get_statistics(self):
        try:
            return json.loads(self.statistics or "{}")
        except Exception:
            return {}

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "project_id": self.project_id,
            "title": self.title,
            "language": self.language,
            "source_code": self.source_code,
            "detected_algorithms": self.get_algorithms(),
            "detected_data_structures": self.get_structures(),
            "time_complexity": self.time_complexity,
            "space_complexity": self.space_complexity,
            "fingerprint": self.fingerprint,
            "statistics": self.get_statistics(),
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
