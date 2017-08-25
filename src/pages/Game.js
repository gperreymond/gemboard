/* eslint jsx-quotes: ["error", "prefer-double"] */

import React from 'react'
import Reflux from 'reflux'
import Debug from 'debug'

import Actions from '../GameActions'
import Store from '../GameStore'
import GameScene from '../components/GameScene'

const debug = Debug('gemboard-game:Game')

class Game extends Reflux.Component {
  constructor (props) {
    debug('constructor')
    super(props)
    this.store = Store
  }
  componentDidMount () {
    debug('componentDidMount')
    Actions.updateCurrentTime()
    Actions.preloadData()
  }
  componentWillUnmount () {
    debug('componentWillUnmount')
    Reflux.Component.prototype.componentWillUnmount.call(this)
  }
  render () {
    if (this.state.resources === false) return (null)
    if (this.state.resources === true) return (null)
    return (
      <GameScene />
    )
  }
}

export default Game
