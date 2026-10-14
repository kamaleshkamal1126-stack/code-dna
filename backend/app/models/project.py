from datetime import datetime, timezone
from app.database import db

def utc_now():
    return datetime.now(timezone.utc)

class Project(db.Model):
    __tablename__ = "projects"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, default="")
    language = db.Column(db.String(30), default="c")
    source_code = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(80), default="General DSA")
    tags = db.Column(db.String(256), default="")
    created_at = db.Column(db.DateTime, default=utc_now)
    updated_at = db.Column(db.DateTime, default=utc_now, onupdate=utc_now)

    # Relationships
    analysis_records = db.relationship("AnalysisHistory", backref="project", lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "title": self.title,
            "description": self.description,
            "language": self.language,
            "source_code": self.source_code,
            "category": self.category,
            "tags": [t.strip() for t in self.tags.split(",") if t.strip()] if self.tags else [],
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }
