import React, { useContext, useEffect, useState } from 'react'
import '../../../../App.scss'
import CountDown from '../CountDown'
import PollEntry from './PollEntry'
import FriendsAnswers from './FriendsAnswers'
import { apiGameGuess } from '../../../../api/api'
import { GameStatusContext, PlayersContext } from '../../../LobbyWrapper'

const Poll = () => {
  const gameStatus = useContext(GameStatusContext)
  const players = useContext(PlayersContext)
  const [decoded, setDecoded] = useState([-1, -1, -1])
  const [loading, setloading] = useState(false)
  useEffect(() => {
    if (decoded.includes(-1)) {
      return
    }
    (async () => {
      setloading(true)
      await apiGameGuess(decoded[0], decoded[1], decoded[2])
      setloading(false)
    })()
  }, [decoded])
  const setSubdecoded = (pos) => (newVal) => () => setDecoded(
    decoded.map((val, i) => (i === pos ? newVal : val))
  )

  const lastRound = gameStatus.rounds[gameStatus.rounds.length - 1]
  const lastSubRound = lastRound.b || lastRound.a
  const currentPlayer = players.filter((p) => (p.user_id === gameStatus.current_player))[0].nickname
  const currentSelfTeam = (lastRound.b ? 'b' : 'a') === gameStatus.self_team
  const emoji = currentSelfTeam ? '😊' : '😈'
  return (
    <div>
      <div>
        <CountDown t={45} />
      </div>
      <div>
        {currentSelfTeam && <p>Votre coéquipié {emoji} {currentPlayer} vous a envoyé un message. Dechiffrez le. </p>}
        {!currentSelfTeam && <p>Votre équipe à intercepté le message de {emoji} {currentPlayer}. Tentez de le déchiffrer !</p>}
      </div>
      {
        gameStatus.rounds.length === 1 && !currentSelfTeam
          ? (
            <p>
              Impossible de déchiffrer ce message.
              Aucun indice n'a encore été décodé. Il faut attendre le prochain round.
            </p>
          )
          : (
            <div className='poll'>
              {[0, 1, 2].map((i) => (
                <PollEntry
                  key={i}
                  loading={loading}
                  word={lastSubRound.message[i]}
                  decoded={decoded[i]}
                  setSubdecoded={setSubdecoded(i)}
                />
              ))}
            </div>
          )
      }
      <FriendsAnswers />
    </div>
  )
}

export default Poll
