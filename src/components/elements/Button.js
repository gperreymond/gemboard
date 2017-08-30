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
  componentDidUpdate (prevProps, prevState) {
    if (this.state.container === false) {
      this.state.container = new PIXI.Container()
      this.state.container.id = this.props.id
      this.state.container.width = this.props.width
      this.state.container.height = this.props.height
      // background
      let graphics = new PIXI.Graphics()
      graphics.beginFill(0x262626, 1)
      graphics.lineStyle(8, 0x0e6eaeb, 1)
      graphics.drawRoundedRect(0, 0, this.props.width, this.props.height, 16)
      graphics.endFill()
      this.state.container.addChild(graphics)
      // button or not ?
      if (this.props.onClick) {
        this.state.container.interactive = true
        this.state.container.buttonMode = true
        this.state.container.on('pointerdown', () => {
          this.props.onClick()
        })
      }
      // global element
      this.state.container.visible = this.props.visible || true
      this.state.container.x = this.props.x
      this.state.container.y = this.props.y
      this.props.stage.addChild(this.state.container)
    } else {
      if (this.props.visible === undefined) {
        this.state.container.visible = true
      } else {
        this.state.container.visible = this.props.visible
      }
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
  id: PropTypes.string,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  visible: PropTypes.bool,
  onClick: PropTypes.func
}

export default Button
