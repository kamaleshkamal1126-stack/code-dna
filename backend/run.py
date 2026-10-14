import os
import sys

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app

app = create_app()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    host = os.environ.get("HOST", "0.0.0.0")
    debug = os.environ.get("FLASK_DEBUG", "True").lower() == "true"
    print(f"Starting CODE DNA 3.0 Backend on http://127.0.0.1:{port}")
    app.run(host=host, port=port, debug=debug)
