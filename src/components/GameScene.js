/* eslint jsx-quotes: ["error", "prefer-double"] */

import React from 'react'
import Reflux from 'reflux'
import Debug from 'debug'

import Store from '../GameStore'
import Actions from '../GameActions'

import Loader from './Loader'
import AppBar from './AppBar'
import Match3Board from './Match3Board'
import Background from './Background'
import TurnArrow from './elements/TurnArrow'

const debug = Debug('gemboard-game:GameScene')

class GameScene extends Reflux.Component {
  constructor (props) {
    debug('constructor')
    super(props)
    this.store = Store
  }
  componentDidMount () {
    debug('componentDidMount')
    Actions.startEngine()
  }
  componentWillUnmount () {
    debug('componentWillUnmount')
    Reflux.Component.prototype.componentWillUnmount.call(this)
  }
  render () {
    return (
      <div id="game-scene">
        <div id="game-canvas">
          <Loader id="loader" x={0} y={0} />
          <Background id="background" image="zonePiratesBackground" x={0} y={0} />
          <AppBar id="appbar" x={20} y={20} />
          <TurnArrow id="leftarrowturn" x={(250 - 20) / 2} y={20} visible={this.state.game.currentTurnPlayer} />
          <TurnArrow id="rightarrowturn" x={this.state.config.GAME_WIDTH - (250 - 20) / 2} y={20} visible={!this.state.game.currentTurnPlayer} />
          <Match3Board id="match3board" x={(this.state.config.GAME_WIDTH - this.state.config.GAME_TILES * 140) / 2} y={(this.state.config.GAME_HEIGHT - this.state.config.GAME_TILES * 140) - 25} />
        </div>
      </div>
    )
  }
}

export default GameScene
