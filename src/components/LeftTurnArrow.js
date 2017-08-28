/* eslint jsx-quotes: ["error", "prefer-double"] */

import PropTypes from 'prop-types'
import React from 'react'
import Reflux from 'reflux'
import Debug from 'debug'

import Store from '../GameStore'
import Button from './elements/Button'

const debug = Debug('gemboard-game:LeftTurnArrow')
const PIXI = require('pixi.js')

class LeftTurnArrow extends Reflux.Component {
  constructor (props) {
    debug('constructor')
    super(props)
    this.state = {
      container: false
    }
    this.store = Store
  }
  componentDidUpdate (prevProps, prevState) {
    if (this.state.stage === false) return false
    if (this.state.container === false) {
      this.state.container = new PIXI.Container()
      this.state.container.id = this.props.id
      this.state.container.visible = false
      this.state.container.x = this.props.x
      this.state.container.y = this.props.y
      this.state.stage.addChild(this.state.container)
    }
  }
  componentWillUnmount () {
    Reflux.Component.prototype.componentWillUnmount.call(this)
  }
  render () {
    if (this.state.container === false) return (null)
    this.state.container.visible = this.state.currentState === 'STATE_FIGHTING'
    return (
      <Button visible={this.state.game.currentTurnPlayer} stage={this.state.container} x={0} y={0} width={20} height={100} />
    )
  }
}

LeftTurnArrow.propTypes = {
  id: PropTypes.string,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired
}

export default LeftTurnArrow
