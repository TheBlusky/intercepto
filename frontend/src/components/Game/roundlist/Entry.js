import React from 'react'
import '../../../App.scss'
import { TextField } from '@material-ui/core'

const Entry = ({ guessed, good, word }) => (
  <div className='sub-item entry'>
    <div className='word'>{word}</div>
    <div className='number'>
      <TextField label='!' variant='outlined' size='small' disabled className='number-field' value={guessed || ''} />
    </div>
    <div className='number'>
      <TextField label='?' variant='outlined' size='small' disabled className='number-field' value={good || ''} />
    </div>
  </div>
)

export default Entry
