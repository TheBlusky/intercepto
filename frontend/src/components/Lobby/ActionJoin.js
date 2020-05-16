import React, { useState } from 'react'
import '../../App.scss'
import { Button, TextField } from '@material-ui/core'
import { apiLobbyJoin } from '../../api/api'

const ActionJoin = () => {
  const [gameName, setGameName] = useState('')
  const [loading, setLoading] = useState(false)
  const connect = async () => {
    setLoading(true)
    await apiLobbyJoin(gameName)
  }
  return (
    <div>
      <p>Rejoindre ou créer un salon :</p>
      <div>
        <TextField
          label='Nom du salon' variant='outlined' className='nickname-field'
          value={gameName}
          onChange={(a) => { setGameName(a.target.value) }}
        />
      </div>
      <div><Button onClick={connect} disabled={loading}>Rejoindre / Créer</Button></div>
    </div>
  )
}

export default ActionJoin
