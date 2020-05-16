import React from 'react'
import '../../App.scss'
import RoundList from './roundlist/RoundList'
import PreviousWords from './previouswords/PreviousWords'
import Players from './players/Players'
import Action from './actions/Action'
import SwitcherWords from './teamwords/SwitcherWords'

const Game = () => (
  <div className='game'>
    <div className='play-parts'>
      <div className='play-part1'><Action /></div>
      <div className='play-part2'><Players /></div>
      <div className='play-part3'><SwitcherWords /></div>
    </div>
    <div className='game-parts'>
      <div className='game-part'><PreviousWords /></div>
      <div className='game-part'><RoundList /></div>
    </div>
  </div>
)

export default Game
