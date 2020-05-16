import React, { useContext } from 'react'
import '../../../App.scss'
import Entry from './Entry'
import { GameStatusContext } from '../../LobbyWrapper'

const Round = ({ n, round, team }) => {
  const gameStatus = useContext(GameStatusContext)
  const isSelfTeam = team === gameStatus.self_team
  if (!round) {
    return false
  }
  if (!round.message) {
    return false
  }
  return (
    <div className='item'>
      <div className='sub-item label'>{isSelfTeam ? 'Décodage' : 'Interception'} #{n + 1}</div>
      {
        [0, 1, 2].map(
          (i) => (
            <Entry
              key={i}
              word={round.message[i]}
              guessed={round.decoded ? round.decoded[i].toString() : ''}
              good={round.goodAnswer ? round.goodAnswer[i].toString() : ''}
            />
          )
        )
      }
    </div>
  )
}

export default Round
