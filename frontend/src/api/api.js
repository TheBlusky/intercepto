/* global fetch */

let sessionId

export const apiSession = async (username) => {
  const response = await fetch('/api/session', {
    method: 'POST',
    body: JSON.stringify({ username })
  })
  const data = await response.json()
  sessionId = data.session_id
  return data
}
export const apiLobbyJoin = async (gameName) => {
  const response = await fetch('/api/lobby/join', {
    method: 'POST',
    body: JSON.stringify({ game_name: gameName }),
    headers: { 'session-id': sessionId }
  })
  const data = await response.json()
  return data
}
export const apiLobbyLeave = async () => {
  const response = await fetch('/api/lobby/leave', {
    method: 'POST',
    headers: { 'session-id': sessionId }
  })
  const data = await response.json()
  return data
}
export const apiLobbyStart = async () => {
  const response = await fetch('/api/lobby/start', {
    method: 'POST',
    headers: { 'session-id': sessionId }
  })
  const data = await response.json()
  return data
}
export const apiGameSend = async (word0, word1, word2) => {
  const response = await fetch('/api/game/send', {
    method: 'POST',
    body: JSON.stringify({ word0, word1, word2 }),
    headers: { 'session-id': sessionId }
  })
  const data = await response.json()
  return data
}
export const apiGameGuess = async (number0, number1, number2) => {
  const response = await fetch('/api/game/guess', {
    method: 'POST',
    body: JSON.stringify({ number0, number1, number2 }),
    headers: { 'session-id': sessionId }
  })
  const data = await response.json()
  return data
}
