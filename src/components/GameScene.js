/* eslint jsx-quotes: ["error", "prefer-double"] */

import React from 'react'
import Reflux from 'reflux'
import Debug from 'debug'

import Store from '../GameStore'
import Actions from '../GameActions'

import Loader from './Loader'
import AppBar from './AppBar'
import StateFightingPvP from './StateFightingPvP'

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
          <StateFightingPvP id="statepvp" x={(this.state.config.GAME_WIDTH - this.state.config.GAME_TILES * 140) / 2} y={0} />
        </div>
      </div>
    )
  }
}

export default GameScene
