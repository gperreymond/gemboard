/* eslint jsx-quotes: ["error", "prefer-double"] */

import React from 'react'
import Reflux from 'reflux'

import Debug from 'debug'

import Store from './../Store'
import Actions from './../Actions'

const debug = Debug('warboard-game:boardgame')

class Game extends Reflux.Component {
  constructor (props) {
    super(props)
    this.store = Store
    this.gameLoop = this.gameLoop.bind(this)
  }
  componentDidUpdate () {
    if (this.state.initialized === true && this.state.game.renderer) {
      debug('componentDidUpdate %s', 'gameCanvas.appendChild')
      this.refs.gameCanvas.appendChild(this.state.game.renderer.view)
      this.gameLoop()
    }
  }
  componentDidMount () {
    debug('componentDidMount')
    Actions.initialize()
  }
  gameLoop () {
    this.state.game.renderer.render(this.state.game.stage)
    this.frame = requestAnimationFrame(this.gameLoop)
  }
  render () {
    if (this.state.initialized === false) {
      return (
        <div>
          <h2>{this.state.progress.text}</h2>
          <h3>Current is {this.state.progress.value}%</h3>
        </div>
      )
    }
    return (
      <div className="game-canvas-container" ref="gameCanvas" />
    )
  }
}

export default Game
