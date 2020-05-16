import React from 'react'
import '../../App.scss'
import Players from './Players'
import Action from './Action'

const Lobby = ({ nickname }) => (
  <div className='game'>
    <div className='lobby-parts'>
      <div className='lobby-part1'><Action nickname={nickname} /></div>
      <div className='lobby-part2'><Players /></div>
    </div>
  </div>
)

export default Lobby
