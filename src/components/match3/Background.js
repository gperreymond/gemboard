/* eslint jsx-quotes: ["error", "prefer-double"] */

import PropTypes from 'prop-types'
import Reflux from 'reflux'
import Debug from 'debug'

import Store from '../../GameStore'

const debug = Debug('gemboard-game:Match3Background')
const PIXI = require('pixi.js')

class Background extends Reflux.Component {
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
    if (this.state.container === false && this.state.fight.campaign !== false) {
      console.log(this.state.fight.campaign)
      // container
      this.state.container = new PIXI.Container()
      this.state.container.visible = false
      this.state.container.id = this.props.id
      this.state.container.x = this.props.x
      this.state.container.y = this.props.y
      // background
      let texture = this.state.resources[this.state.fight.campaign.background].texture
      let sprite = new PIXI.Sprite(texture)
      sprite.x = 0
      sprite.y = 0
      sprite.width = this.state.config.GAME_WIDTH
      sprite.height = this.state.config.GAME_HEIGHT
      this.state.container.addChild(sprite)
      // stage
      this.state.stage.addChild(this.state.container)
    }
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

Background.propTypes = {
  id: PropTypes.string,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired
}

export default Background
