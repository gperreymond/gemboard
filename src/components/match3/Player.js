/* eslint jsx-quotes: ["error", "prefer-double"] */

import PropTypes from 'prop-types'
import Reflux from 'reflux'
import Debug from 'debug'

// import Actions from '../../GameActions'
import Store from '../../GameStore'
// import Card from '../elements/Card'

const debug = Debug('gemboard-game:Match3Player')
const PIXI = require('pixi.js')

class Player extends Reflux.Component {
  constructor (props) {
    debug('constructor')
    super(props)
    this.state = {
      container: false,
      arrow: false
    }
    this.store = Store
  }
  componentDidUpdate (prevProps, prevState) {
    if (this.state.container === false) {
      this.state.container = new PIXI.Container()
      this.state.container.visible = false
      this.state.container.id = this.props.id
      this.state.container.x = this.props.x
      this.state.container.y = this.props.y
      // background
      let graphics = new PIXI.Graphics()
      graphics.lineStyle(0, 0x44413a, 1)
      graphics.beginFill(0x44413a, 0.75)
      graphics.drawRect(0, 0, 340, this.state.config.GAME_TILES * 140)
      graphics.endFill()
      this.state.container.addChild(graphics)
      // borders
      let sprite = new PIXI.Sprite(this.state.resources['playerMatch3'].texture)
      sprite.x = 0
      sprite.y = 0
      sprite.width = 340
      sprite.height = 1120
      this.state.container.addChild(sprite)
      // arrow
      this.state.arrow = new PIXI.Sprite(this.state.resources['arrowMatch3'].texture)
      this.state.arrow.x = (340 - 132) / 2
      this.state.arrow.y = -1 * (155 / 2)
      this.state.container.addChild(this.state.arrow)
      // end
      this.state.stage.addChild(this.state.container)
    } else {
      if (this.props.computer) {
        this.state.arrow.visible = !this.state.game.currentTurnPlayer
      } else {
        this.state.arrow.visible = this.state.game.currentTurnPlayer
      }
    }
  }
  componentDidMount () {
    debug('componentDidMount')
  }
  componentWillUnmount () {
    debug('componentWillUnmount')
    Reflux.Component.prototype.componentWillUnmount.call(this)
  }
  render () {
    if (this.state.container === false) return (null)
    if (this.state.game.tiles === false) return (null)
    this.state.container.visible = this.state.currentState === 'STATE_FIGHTING'
    return (null)
  }
}

Player.propTypes = {
  id: PropTypes.string,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  computer: PropTypes.bool.isRequired
}

export default Player
