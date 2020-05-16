import React, { useState } from 'react'
import '../App.scss'
import { TextField, Button } from '@material-ui/core'
import { apiSession } from '../api/api'
import LobbyWrapper from './LobbyWrapper'

const SessionWrapper = () => {
  const [username, setUsername] = useState('')
  const [sessionId, setSessionId] = useState(undefined)
  const [loading, setLoading] = useState(false)
  const connect = async () => {
    setLoading(true)
    const response = await apiSession(username)
    setSessionId(response.session_id)
    setLoading(false)
  }
  if (sessionId) {
    return <LobbyWrapper sessionId={sessionId} />
  }
  return (
    <div className='game'>
      <div className='session-wrapper'>
        <span>Intercepto</span>
        <p>Envoyez des messages codés à vos coéquipiers et tentez d'intercepter les messages de vos adversaires !</p>
        <div>
          <TextField
            label='Pseudo' variant='outlined' className='nickname-field'
            value={username}
            onChange={(a) => { setUsername(a.target.value) }}
          />
        </div>
        <div><Button onClick={connect} disabled={loading}>Connexion</Button></div>
      </div>
    </div>
  )
}

export default SessionWrapper
