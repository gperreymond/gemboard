/* eslint jsx-quotes: ["error", "prefer-double"] */

import PropTypes from 'prop-types'
import Reflux from 'reflux'

const PIXI = require('pixi.js')

class Gem extends Reflux.Component {
  constructor (props) {
    super(props)
    this.state = {
      container: false
    }
    this.componentDidUpdate()
  }
  componentDidUpdate () {
    if (this.props.stage === false) return false
    if (this.state.container === false) {
      this.state.container = new PIXI.Container()
      // background
      let graphics = new PIXI.Graphics()
      graphics.lineStyle(0)
      graphics.beginFill(0xffffff, 0)
      graphics.drawCircle(0, 0, 70)
      graphics.endFill()
      this.state.container.addChild(graphics)
      // gem icons
      let sprite = new PIXI.Sprite(this.props.texture)
      sprite.width = 120
      sprite.height = 120
      sprite.anchor.set(0.5, 0.5)
      this.state.container.addChild(sprite)
      // circle colors
      graphics = new PIXI.Graphics()
      graphics.lineStyle(0)
      graphics.beginFill(this.props.color, 0.5)
      graphics.drawCircle(0, 0, 50)
      graphics.endFill()
      graphics.blendMode = 0
      this.state.container.addChild(graphics)
      // container
      this.state.container.x = this.props.x * 140
      this.state.container.y = this.props.y * 140
      this.state.container.interactive = true
      this.state.container.buttonMode = true
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

Gem.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  type: PropTypes.number.isRequired,
  shift: PropTypes.number.isRequired,
  color: PropTypes.number.isRequired,
  texture: PropTypes.object.isRequired
}

export default Gem
