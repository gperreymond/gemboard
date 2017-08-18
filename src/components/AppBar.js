/* eslint jsx-quotes: ["error", "prefer-double"] */

import PropTypes from 'prop-types'
import React from 'react'
import Reflux from 'reflux'

import Store from '../GameStore'
import Button from './elements/Button'

const PIXI = require('pixi.js')

class AppBar extends Reflux.Component {
  constructor (props) {
    super(props)
    this.state = {
      container: false
    }
    this.store = Store
  }
  componentDidUpdate () {
    if (this.props.stage === false) return false
    if (this.state.container === false) {
      this.state.container = new PIXI.Container()
      this.state.container.visible = false
      this.state.container.x = this.props.x
      this.state.container.y = this.props.y
      this.props.stage.addChild(this.state.container)
    }
  }
  componentWillUnmount () {
    Reflux.Component.prototype.componentWillUnmount.call(this)
  }
  render () {
    if (this.state.container === false) return (null)
    this.state.container.visible = this.state.currentState === 'STATE_HOMEPAGE'
    return (
      <div>
        <Button stage={this.state.container} x={0} y={0} width={140} height={140} />
        <Button stage={this.state.container} x={140 + 28} y={0} width={140} height={140} />
      </div>
    )
  }
}

AppBar.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired
}

export default AppBar
