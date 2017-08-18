/* eslint jsx-quotes: ["error", "prefer-double"] */

import PropTypes from 'prop-types'
import React from 'react'
import Reflux from 'reflux'

import Text from './elements/Text'
import Store from '../GameStore'

const PIXI = require('pixi.js')

class Loader extends Reflux.Component {
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
      // ckecks done, time to create the element
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
    this.state.container.visible = this.state.currentState === 'STATE_INITIALIZE'
    return (
      <div>
        <Text stage={this.state.container} text={this.state.progress.title} x={10} y={10} fontSize={50} />
        <Text stage={this.state.container} text={this.state.progress.message} x={10} y={60} fontSize={40} />
      </div>
    )
  }
}

Loader.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired
}

export default Loader
