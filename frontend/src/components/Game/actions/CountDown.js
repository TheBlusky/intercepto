import ReactCountdownClock from 'react-countdown-clock'
import React from 'react'

const CountDown = ({ t }) => (
  <ReactCountdownClock
    seconds={t}
    color='#00000'
    alpha={0.9}
    size={50}
  />
)

export default CountDown
