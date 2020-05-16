from starlette.applications import Starlette
from starlette.responses import JSONResponse
from starlette.routing import Route, WebSocketRoute, Mount
import os

from json_endpoints import (
    CreateSession,
    LobbyJoin,
    LobbyLeave,
    LobbyStart,
    GameGuess,
    GameSend,
)
from websocket import WebSocket

routes = [
    Route("/api/session", CreateSession),
    Route("/api/lobby/join", LobbyJoin),
    Route("/api/lobby/leave", LobbyLeave),
    Route("/api/lobby/start", LobbyStart),
    Route("/api/game/send", GameSend),
    Route("/api/game/guess", GameGuess),
    WebSocketRoute("/ws", WebSocket),
]

if os.environ.get("INTERCEPTO_STATIC", False):
    from starlette.staticfiles import StaticFiles

    routes.append(
        Mount(
            "/",
            app=StaticFiles(directory="../frontend/build/", html=True),
            name="static",
        )
    )

app = Starlette(debug=True, routes=routes,)


@app.exception_handler(404)
@app.exception_handler(403)
@app.exception_handler(401)
@app.exception_handler(400)
async def exception_handler(request, exc):
    return JSONResponse({"detail": exc.detail}, status_code=exc.status_code)


def main():
    import uvicorn

    uvicorn.main(["intercepto:app"])


if __name__ == "__main__":
    main()
