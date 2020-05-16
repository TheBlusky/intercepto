import React, { useContext } from 'react'
import '../../../App.scss'
import { GameStatusContext } from '../../LobbyWrapper'

const PreviousWordsElem = ({ i, team }) => {
  const gameStatus = useContext(GameStatusContext)
  const isSelfTeam = team === gameStatus.self_team
  return (
    <div>
      <span>
        {
          isSelfTeam
            ? `Indices données pour ${gameStatus.words[i]}`
            : `Interceptions mot #${i}`
        }
      </span>
      <div>
        <ul>
          {
            gameStatus.rounds
              ? gameStatus
                .rounds
                .filter((r) => (r[team] && r[team].goodAnswer && r[team].goodAnswer.includes(i)))
                .map((r, pos) => <li key={pos}>{r[team].message[r[team].goodAnswer.indexOf(i)]}</li>)
              : <li />
          }
        </ul>
      </div>
    </div>
  )
}

export default PreviousWordsElem
