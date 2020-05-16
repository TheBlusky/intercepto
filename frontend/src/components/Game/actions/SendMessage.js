import React, { useContext, useState } from 'react'
import CountDown from './CountDown'
import { Button, TextField } from '@material-ui/core'
import { GameStatusContext } from '../../LobbyWrapper'
import { apiGameSend } from '../../../api/api'

const SendMessage = () => {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [timer, setTimer] = useState(45)
  const [word0, setWord0] = useState('')
  const [word1, setWord1] = useState('')
  const [word2, setWord2] = useState('')
  const gameStatus = useContext(GameStatusContext)
  const sendMessage = async () => {
    if (word0 && word1 && word2) {
      setLoading(true)
      await apiGameSend(word0, word1, word2)
      setSent(true)
      setTimer(44)
    }
  }
  const currentRound = gameStatus.rounds[gameStatus.rounds.length - 1]
  const currentSubRound = currentRound.b || currentRound.a
  const code = currentSubRound.code
  const code0 = gameStatus.words[code[0]]
  const code1 = gameStatus.words[code[1]]
  const code2 = gameStatus.words[code[2]]
  return (
    <div>
      <div>
        <CountDown t={timer} />
      </div>
      {
        sent
          ? (
            <div>
              <p>Code envoyé !</p>
            </div>
          )
          : (
            <div>
              <p>C'est à vous de faire deviner un code ! Le code est :</p>
              <h3>{code.join(' - ')}</h3>
              <div>
                <TextField
                  label={`Indice pour ${code[0]} - ${code0}`} variant='outlined' className='nickname-field'
                  value={word0}
                  onChange={(a) => { setWord0(a.target.value) }}
                />
              </div>
              <div>
                <TextField
                  label={`Indice pour ${code[1]} - ${code1}`} variant='outlined' className='nickname-field'
                  value={word1}
                  onChange={(a) => { setWord1(a.target.value) }}
                />
              </div>
              <div>
                <TextField
                  label={`Indice pour ${code[2]} - ${code2}`} variant='outlined' className='nickname-field'
                  value={word2}
                  onChange={(a) => { setWord2(a.target.value) }}
                />
              </div>
              <div><Button onClick={sendMessage} disabled={loading}>Transmettre</Button></div>
            </div>
          )
      }
    </div>
  )
}

export default SendMessage
