import React, { useContext } from 'react'
import '../../../App.scss'
import Poll from './Poll/Poll'
import { GameStatusContext, StatusContext } from '../../LobbyWrapper'
import Start from './Start'
import SendMessage from './SendMessage'
import TimeOut from './TimeOut'
import WaitForIt from './WaitForIt'
import Results from './Results'
import End from './End'

const Action = () => {
  const gameStatus = useContext(GameStatusContext)
  const status = useContext(StatusContext)
  // const players = useContext(PlayersContext)
  let widget
  if (!gameStatus.current_player) {
    widget = <Start />
  } else if (gameStatus.endReason) {
    widget = <End />
  } else {
    const currentRound = gameStatus.rounds[gameStatus.rounds.length - 1]
    const currentSubRound = currentRound.b || currentRound.a
    if (currentSubRound.message === 'TIMEOUT') {
      widget = <TimeOut />
    } else if (currentSubRound.goodAnswer) {
      widget = <Results />
    } else if (gameStatus.current_player === status.user_id) {
      widget = <SendMessage />
    } else if (currentSubRound.message) {
      widget = <Poll />
    } else {
      widget = <WaitForIt />
    }
  }
  return (
    <div className='action'>
      <span>Intercepto</span>
      <div>
        {widget}
      </div>
    </div>
  )
}

export default Action
