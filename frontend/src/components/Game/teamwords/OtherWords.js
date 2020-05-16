import React, { useContext } from 'react'
import '../../../App.scss'
import { TextField } from '@material-ui/core'
import { GameStatusContext } from '../../LobbyWrapper'

const OtherWords = () => {
  const gamestatus = useContext(GameStatusContext)
  const words = gamestatus.words
  return (
    <div className='teamwords'>
      <span>Mots adrverses</span>
      <div>
        {words &&
          <ul>
            <li><TextField value='0' variant='outlined' size='small' className='number-field' /> ?</li>
            <li><TextField value='1' variant='outlined' size='small' className='number-field' /> ?</li>
            <li><TextField value='2' variant='outlined' size='small' className='number-field' /> ?</li>
            <li><TextField value='3' variant='outlined' size='small' className='number-field' /> ?</li>
          </ul>}
      </div>
    </div>
  )
}

export default OtherWords
