import React from 'react'
import CountDown from './CountDown'

const TimeOut = () => {
  return (
    <div>
      <div>
        <CountDown t={10} />
      </div>
      <div>
        <p>Oups... le joueur n'a pas réussi à anvoyer son message.</p>
      </div>
    </div>
  )
}

export default TimeOut
