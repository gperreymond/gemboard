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
      container: false
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
      graphics.lineStyle(0, 0xaaaaaa, 1)
      graphics.beginFill(0xaaaaaa, 0.75)
      graphics.drawRect(0, 0, 340, this.state.config.GAME_TILES * 140)
      graphics.endFill()
      this.state.container.addChild(graphics)
      this.state.stage.addChild(this.state.container)
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
