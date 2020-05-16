import React, { useContext } from 'react'
import { GameStatusContext } from '../../LobbyWrapper'

const End = () => {
  const gameStatus = useContext(GameStatusContext)
  const selfTeam = gameStatus.self_team
  const reason = gameStatus.endReason
  const message = reason.startsWith('WIN_')
    ? (
      reason[4].toLowerCase() === selfTeam
        ? 'Votre équipe a gagné ! Félicitation !'
        : "L'équipe adverse vous a battu à ce jeu... demandez une revenche !"
    )
    : "C'est une égalité entre les deux équipes !"
  return (
    <div>
      <div>
        <p>Fin du jeu !!!</p>
        <p>{message}</p>
        <p>Ca vous a plu ?</p>
      </div>
    </div>
  )
}

export default End
