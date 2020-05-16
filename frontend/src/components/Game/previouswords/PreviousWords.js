import React, { useContext } from 'react'
import '../../../App.scss'
import PreviousWordsElem from './PreviousWordsElem'
import ReactCardFlip from 'react-card-flip'
import { GameStatusContext } from '../../LobbyWrapper'

const PreviousWords = () => {
  const gameStatus = useContext(GameStatusContext)
  const currentRound = gameStatus.rounds && gameStatus.rounds[gameStatus.rounds.length - 1]
  const currentTeam = currentRound ? (currentRound.b ? 'b' : 'a') : 'a'
  return (
    <div className='previous-parts'>
      {[0, 1, 2, 3].map((i) => (
        <ReactCardFlip key={i} isFlipped={currentTeam === 'b'} flipDirection='vertical'>
          <div className='previous-words'>
            <div className='guesses-label'>
              <PreviousWordsElem team='a' i={i} />
            </div>
          </div>
          <div className='previous-words'>
            <div className='guesses-label'>
              <PreviousWordsElem team='b' i={i} />
            </div>
          </div>
        </ReactCardFlip>
      ))}
    </div>
  )
}

export default PreviousWords
