from starlette.exceptions import HTTPException

from game_engine import GameEngine
from sessions import STATE_PLAYING
from utils import add_task

STATE_LOBBY = 0
STATE_STARTED = 1


class Game:
    games = {}

    def __init__(self, game_name, owner_session):
        print(f"Creating game {game_name}")
        self.state = STATE_LOBBY
        self.name = game_name
        self.owner_session = owner_session
        self.players_sessions = []
        self.engine = None
        Game.games[game_name] = self

    @classmethod
    def get_or_create_game(cls, game_name, owner_session):
        try:
            return Game.games[game_name]
        except KeyError:
            return Game(game_name, owner_session)

    def add_player(self, player_session):
        if self.state != STATE_LOBBY:
            raise HTTPException(400, detail="Game has already started")
        self.players_sessions.append(player_session)
        player_session.game = self
        for session in self.players_sessions:
            session.notify(
                {
                    "actor": {
                        "user_id": player_session.user_id,
                        "nickname": player_session.nickname,
                    },
                    "owner": self.owner_session.user_id,
                    "action": "JOIN",
                }
            )
            if session != player_session:
                player_session.notify(
                    {
                        "actor": {
                            "user_id": session.user_id,
                            "nickname": session.nickname,
                        },
                        "owner": self.owner_session.user_id,
                        "action": "JOIN",
                    }
                )

    def remove_player(self, player_session):
        if self.state != STATE_LOBBY:
            raise HTTPException(400, detail="Game has already started")
        if len(self.players_sessions) > 1:
            if self.owner_session == player_session:
                self.owner_session = self.players_sessions[
                    1 if self.players_sessions[0] == player_session else 0
                ]
        for session in self.players_sessions:
            session.notify(
                {
                    "actor": {
                        "user_id": player_session.user_id,
                        "nickname": player_session.nickname,
                    },
                    "owner": self.owner_session.user_id,
                    "action": "LEFT",
                }
            )
        del self.players_sessions[self.players_sessions.index(player_session)]
        player_session.game = None

    def get_status(self):
        if self.state == STATE_LOBBY:
            return {
                "name": self.name,
                "owner_session": self.owner_session.get_public_status(),
                "players_sessions": [
                    player.get_public_status() for player in self.players_sessions
                ],
            }

    def start_game(self):
        if len(self.players_sessions) < 4:
            raise HTTPException(401, "At least 4 players needed")
        self.state = STATE_STARTED
        for session in self.players_sessions:
            session.state = STATE_PLAYING
        self.engine = GameEngine(self)
