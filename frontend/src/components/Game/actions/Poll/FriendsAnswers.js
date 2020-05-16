import React, { useContext } from 'react'
import '../../../../App.scss'
import { GameStatusContext, PlayersContext } from '../../../LobbyWrapper'

const FriendsAnswers = () => {
  const gameStatus = useContext(GameStatusContext)
  const players = useContext(PlayersContext)
  const lastRound = gameStatus.rounds[gameStatus.rounds.length - 1]
  const lastSubRound = lastRound.b || lastRound.a
  console.log(lastSubRound)
  const attempts = lastSubRound.attempts
  return (
    <div className='friends-answers'>
      {
        Object.keys(attempts)
          .map((a) => ([
            <div key={`nickname-${a}`} className='friends-answers-name'>
              {players.filter((p) => (p.user_id === a))[0].nickname}
            </div>,
            <div key={`attemps-${a}`} className='friends-answers-code'>
              {attempts[a].join(' - ')}
            </div>
          ]))
          .reduce((a, c) => ([...a, ...c]), [])
      }
    </div>
  )
}

export default FriendsAnswers
