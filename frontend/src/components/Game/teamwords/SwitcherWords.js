import React, { useContext } from 'react'
import '../../../App.scss'
import { GameStatusContext } from '../../LobbyWrapper'
import ReactCardFlip from 'react-card-flip'
import TeamWords from './TeamWords'
import OtherWords from './OtherWords'

const SwitcherWords = () => {
  const gamestatus = useContext(GameStatusContext)
  const wordsa = gamestatus.self_team === 'a' ? <TeamWords /> : <OtherWords />
  const wordsb = gamestatus.self_team === 'b' ? <TeamWords /> : <OtherWords />
  let currentTeam
  if (!gamestatus.rounds || gamestatus.rounds.length === 0) {
    currentTeam = gamestatus.self_team
  } else {
    const lastRound = gamestatus.rounds[gamestatus.rounds.length - 1]
    currentTeam = lastRound.b ? 'b' : 'a'
  }
  return (
    <ReactCardFlip isFlipped={currentTeam === 'b'} flipDirection='vertical'>
      {wordsa}
      {wordsb}
    </ReactCardFlip>
  )
}

export default SwitcherWords
