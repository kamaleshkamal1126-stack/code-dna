import os
import sys
import unittest
import json

# Add backend to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app import create_app
from app.database import db
from app.models.user import User
from app.models.project import Project
from app.models.history import AnalysisHistory

class CodeDnaApiTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app({
            "TESTING": True,
            "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
            "SECRET_KEY": "test-secret",
            "JWT_SECRET": "test-jwt-secret"
        })
        self.client = self.app.test_client()
        with self.app.app_context():
            db.create_all()

    def tearDown(self):
        with self.app.app_context():
            db.session.remove()
            db.drop_all()

    def test_health_check(self):
        response = self.client.get("/api/health")
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data["service"], "CODE DNA 3.0 Backend API")
        self.assertTrue(data["database"]["connected"])

    def test_user_registration_and_login(self):
        # Register user
        reg_payload = {
            "username": "coder_bob",
            "email": "bob@codedna.edu",
            "password": "securepassword123"
        }
        res = self.client.post("/api/auth/register", json=reg_payload)
        self.assertEqual(res.status_code, 201)
        data = res.get_json()
        self.assertIn("token", data)
        token = data["token"]

        # Verify /me with token
        me_res = self.client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
        self.assertEqual(me_res.status_code, 200)
        me_data = me_res.get_json()
        self.assertEqual(me_data["user"]["username"], "coder_bob")

        # Login with correct credentials
        login_res = self.client.post("/api/auth/login", json={
            "identifier": "bob@codedna.edu",
            "password": "securepassword123"
        })
        self.assertEqual(login_res.status_code, 200)

        # Login with invalid password
        bad_res = self.client.post("/api/auth/login", json={
            "identifier": "bob@codedna.edu",
            "password": "wrongpassword"
        })
        self.assertEqual(bad_res.status_code, 401)

    def test_c_analysis_endpoint(self):
        # Test C BST Code
        bst_code = """
        #include <stdio.h>
        #include <stdlib.h>
        struct Node { int data; struct Node* left; struct Node* right; };
        struct Node* insert(struct Node* root, int val) {
            if (!root) {
                struct Node* n = (struct Node*)malloc(sizeof(struct Node));
                n->data = val; n->left = n->right = NULL;
                return n;
            }
            if (val < root->data) root->left = insert(root->left, val);
            else root->right = insert(root->right, val);
            return root;
        }
        """
        res = self.client.post("/api/analyze", json={
            "code": bst_code,
            "language": "c",
            "title": "BST Implementation"
        })
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue(data["success"])
        self.assertIn("fingerprint", data)
        self.assertIn("exact_fingerprint", data["fingerprint"])
        self.assertIn("statistics", data)
        self.assertTrue(data["statistics"]["total_lines"] > 5)

    def test_empty_and_malformed_analysis(self):
        res = self.client.post("/api/analyze", json={"code": ""})
        self.assertEqual(res.status_code, 400)

    def test_project_crud(self):
        # Create Project
        res = self.client.post("/api/projects", json={
            "title": "QuickSort in C",
            "description": "Standard Lomuto partition",
            "source_code": "void quickSort(int arr[], int l, int r) {}",
            "category": "Searching & Sorting",
            "tags": ["sort", "quicksort", "c"]
        })
        self.assertEqual(res.status_code, 201)
        data = res.get_json()
        project_id = data["project"]["id"]

        # List Projects
        list_res = self.client.get("/api/projects")
        self.assertEqual(list_res.status_code, 200)
        list_data = list_res.get_json()
        self.assertEqual(list_data["total"], 1)

        # Get Single Project
        get_res = self.client.get(f"/api/projects/{project_id}")
        self.assertEqual(get_res.status_code, 200)
        self.assertEqual(get_res.get_json()["title"], "QuickSort in C")

        # Update Project
        up_res = self.client.put(f"/api/projects/{project_id}", json={
            "title": "QuickSort Optimized"
        })
        self.assertEqual(up_res.status_code, 200)
        self.assertEqual(up_res.get_json()["project"]["title"], "QuickSort Optimized")

        # Delete Project
        del_res = self.client.delete(f"/api/projects/{project_id}")
        self.assertEqual(del_res.status_code, 200)

    def test_code_comparison_endpoint(self):
        code_a = "int sum(int n) { int s = 0; for(int i=0; i<n; i++) s += i; return s; }"
        code_b = "int sum(int n) { return n * (n - 1) / 2; }"
        res = self.client.post("/api/compare", json={
            "code_a": code_a,
            "code_b": code_b,
            "language": "c",
            "title": "Linear vs Constant Sum"
        })
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIn("similarity_percentage", data)
        self.assertIn("line_statistics", data)
        self.assertIn("fingerprint_comparison", data)
        self.assertFalse(data["fingerprint_comparison"]["exact_match"])

    def test_dsa_curriculum_endpoints(self):
        cats_res = self.client.get("/api/dsa/categories")
        self.assertEqual(cats_res.status_code, 200)
        self.assertTrue(len(cats_res.get_json()["categories"]) >= 8)

        topics_res = self.client.get("/api/dsa/topics")
        self.assertEqual(topics_res.status_code, 200)
        self.assertTrue(len(topics_res.get_json()["topics"]) >= 8)

if __name__ == "__main__":
    unittest.main()
