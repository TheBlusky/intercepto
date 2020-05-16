from starlette.testclient import TestClient


class TestUser:
    def __init__(self, app, username):
        self.client = TestClient(app)
        self.username = username
        response = self.client.post("/api/session", json={"username": username})
        self.session_id = response.json()["session_id"]

    def post(self, *args, **kwargs):
        if "headers" not in kwargs:
            kwargs["headers"] = {}
        kwargs["headers"]["session-id"] = self.session_id
        return self.client.post(*args, **kwargs)

    def websocket_connect(self, *args, **kwargs):
        if "headers" not in kwargs:
            kwargs["headers"] = {}
        kwargs["headers"]["session-id"] = self.session_id
        return self.client.websocket_connect(*args, **kwargs)
