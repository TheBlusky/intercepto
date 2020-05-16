import React, { useContext } from 'react'
import '../../App.scss'
import ActionJoin from './ActionJoin'
import ActionLeave from './ActionLeave'
import { STATE_IN_LOBBY, STATE_NOT_IN_GAME, StateContext } from '../LobbyWrapper'

const Action = ({ nickname }) => {
  const state = useContext(StateContext)
  return (
    <div className='action'>
      <span>Intercepto</span>
      <div>
        <p>Bienvenue agent <strong>{nickname}</strong>.</p>
        {state === STATE_NOT_IN_GAME && <ActionJoin />}
        {state === STATE_IN_LOBBY && <ActionLeave />}
      </div>
    </div>
  )
}

export default Action
