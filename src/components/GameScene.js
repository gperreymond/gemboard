/* eslint jsx-quotes: ["error", "prefer-double"] */

import React from 'react'
import Reflux from 'reflux'
import Debug from 'debug'

import Store from '../GameStore'
import Actions from '../GameActions'

import Loader from './Loader'
import AppBar from './AppBar'

import Match3Background from './match3/Background'
import Match3Board from './match3/Board'
import Match3Player from './match3/Player'

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
          <Loader id="Loader" x={0} y={0} />
          <AppBar id="AppBar" x={20} y={20} />
          <Match3Background id="Match3Background" x={0} y={0} />
          <Match3Player id="Match3PlayerLeft" computer={false} x={40} y={(this.state.config.GAME_HEIGHT - this.state.config.GAME_TILES * 140) - 40} />
          <Match3Player id="Match3PlayerRight" computer x={this.state.config.GAME_WIDTH - 40 - 340} y={(this.state.config.GAME_HEIGHT - this.state.config.GAME_TILES * 140) - 40} />
          <Match3Board id="Match3Board" x={(this.state.config.GAME_WIDTH - this.state.config.GAME_TILES * 140) / 2} y={(this.state.config.GAME_HEIGHT - this.state.config.GAME_TILES * 140) - 40} />
        </div>
      </div>
    )
  }
}

export default GameScene
