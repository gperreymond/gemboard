/* eslint jsx-quotes: ["error", "prefer-double"] */

import PropTypes from 'prop-types'
import Reflux from 'reflux'
import Debug from 'debug'

import Actions from '../GameActions'
import Store from '../GameStore'
import Gem from './elements/Gem'

const debug = Debug('gemboard-game:StateFightingPvP')
const PIXI = require('pixi.js')

class StateFightingPvP extends Reflux.Component {
  constructor (props) {
    debug('constructor')
    super(props)
    this.state = {
      container: false,
      match: false
    }
    this.store = Store
    this.start = () => {
      debug('create the gems board')
      this.state.gems = []
      this.state.stage.removeChild(this.state.match)
      // create new
      this.state.match = new PIXI.Container()
      this.state.match.id = 'match3'
      this.state.match.x = this.props.x
      this.state.match.y = -2000
      // create tiles
      this.state.game.tiles.map((item) => {
        return item.map((tile) => {
          let gem = new Gem({x: tile.x, y: tile.y, type: tile.type, stage: this.state.match})
          return gem.componentDidUpdate()
        })
      })
      this.state.stage.addChild(this.state.match)
      debug('gems board arrival animation')
      setTimeout(() => {
        const action = new PIXI.action.MoveTo(this.state.match.x, 0, 0.5)
        const animation = PIXI.actionManager.runAction(this.state.match, action)
        animation.on('end', (elapsed) => {
          debug('gems board is ready for playing')
          debug(this.state.game.tiles)
        })
      }, 500)
    }
    this.setBackground = () => {
      for (let x = 0; x < this.state.config.GAME_TILES; x++) {
        for (let y = 0; y < this.state.config.GAME_TILES; y++) {
          let random = Math.floor(Math.random() * this.state.config['GAME_BGS_NAMES'].length)
          let name = this.state.config['GAME_BGS_NAMES'][random]
          let texture = this.state.resources[name].texture
          let sprite = new PIXI.Sprite(texture)
          sprite.width = 140
          sprite.height = 140
          sprite.x = x * 140
          sprite.y = y * 140
          this.state.container.addChild(sprite)
        }
      }
    }
  }
  componentDidMount () {
    debug('componentDidMount')
    Actions.createLevelComplete.listen((e) => {
      debug('action createLevelComplete has been emitted')
      this.setBackground()
      this.start()
    })
  }
  componentDidUpdate (prevProps, prevState) {
    if (this.state.container === false) {
      this.state.container = new PIXI.Container()
      this.state.container.id = this.props.id
      this.state.container.visible = false
      this.state.container.x = this.props.x
      this.state.container.y = this.props.y
      // background
      let graphics = new PIXI.Graphics()
      graphics.beginFill(0x001a33, 0.75)
      graphics.drawRoundedRect(0, 0, this.state.config.GAME_TILES * 140, this.state.config.GAME_TILES * 140, 0)
      graphics.endFill()
      this.state.container.addChild(graphics)
      this.state.stage.addChild(this.state.container)
    }
  }
  componentWillUnmount () {
    debug('componentWillUnmount')
    Reflux.Component.prototype.componentWillUnmount.call(this)
  }
  render () {
    if (this.state.container === false) return (null)
    if (this.state.game.tiles === false) return (null)
    this.state.container.visible = this.state.currentState === 'STATE_FIGHTING_PVP'
    return (null)
  }
}

StateFightingPvP.propTypes = {
  id: PropTypes.string,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired
}

export default StateFightingPvP
