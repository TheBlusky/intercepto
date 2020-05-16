import React, { useContext, useState } from 'react'
import '../../App.scss'
import { Button } from '@material-ui/core'
import { apiLobbyLeave, apiLobbyStart } from '../../api/api'
import { PlayersContext, StatusContext } from '../LobbyWrapper'

const ActionLeave = () => {
  const [loading, setLoading] = useState(false)
  const status = useContext(StatusContext)
  const players = useContext(PlayersContext)
  const selfPlayers = players.filter((p) => (p.user_id === status.user_id))
  console.log(selfPlayers)
  const isOwner = selfPlayers.length === 1 && selfPlayers[0].isOwner
  const connect = async () => {
    setLoading(true)
    await apiLobbyLeave()
  }
  const start = async () => {
    setLoading(true)
    await apiLobbyStart()
  }
  return (
    <div>
      <p>Vous êtes dans un salon</p>
      {isOwner && (
        <div>
          <p>Vous êtes le owner du salon</p>
          <p>Si au moins 4 personnes rejoignent le salon, vous pourrez démarer la partie.</p>
          <div><Button onClick={start} disabled={loading || players.length < 4}>Démarrer la partie</Button></div>
        </div>
      )}
      <div><Button onClick={connect} disabled={loading}>Quitter le salon</Button></div>
    </div>
  )
}

export default ActionLeave
