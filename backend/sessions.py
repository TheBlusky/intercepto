import json
import uuid

from starlette.exceptions import HTTPException

from utils import add_task

STATE_NOT_IN_GAME = 0
STATE_IN_LOBBY = 1
STATE_PLAYING = 2


class Session:
    sessions = {}

    @classmethod
    def get_session(cls, session_id):
        try:
            return Session.sessions[session_id]
        except KeyError:
            raise HTTPException(401, json.dumps({"error": "No session"}))

    @classmethod
    def set_session(cls, session_id, session):
        Session.sessions[session_id] = session

    def __init__(self, username):
        self.session_id = str(uuid.uuid4())
        self.user_id = str(uuid.uuid4())
        self.state = STATE_NOT_IN_GAME
        self.game = None
        self.nickname = username
        self.websocket = None
        Session.set_session(self.session_id, self)

    def notify(self, message):
        if self.websocket:
            print(f"Notifying {self.session_id}")
            add_task(self.websocket.send_json(message))
        else:
            print(f"Can't notify {self.session_id}")

    def update_ws(self, websocket, notify=True):
        if self.websocket:
            print(f"Closing old WS from {self.session_id}")
            if notify:
                add_task(websocket.send_json({"action": "MULTI_WS"}))
            add_task(self.websocket.close())
        self.websocket = websocket

    def notify_status(self):
        add_task(
            self.websocket.send_json({"action": "STATUS", "status": self.get_status()})
        )

    def get_status(self):
        return {
            **self.get_public_status(),
            "state": self.state,
            "game": self.game and self.game.get_status(),
        }

    def get_public_status(self):
        return {
            "user_id": self.user_id,
            "nickname": self.nickname,
        }


def session_protected(view):
    async def protected_view(*args, **kwargs):
        request = args[1]
        session_id = request.headers.get("session-id", None)
        kwargs["session"] = Session.get_session(session_id)
        return await view(*args, **kwargs)

    return protected_view
