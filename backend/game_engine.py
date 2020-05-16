import random
from asyncio import sleep
from datetime import datetime, timedelta

from starlette.exceptions import HTTPException

from utils import add_task


class GameEngine:
    def __init__(self, game):
        self.game = game
        self.rounds = []
        self.current_player = None
        self.current_team = None
        # Setting teams
        self.team_a_sessions = []
        self.team_b_sessions = []
        self.team_a_interception = 0
        self.team_a_missed = 0
        self.team_b_interception = 0
        self.team_b_missed = 0
        sessions = self.game.players_sessions
        for session in random.sample(sessions, len(sessions)):
            if len(self.team_a_sessions) > len(self.team_b_sessions):
                self.team_b_sessions.append(session)
            else:
                self.team_a_sessions.append(session)
        # Setting words
        with open("../utils/wordslist.txt", encoding="utf-8") as f:
            choosen_words = f.read().splitlines()
        choosen_words = random.sample(choosen_words, 8)
        self.team_a_words = choosen_words[0:4]
        self.team_b_words = choosen_words[4:8]
        # Notify everyone
        for session in self.game.players_sessions:
            session.notify(
                {"status": self.get_status(session), "action": "GAME_START",}
            )
        # Go !
        add_task(self.work())

    def get_status(self, session):
        return {
            "rounds": [],
            "current_player": self.current_player.user_id
            if self.current_player
            else None,
            "team_a_interception": self.team_a_interception,
            "team_a_missed": self.team_a_missed,
            "team_b_interception": self.team_b_interception,
            "team_b_missed": self.team_b_missed,
            "team_a": [player.user_id for player in self.team_a_sessions],
            "team_b": [player.user_id for player in self.team_b_sessions],
            "self_team": "a" if session in self.team_a_sessions else "b",
            "words": self.team_a_words
            if session in self.team_a_sessions
            else self.team_b_words,
        }

    async def work(self):
        # Breath a little here
        await sleep(30)
        finished = False
        # 8 rounds
        while len(self.rounds) < 8 and not finished:
            current_round = {"a": None, "b": None}
            self.rounds.append(current_round)
            # Each team have a sub round
            for current_team in ["a", "b"]:
                self.current_team = current_team
                # Sub round start
                if current_team == "a":
                    current_team_sessions = self.team_a_sessions
                    interceptor_team_sessions = self.team_b_sessions
                else:
                    current_team_sessions = self.team_b_sessions
                    interceptor_team_sessions = self.team_a_sessions
                self.current_player = current_team_sessions[
                    len(self.rounds) % len(current_team_sessions)
                ]
                code = random.sample([0, 1, 2, 3], 3)
                current_round[current_team] = {
                    "player": self.current_player,
                    "code": code,
                    "message": None,
                    "decoded": {},
                }
                for session in self.game.players_sessions:
                    session.notify(
                        {
                            "action": "NEW_ROUND",
                            "code": code if session == self.current_player else None,
                            "round": len(self.rounds),
                            "team": current_team,
                            "current_player": self.current_player.user_id,
                        }
                    )
                # 45s for current_player to set message
                start_time = datetime.now()
                while datetime.now() < start_time + timedelta(seconds=45):
                    if current_round[current_team]["message"]:
                        break
                    await sleep(1)
                if not current_round[current_team]["message"]:
                    # Current player did not send any message
                    if current_team == "a":
                        self.team_a_missed += 1
                    else:
                        self.team_b_missed += 1
                    for session in self.game.players_sessions:
                        session.notify(
                            {"action": "PLAYER_TIMEOUT",}
                        )
                    await sleep(10)
                    continue
                # notify message
                for session in self.game.players_sessions:
                    session.notify(
                        {
                            "action": "MESSAGE",
                            "message": current_round[current_team]["message"],
                        }
                    )
                # 45s for players to decode message
                await sleep(45)
                # Pick random message in each team
                decoded_all = current_round[current_team]["decoded"]
                # team a
                decoded_a = {
                    user_id: decoded_all[user_id]
                    for user_id in decoded_all
                    if user_id in [session.user_id for session in self.team_a_sessions]
                }
                decoded_b = {
                    user_id: decoded_all[user_id]
                    for user_id in decoded_all
                    if user_id in [session.user_id for session in self.team_b_sessions]
                }
                for team, decoded in [("a", decoded_a), ("b", decoded_b)]:
                    if len(decoded) == 0:
                        self.handle_result(team, current_team, code, None)
                    else:
                        picked_player = random.choice(list(decoded))
                        picked_code = decoded[picked_player]
                        self.handle_result(team, current_team, code, picked_code)
                await sleep(30)
            # Both team played, check if there's a winner
            team_a_winner = self.team_a_interception >= 2
            team_b_winner = self.team_b_interception >= 2
            team_a_looser = self.team_a_missed >= 2
            team_b_looser = self.team_b_missed >= 2
            team_a_won = team_a_winner or team_b_looser
            team_b_won = team_b_winner or team_a_looser
            if team_a_won and team_b_won:
                for session in self.game.players_sessions:
                    session.notify(
                        {"action": "END", "reason": "DRAW_EOG",}
                    )
                self.clear()
                return
            if team_a_won:
                for session in self.game.players_sessions:
                    session.notify(
                        {"action": "END", "reason": "WIN_A",}
                    )
                self.clear()
                return
            if team_b_won:
                for session in self.game.players_sessions:
                    session.notify(
                        {"action": "END", "reason": "WIN_B",}
                    )
                self.clear()
                return
        # If no winner, it's a draw
        for session in self.game.players_sessions:
            session.notify(
                {"action": "END", "reason": "DRAW_EOG",}
            )
        self.clear()
        return

    def handle_result(self, team, current, code, decoded):
        good_answer = code == decoded
        if team == current and not good_answer:
            if team == "a":
                self.team_a_missed += 1
            else:
                self.team_b_missed += 1
            for session in self.game.players_sessions:
                session.notify(
                    {"action": "TEAM_MISSED", "team": team,}
                )
        if team != current and good_answer:
            if team == "a":
                self.team_a_interception += 1
            else:
                self.team_a_interception += 1
            for session in self.game.players_sessions:
                session.notify(
                    {"action": "TEAM_INTERCEPTED", "team": team,}
                )
        for session in self.team_a_sessions if team == "a" else self.team_b_sessions:
            session.notify(
                {"action": "END_ROUND", "good_answer": code, "decoded": decoded}
            )

    def clear(self):
        # Todo
        pass

    def send_message(self, player_session, message):
        current_round = self.rounds[len(self.rounds) - 1][self.current_team]
        if current_round["message"]:
            raise HTTPException(401, "Message already sent")
        if player_session != self.current_player:
            raise HTTPException(401, "Not allowed to send message")
        current_round["message"] = message

    def send_answer(self, player_session, decoded):
        current_round = self.rounds[len(self.rounds) - 1][self.current_team]
        if not current_round["message"]:
            raise HTTPException(401, "No message to decode yet")
        if player_session == self.current_player:
            raise HTTPException(401, "Not allowed to decode own message")
        current_round["decoded"][player_session.user_id] = decoded
        teammates_sessions = (
            self.team_a_sessions
            if player_session in self.team_a_sessions
            else self.team_b_sessions
        )
        for session in teammates_sessions:
            session.notify(
                {
                    "action": "ATTEMPT",
                    "actor": player_session.user_id,
                    "decoded": decoded,
                }
            )
