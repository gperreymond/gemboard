/* eslint jsx-quotes: ["error", "prefer-double"] */

import PropTypes from 'prop-types'
import Reflux from 'reflux'
import ee from 'event-emitter'
import uuid from 'uuid'

import Actions from '../../GameActions'

const PIXI = require('pixi.js')

class Gem extends Reflux.Component {
  constructor (props) {
    super(props)
    this.state = {
      container: false
    }
    this.on('resolve_explode', this.exploders)
    this.on('resolve_move', (shift) => {
      this.movers(shift)
    })
    this.on('resolve_create', (store) => {
      this.props.stage.removeChild(this.state.container)
      this.state.container = false
      let type = Math.floor(Math.random() * store.config.GAME_TILES_NAMES.length)
      this.props.type = type
      this.props.name = store.config.GAME_TILES_NAMES[type]
      this.props.color = store.config.GAME_TILES_COLORS[type]
      this.props.texture = store.resources[store.config.GAME_TILES_NAMES[type]].texture
      this.initialize(true)
    })
    this.initialize()
  }
  exploders () {
    setTimeout(() => {
      this.state.container.scale.x += 0.02
      this.state.container.scale.y += 0.02
      if (this.state.container.scale.x < 2) {
        return this.exploders()
      } else {
        this.state.container.visible = false
        this.emit('resolve_explode_complete')
      }
    }, 5)
  }
  movers (shift) {
    setTimeout(() => {
      shift -= 0.1
      this.state.container.y += 0.1 * 140
      if (shift > 0) {
        return this.movers(shift)
      } else {
        this.state.container.y = this.props.y * 140
        this.emit('resolve_move_complete')
      }
    }, 5)
  }
  creaters () {
    setTimeout(() => {
      this.state.container.scale.x += 0.02
      this.state.container.scale.y += 0.02
      if (this.state.container.scale.x < 1) {
        return this.creaters()
      } else {
        this.emit('resolve_create_complete')
      }
    }, 5)
  }
  initialize (emitter = false) {
    if (this.props.stage === false) return false
    if (this.state.container === false) {
      this.state.container = new PIXI.Container()
      this.state.container.uuid = uuid.v4()
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
      this.state.container.visible = true
      this.state.container.interactive = true
      this.state.container.buttonMode = true
      // events
      this.state.container.on('pointerdown', () => {
        Actions.selectGem(this)
      })
      this.state.container.on('pointerup', () => {
        Actions.moveGem(this)
      })
      if (emitter === true) {
        this.state.container.scale.x = 0
        this.state.container.scale.y = 0
        this.props.stage.addChild(this.state.container)
        this.creaters()
      } else {
        this.props.stage.addChild(this.state.container)
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

Gem.propTypes = {
  name: PropTypes.string.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  type: PropTypes.number.isRequired,
  shift: PropTypes.number.isRequired,
  color: PropTypes.number.isRequired,
  texture: PropTypes.object.isRequired
}

ee(Gem.prototype)

export default Gem
