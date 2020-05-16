import { STATE_IN_LOBBY, STATE_NOT_IN_GAME, STATE_PLAYING } from './components/LobbyWrapper'

let status
let players = []
let gameStatus = {}

const updagreActor = (actor, owner) => ({ ...actor, isOwner: owner === actor.user_id })

export const websocketHandle = ({ data, cheatSetState, cheatSetStatus, cheatSetPlayers, cheatSetGameStatus }) => {
  console.log(data)
  if (data.action === 'STATUS') {
    status = { ...data.status }
    cheatSetStatus({ ...data.status })
  } else if (data.action === 'JOIN') {
    if (data.actor.user_id === status.user_id) {
      cheatSetState(STATE_IN_LOBBY)
    }
    players = [...players, updagreActor(data.actor, data.owner)]
    cheatSetPlayers([...players])
  } else if (data.action === 'LEFT') {
    if (data.actor.user_id === status.user_id) {
      cheatSetState(STATE_NOT_IN_GAME)
      players = []
      cheatSetPlayers([...players])
    } else {
      players = players
        .filter((p) => (data.actor.user_id !== p.user_id))
        .map((p) => (updagreActor(p, data.owner)))
      cheatSetPlayers([...players])
    }
  } else if (data.action === 'GAME_START') {
    cheatSetState(STATE_PLAYING)
    gameStatus = data.status
    cheatSetGameStatus({ ...gameStatus })
  } else if (data.action === 'NEW_ROUND') {
    gameStatus.current_player = data.current_player
    if (gameStatus.rounds.length < data.round) {
      gameStatus.rounds = [...gameStatus.rounds, { a: undefined, b: undefined }]
    }
    gameStatus.rounds[data.round - 1][data.team] = {
      code: data.code,
      player: data.team,
      team: data.team,
      attempts: {}
    }
    cheatSetGameStatus(JSON.parse(JSON.stringify(gameStatus)))
  } else if (data.action === 'PLAYER_TIMEOUT') {
    const currentRound = gameStatus.rounds[gameStatus.rounds.length - 1]
    const currentTeam = currentRound.b ? 'b' : 'a'
    const currentSubRound = currentRound[currentTeam]
    currentSubRound.message = 'TIMEOUT'
    gameStatus[`team_${currentTeam}_missed`] += 1
    cheatSetGameStatus(JSON.parse(JSON.stringify(gameStatus)))
  } else if (data.action === 'MESSAGE') {
    const currentRound = gameStatus.rounds[gameStatus.rounds.length - 1]
    const currentSubRound = currentRound.b || currentRound.a
    currentSubRound.message = data.message
    cheatSetGameStatus(JSON.parse(JSON.stringify(gameStatus)))
  } else if (data.action === 'ATTEMPT') {
    const currentRound = gameStatus.rounds[gameStatus.rounds.length - 1]
    const currentSubRound = currentRound.b || currentRound.a
    currentSubRound.attempts[data.actor] = data.decoded
    cheatSetGameStatus(JSON.parse(JSON.stringify(gameStatus)))
  } else if (data.action === 'END_ROUND') {
    const goodAnswer = data.good_answer
    const decoded = data.decoded
    const currentRound = gameStatus.rounds[gameStatus.rounds.length - 1]
    const currentSubRound = currentRound.b || currentRound.a
    currentSubRound.goodAnswer = goodAnswer
    currentSubRound.decoded = decoded
    cheatSetGameStatus(JSON.parse(JSON.stringify(gameStatus)))
  } else if (data.action === 'TEAM_MISSED') {
    const team = data.team
    gameStatus[`team_${team}_missed`] += 1
    const currentRound = gameStatus.rounds[gameStatus.rounds.length - 1]
    const currentSubRound = currentRound.b || currentRound.a
    currentSubRound.teamMissed = true
    cheatSetGameStatus(JSON.parse(JSON.stringify(gameStatus)))
  } else if (data.action === 'TEAM_INTERCEPTED') {
    const team = data.team
    const currentRound = gameStatus.rounds[gameStatus.rounds.length - 1]
    const currentSubRound = currentRound.b || currentRound.a
    currentSubRound.teamIntercepted = true
    gameStatus[`team_${team}_interception`] += 1
    cheatSetGameStatus(JSON.parse(JSON.stringify(gameStatus)))
  } else if (data.action === 'END') {
    const reason = data.reason
    gameStatus.endReason = reason
    cheatSetGameStatus(JSON.parse(JSON.stringify(gameStatus)))
  }
}
