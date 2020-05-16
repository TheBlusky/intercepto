import React from 'react'
import '../../../../App.scss'
import { Button } from '@material-ui/core'

const PollEntry = ({ word, decoded, setSubdecoded, loading }) => (
  <div>
    <div className='poll-word'>{word}</div>
    <div className='poll-button'>
      {[0, 1, 2, 3].map((i) => (
        <Button onClick={setSubdecoded(i)} size='small' key={i} disabled={loading}>
          {decoded === i && '*'}{i}{decoded === i && '*'}
        </Button>
      ))}
    </div>
  </div>
)

export default PollEntry
