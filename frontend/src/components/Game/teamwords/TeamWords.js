import React, { useContext } from 'react'
import '../../../App.scss'
import { TextField } from '@material-ui/core'
import { GameStatusContext } from '../../LobbyWrapper'

const TeamWords = () => {
  const gamestatus = useContext(GameStatusContext)
  const words = gamestatus.words
  return (
    <div className='teamwords'>
      <span>Vos mots</span>
      <div>
        {words &&
          <ul>
            <li><TextField value='0' variant='outlined' size='small' className='number-field' /> {words[0]}</li>
            <li><TextField value='1' variant='outlined' size='small' className='number-field' /> {words[1]}</li>
            <li><TextField value='2' variant='outlined' size='small' className='number-field' /> {words[2]}</li>
            <li><TextField value='3' variant='outlined' size='small' className='number-field' /> {words[3]}</li>
          </ul>}
      </div>
    </div>
  )
}

export default TeamWords
