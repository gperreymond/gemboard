/* eslint jsx-quotes: ["error", "prefer-double"] */

import React from 'react'
import Reflux from 'reflux'
import Debug from 'debug'

import Store from '../GameStore'
import Actions from '../GameActions'

import Loader from './Loader'
import AppBar from './AppBar'

import Match3TurnArrow from './match3/TurnArrow'
import Match3Background from './match3/Background'
import Match3Board from './match3/Board'

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
          <AppBar id="appbar" x={20} y={20} />
          <Match3TurnArrow id="leftarrowturn" x={(250 - 20) / 2} y={20} visible={this.state.game.currentTurnPlayer} />
          <Match3TurnArrow id="rightarrowturn" x={this.state.config.GAME_WIDTH - (250 - 20) / 2} y={20} visible={!this.state.game.currentTurnPlayer} />
          <Match3Background id="background" x={0} y={0} />
          <Match3Board id="match3board" x={(this.state.config.GAME_WIDTH - this.state.config.GAME_TILES * 140) / 2} y={(this.state.config.GAME_HEIGHT - this.state.config.GAME_TILES * 140) - 40} />
        </div>
      </div>
    )
  }
}

export default GameScene
