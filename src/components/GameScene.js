/* eslint jsx-quotes: ["error", "prefer-double"] */

import React from 'react'
import Reflux from 'reflux'
import Debug from 'debug'

import Store from '../GameStore'
import Actions from '../GameActions'

import Engine from './Engine'
import Loader from './Loader'
import AppBar from './AppBar'
import MatchBoard from './MatchBoard'

const debug = Debug('gemboard-game:GameScene')

class GameScene extends Reflux.Component {
  constructor (props) {
    debug('constructor')
    super(props)
    this.store = Store
  }
  componentDidMount () {
    debug('componentDidMount')
    // calculate game screen ratio
    let ratio = Math.min(window.innerWidth / this.state.config.GAME_WIDTH, window.innerHeight / this.state.config.GAME_HEIGHT)
    let engine = new Engine(this.state.config.GAME_WIDTH, this.state.config.GAME_HEIGHT, '#game-canvas', { backgroundColor: 0x0c1318 })
    engine.stage.scale.x = ratio
    engine.stage.scale.y = ratio
    this.setState({
      stage: engine.stage,
      engine
    })
  }
  componentDidUpdate () {
    if (this.state.engine === false) return false
    if (this.state.resources !== false) return false
    debug('preload game data')
    Actions.preloadData()
  }
  componentWillUnmount () {
    debug('componentWillUnmount')
    Reflux.Component.prototype.componentWillUnmount.call(this)
  }
  render () {
    return (
      <div id="game-scene">
        <div id="game-canvas">
          <Loader stage={this.state.stage} x={0} y={0} />
          <AppBar stage={this.state.stage} x={20} y={20} />
          <MatchBoard stage={this.state.stage} x={(this.state.config.GAME_WIDTH - this.state.config.GAME_TILES * 140) / 2} y={0} />
        </div>
      </div>
    )
  }
}

export default GameScene
