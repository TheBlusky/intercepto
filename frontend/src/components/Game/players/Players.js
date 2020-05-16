import React, { useContext } from 'react'
import '../../../App.scss'
import { GameStatusContext, PlayersContext } from '../../LobbyWrapper'

const Players = () => {
  const gameStatus = useContext(GameStatusContext)
  const players = useContext(PlayersContext)
  const emoSelf = '😊'
  const emoOther = '😈'
  const emoMiss = '💀'
  const emoInter = '🕵️'
  const emoCurrent = '⭐'
  if (!gameStatus.team_a) { return <div /> }
  const findPlayer = (userId) => (players.filter((p) => (p.user_id === userId))[0])
  const selfTeamId = gameStatus.self_team
  const selfTeamLabel = (
    <li>
      {emoMiss}: {gameStatus[`team_${selfTeamId}_missed`]} /
      {emoInter}: {gameStatus[`team_${selfTeamId}_interception`]}
    </li>
  )
  const selfTeam = (gameStatus.self_team === 'a' ? gameStatus.team_a : gameStatus.team_b)
    .map((userId) => (
      <li key={userId}>
        {emoSelf} {findPlayer(userId).nickname} {gameStatus.current_player === userId && emoCurrent}
      </li>
    ))
  const otherTeamId = gameStatus.self_team === 'a' ? 'b' : 'a'
  const otherTeamLabel = (
    <li>
      {emoMiss}: {gameStatus[`team_${otherTeamId}_missed`]} /
      {emoInter}: {gameStatus[`team_${otherTeamId}_interception`]}
    </li>
  )
  const otherTeam = (gameStatus.self_team === 'a' ? gameStatus.team_b : gameStatus.team_a)
    .map((userId) => (
      <li key={userId}>
        {emoOther} {findPlayer(userId).nickname} {gameStatus.current_player === userId && emoCurrent}
      </li>
    ))
  return (
    <div className='players'>
      <span>Tableau des scores</span>
      <div>
        <ul>
          {[selfTeamLabel, ...selfTeam, <li key={-1}>-</li>, otherTeamLabel, ...otherTeam]}
        </ul>
      </div>
    </div>
  )
}

export default Players
