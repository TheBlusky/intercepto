import unittest
from starlette.testclient import TestClient
from intercepto import app
from tests_utils import TestUser


class TestStringMethods(unittest.TestCase):
    def test(self):
        client_1 = TestClient(app)
        response = client_1.post("/api")
        self.assertEqual(response.status_code, 404)
        response = client_1.post("/api/session")
        self.assertEqual(response.status_code, 400)
        response = client_1.post("/api/session", json={})
        self.assertEqual(response.status_code, 400)
        response = client_1.post("/api/session", json={"username": "foo"})
        self.assertEqual(response.status_code, 200)
        session_id = response.json()["session_id"]
        response = client_1.post("/api/lobby/join", json={"game_name": "foo"})
        self.assertEqual(response.status_code, 401)
        response = client_1.post(
            "/api/lobby/join",
            json={"game_name": "foo"},
            headers={"session-id": session_id},
        )
        self.assertEqual(response.status_code, 200)
        response = client_1.post(
            "/api/lobby/join",
            json={"game_name": "foo"},
            headers={"session-id": session_id},
        )
        self.assertEqual(response.status_code, 401)
        client_2 = TestUser(app, "bar")
        response = client_2.post("/api/lobby/join", json={"game_name": "foo"},)
        self.assertEqual(response.status_code, 200)
        client_3 = TestUser(app, "baz")
        with client_2.websocket_connect("/ws") as websocket_2:
            ws_message = websocket_2.receive_json()
            self.assertEqual(ws_message["action"], "STATUS")
            response = client_3.post("/api/lobby/join", json={"game_name": "foo"},)
            self.assertEqual(response.status_code, 200)
            ws_message = websocket_2.receive_json()
            self.assertEqual(ws_message["actor"]["nickname"], "baz")
            self.assertEqual(ws_message["action"], "JOIN")


if __name__ == "__main__":
    unittest.main()
