/* global WebSocket */
import React, { useEffect, useState } from 'react'
import '../App.scss'
import Game from './Game/Game'
import { websocketHandle } from '../websocketHandler'
import Lobby from './Lobby/Lobby'

let websocket
let cheatSetState
let cheatSetStatus
let cheatSetPlayers
let cheatSetGameStatus

const handleWebSocketMessage = (event) => {
  const data = JSON.parse(event.data)
  websocketHandle({ data, cheatSetState, cheatSetStatus, cheatSetPlayers, cheatSetGameStatus })
}
const createWebSocket = (sessionId) => {
  const l = window.location
  const wsUrl = `ws${(l.protocol === 'https:') ? 's' : ''}://${l.hostname}:${l.port}`
  const wsUrl2 = 'ws://127.0.0.1:8000'
  const isDev = process.env.NODE_ENV === 'development'

  websocket = new WebSocket(`${isDev ? wsUrl2 : wsUrl}/ws`)
  websocket.onopen = (event) => {
    websocket.onmessage = handleWebSocketMessage
    websocket.send(JSON.stringify({ 'session-id': sessionId }))
  }
}

export const STATE_NOT_IN_GAME = 0
export const STATE_IN_LOBBY = 1
export const STATE_PLAYING = 2

export const StateContext = React.createContext(STATE_NOT_IN_GAME)
export const StatusContext = React.createContext({})
export const PlayersContext = React.createContext([])
export const GameStatusContext = React.createContext([])

const LobbyWrapper = ({ sessionId }) => {
  const [state, setState] = useState(STATE_NOT_IN_GAME)
  const [status, setStatus] = useState({})
  const [players, setPlayers] = useState([])
  const [gameStatus, setGameStatus] = useState({})
  useEffect(() => {
    createWebSocket(sessionId)
  }, [sessionId])
  useEffect(() => {
    cheatSetState = setState
    cheatSetStatus = setStatus
    cheatSetPlayers = setPlayers
    cheatSetGameStatus = setGameStatus
  }, [setState, setStatus, setPlayers])
  return (
    <StateContext.Provider value={state}>
      <StatusContext.Provider value={status}>
        <PlayersContext.Provider value={players}>
          <GameStatusContext.Provider value={gameStatus}>
            {state === STATE_PLAYING && <Game />}
            {state !== STATE_PLAYING && status && <Lobby nickname={status.nickname} />}
            {state !== STATE_PLAYING && !status && <div>Chargement</div>}
          </GameStatusContext.Provider>
        </PlayersContext.Provider>
      </StatusContext.Provider>
    </StateContext.Provider>
  )
}

export default LobbyWrapper
