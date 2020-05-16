import React, { useContext } from 'react'
import CountDown from './CountDown'
import { GameStatusContext, PlayersContext } from '../../LobbyWrapper'

const WaitForIt = () => {
  const gameStatus = useContext(GameStatusContext)
  const players = useContext(PlayersContext)

  const lastRound = gameStatus.rounds[gameStatus.rounds.length - 1]
  const currentPlayer = players.filter((p) => (p.user_id === gameStatus.current_player))[0].nickname
  const currentSelfTeam = (lastRound.b ? 'b' : 'a') === gameStatus.self_team
  return (
    <div>
      <div>
        <CountDown t={30} />
      </div>
      <div>
        <p>{currentSelfTeam ? '😊' : '😈'} {currentPlayer} est en train de coder un message.</p>
        <p> {currentSelfTeam ? 'Reception en cours' : 'Interception en cours ...'}</p>
      </div>
    </div>
  )
}

export default WaitForIt
