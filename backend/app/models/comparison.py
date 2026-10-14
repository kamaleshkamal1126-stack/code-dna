import json
from datetime import datetime, timezone
from app.database import db

def utc_now():
    return datetime.now(timezone.utc)

class CodeComparison(db.Model):
    __tablename__ = "code_comparisons"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = db.Column(db.String(150), default="Code Comparison")
    language = db.Column(db.String(30), default="c")
    source_code_a = db.Column(db.Text, nullable=False)
    source_code_b = db.Column(db.Text, nullable=False)
    similarity_score = db.Column(db.Float, default=0.0)
    comparison_results = db.Column(db.Text, default="{}")
    created_at = db.Column(db.DateTime, default=utc_now, index=True)

    def set_results(self, res):
        self.comparison_results = json.dumps(res)

    def get_results(self):
        try:
            return json.loads(self.comparison_results or "{}")
        except Exception:
            return {}

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "title": self.title,
            "language": self.language,
            "source_code_a": self.source_code_a,
            "source_code_b": self.source_code_b,
            "similarity_score": self.similarity_score,
            "comparison_results": self.get_results(),
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
