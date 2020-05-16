import typesystem
from starlette.endpoints import HTTPEndpoint
from starlette.exceptions import HTTPException
from starlette.responses import JSONResponse

from games import Game
from sessions import (
    Session,
    session_protected,
    STATE_NOT_IN_GAME,
    STATE_IN_LOBBY,
    STATE_PLAYING,
)
from utils import validate


class CreateSessionSerializer(typesystem.Schema):
    username = typesystem.String(max_length=16)


class LobbyJoinSerializer(typesystem.Schema):
    game_name = typesystem.String(max_length=16)


class CreateSession(HTTPEndpoint):
    async def post(self, request):
        data = await validate(CreateSessionSerializer, request)
        return JSONResponse({"session_id": Session(data["username"]).session_id})


class LobbyJoin(HTTPEndpoint):
    @session_protected
    async def post(self, request, session=None):
        data = await validate(LobbyJoinSerializer, request)
        if session.state != STATE_NOT_IN_GAME:
            raise HTTPException(401, "Already in game")
        session.state = STATE_IN_LOBBY
        game = Game.get_or_create_game(data["game_name"], session)
        game.add_player(session)
        return JSONResponse({"status": "ok"})


class LobbyLeave(HTTPEndpoint):
    @session_protected
    async def post(self, request, session=None):
        if session.state != STATE_IN_LOBBY:
            raise HTTPException(401, "Not in lobby")
        session.state = STATE_NOT_IN_GAME
        game = session.game
        game.remove_player(session)
        return JSONResponse({"status": "ok"})


class LobbyStart(HTTPEndpoint):
    @session_protected
    async def post(self, request, session=None):
        if session.state != STATE_IN_LOBBY:
            raise HTTPException(401, "Not in lobby")
        game = session.game
        if session.user_id != game.owner_session.user_id:
            raise HTTPException(401, "Not owner")
        game.start_game()
        return JSONResponse({"status": "ok"})


class GameSendSerializer(typesystem.Schema):
    word0 = typesystem.String(max_length=16)
    word1 = typesystem.String(max_length=16)
    word2 = typesystem.String(max_length=16)


class GameGuessSerializer(typesystem.Schema):
    number0 = typesystem.Integer(minimum=0, maximum=3)
    number1 = typesystem.Integer(minimum=0, maximum=3)
    number2 = typesystem.Integer(minimum=0, maximum=3)


class GameSend(HTTPEndpoint):
    @session_protected
    async def post(self, request, session=None):
        data = await validate(GameSendSerializer, request)
        if session.state != STATE_PLAYING:
            raise HTTPException(401, "Not playing")
        game_engine = session.game.engine
        game_engine.send_message(session, [data["word0"], data["word1"], data["word2"]])
        return JSONResponse({"status": "ok"})


class GameGuess(HTTPEndpoint):
    @session_protected
    async def post(self, request, session=None):
        data = await validate(GameGuessSerializer, request)
        if session.state != STATE_PLAYING:
            raise HTTPException(401, "Not playing")
        game_engine = session.game.engine
        game_engine.send_answer(
            session, [data["number0"], data["number1"], data["number2"]]
        )
        return JSONResponse({"status": "ok"})
