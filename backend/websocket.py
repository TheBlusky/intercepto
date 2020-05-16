from starlette.endpoints import WebSocketEndpoint
from sessions import session_protected, Session


class WebSocket(WebSocketEndpoint):
    encoding = "json"

    async def on_connect(self, websocket):
        await websocket.accept()

    async def on_receive(self, websocket, data):
        session = Session.get_session(data.get("session-id", None))
        session.update_ws(websocket)
        session.notify_status()

    async def on_disconnect(self, websocket, close_code):
        for session in [
            Session.sessions[s]
            for s in Session.sessions
            if Session.sessions[s].websocket == websocket
        ]:
            session.update_ws(None, notify=False)
            print(f"Websocket disconnected from {session.session_id}")
