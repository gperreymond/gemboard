/* eslint jsx-quotes: ["error", "prefer-double"] */

import PropTypes from 'prop-types'
import Reflux from 'reflux'
import Debug from 'debug'

import Store from '../../GameStore'

const debug = Debug('gemboard-game:LeftTurnArrow')
const PIXI = require('pixi.js')

class TurnArrow extends Reflux.Component {
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
      // circle
      let graphics = new PIXI.Graphics()
      graphics.beginFill(0xe6ac00, 1)
      graphics.lineStyle(4, 0x0b38600, 1)
      graphics.drawRect(0, 0, 20, 100)
      this.state.container.addChild(graphics)
      this.state.stage.addChild(this.state.container)
    }
  }
  componentWillUnmount () {
    Reflux.Component.prototype.componentWillUnmount.call(this)
  }
  render () {
    if (this.state.container === false) return (null)
    this.state.container.visible = this.props.visible && this.state.currentState === 'STATE_FIGHTING'
    return (null)
  }
}

TurnArrow.propTypes = {
  id: PropTypes.string,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  visible: PropTypes.bool.isRequired
}

export default TurnArrow
