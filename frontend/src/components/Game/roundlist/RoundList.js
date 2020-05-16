import React, { useContext } from 'react'
import '../../../App.scss'
import Round from './Round'
import { GameStatusContext } from '../../LobbyWrapper'
import ReactCardFlip from 'react-card-flip'

const RoundList = () => {
  const gameStatus = useContext(GameStatusContext)
  const rounds = gameStatus.rounds || []
  const currentRound = gameStatus.rounds && gameStatus.rounds[gameStatus.rounds.length - 1]
  const currentTeam = currentRound ? (currentRound.b ? 'b' : 'a') : 'a'
  return (
    <div className='round-list'>
      {
        rounds.map(
          (round, i) => (
            <ReactCardFlip key={i} isFlipped={currentTeam === 'b'} flipDirection='vertical'>
              <Round key={i} n={i} round={round.a} team='a' />
              <Round key={i} n={i} round={round.b} team='b' />
            </ReactCardFlip>
          )
        )
      }
    </div>
  )
}

export default RoundList
