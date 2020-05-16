import React, { useContext } from 'react'
import CountDown from './CountDown'
import { GameStatusContext } from '../../LobbyWrapper'

const Results = () => {
  const gameStatus = useContext(GameStatusContext)
  const lastRound = gameStatus.rounds[gameStatus.rounds.length - 1]
  const lastSubRound = lastRound.b || lastRound.a
  const currentTeam = lastRound.b ? 'b' : 'a'
  const teamMissedTeam = gameStatus.self_team === currentTeam ? 'Votre équipe 😊' : 'L\'équipe adversaire 😈'
  const teamMissedMessage = lastSubRound.teamMissed
    ? `${teamMissedTeam} n'a pas réussi à le déchiffrer. Elle gagne un point "Raté".`
    : `${teamMissedTeam} a réussi à le déchiffrer.`
  const teamInterceptedTeam = gameStatus.self_team !== currentTeam ? 'Votre équipe 😊' : 'L\'équipe adversaire 😈'
  const teamInterceptedMessage = lastSubRound.teamIntercepted
    ? `${teamInterceptedTeam} a réussi à l'intercepter'. Elle gagne un point "Interception".`
    : `${teamInterceptedTeam} n'a pas réussi à l'intercepter.`
  return (
    <div>
      <div>
        <CountDown t={30} />
      </div>
      <div>
        <p>Fin du round !</p>
        <p>Le code était: {lastSubRound.goodAnswer.join(' - ')}</p>
        {
          lastSubRound.decoded
            ? <p>Votre équipe l'a interpété: {lastSubRound.decoded.join(' - ')}</p>
            : <p>Votre équipe ne l'a pas interprété</p>
        }
        <p>{teamMissedMessage}</p>
        <p>{teamInterceptedMessage}</p>
      </div>
    </div>
  )
}

export default Results
