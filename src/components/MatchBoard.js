/* eslint jsx-quotes: ["error", "prefer-double"] */

import PropTypes from 'prop-types'
import Reflux from 'reflux'

import Store from '../GameStore'

const PIXI = require('pixi.js')
const tilenames = ['tileBg001', 'tileBg002', 'tileBg003', 'tileBg004']

class MatchBoard extends Reflux.Component {
  constructor (props) {
    super(props)
    this.state = {
      container: false
    }
    this.store = Store
  }
  componentDidUpdate () {
    if (this.props.stage === false) return false
    if (this.state.container !== false) return false
    if (this.state.resources === false || this.state.resources === true) return false
    // ckecks done, time to create the element
    this.state.container = new PIXI.Container()
    for (let x = 0; x < this.state.config.GAME_TILES; x++) {
      for (let y = 0; y < this.state.config.GAME_TILES; y++) {
        let tilename = tilenames[Math.floor(Math.random() * tilenames.length)]
        let texture = this.state.resources[tilename].texture
        let sprite = new PIXI.Sprite(texture)
        sprite.width = 140
        sprite.height = 140
        sprite.x = x * 140
        sprite.y = y * 140
        sprite.width = 140
        sprite.height = 140
        this.state.container.addChild(sprite)
      }
    }
    this.state.container.visible = false
    this.state.container.x = this.props.x
    this.state.container.y = this.props.y
    this.props.stage.addChild(this.state.container)
  }
  componentWillUnmount () {
    Reflux.Component.prototype.componentWillUnmount.call(this)
  }
  render () {
    if (this.state.container === false) return (null)
    this.state.container.visible = this.state.currentState === 'STATE_FIGHTING'
    return (null)
  }
}

MatchBoard.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired
}

export default MatchBoard
