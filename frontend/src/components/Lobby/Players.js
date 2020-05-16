import React, { useContext } from 'react'
import '../../App.scss'
import { PlayersContext } from '../LobbyWrapper'

const Players = () => {
  const players = useContext(PlayersContext)
  return (
    <div className='players'>
      <span>Joueurs</span>
      {players.length === 0 && <div><i>Personne</i></div>}
      <div>
        <ul>
          {players.map((p) => (<li key={p.user_id}>{p.isOwner && '👑 '}{p.nickname}</li>))}
        </ul>
      </div>
    </div>
  )
}

export default Players
