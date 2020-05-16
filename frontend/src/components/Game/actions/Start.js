import React from 'react'
import CountDown from './CountDown'

const Start = () => {
  return (
    <div>
      <div>
        <CountDown t={30} />
      </div>
      <div>
        <p>La séance d'interception va commencer ! Prenez connaissance de votre équipe et de vos mots !</p>
      </div>
    </div>
  )
}

export default Start
