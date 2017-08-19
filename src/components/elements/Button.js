/* eslint jsx-quotes: ["error", "prefer-double"] */

import PropTypes from 'prop-types'
import Reflux from 'reflux'

const PIXI = require('pixi.js')

class Button extends Reflux.Component {
  constructor (props) {
    super(props)
    this.state = {
      container: false
    }
  }
  componentDidUpdate () {
    if (this.props.stage === false) return false
    if (this.state.container === false) {
      this.state.container = new PIXI.Container()
      this.state.container.interactive = true
      this.state.container.buttonMode = true
      this.state.container.width = this.props.width
      this.state.container.height = this.props.height
      // button background
      let graphics = new PIXI.Graphics()
      graphics.lineStyle(4, 0xff00ff, 1)
      graphics.beginFill(0xff00bb, 0.25)
      graphics.drawRoundedRect(0, 0, this.props.width, this.props.height, 10)
      graphics.endFill()
      this.state.container.addChild(graphics)
      // events
      this.state.container.on('pointerdown', () => {
        this.props.onClick()
      })
      // global element
      this.state.container.x = this.props.x
      this.state.container.y = this.props.y
      this.props.stage.addChild(this.state.container)
    }
  }
  componentWillUnmount () {
    Reflux.Component.prototype.componentWillUnmount.call(this)
  }
  render () {
    return (null)
  }
}

Button.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired
}

export default Button
