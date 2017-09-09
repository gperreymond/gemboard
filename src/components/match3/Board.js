/* eslint jsx-quotes: ["error", "prefer-double"] */

import PropTypes from 'prop-types'
import Reflux from 'reflux'
import Debug from 'debug'

import Actions from '../../GameActions'
import Store from '../../GameStore'
import Gem from '../elements/Gem'

const debug = Debug('gemboard-game:Match3Board')
const PIXI = require('pixi.js')

class Board extends Reflux.Component {
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
      this.state.match.id = 'Match3Gems'
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
        const action = new PIXI.action.MoveTo(this.state.match.x, this.state.container.y, 0.5)
        const animation = PIXI.actionManager.runAction(this.state.match, action)
        animation.on('end', (elapsed) => {
          debug('gems board is ready for playing')
          Actions.createTroops()
        })
      }, 500)
    }
    this.setTeams = () => {

    }
    this.setBackground = () => {
      debug('set background')
      // background
      let colors = ['0xffffff', '0x000000']
      let currentColor = 0
      for (let x = 0; x < this.state.config.GAME_TILES; x++) {
        for (let y = 0; y < this.state.config.GAME_TILES; y++) {
          let graphics = new PIXI.Graphics()
          graphics.lineStyle(0, colors[currentColor], 1)
          graphics.beginFill(colors[currentColor], 0.1)
          graphics.drawRect(0, 0, 140, 140)
          graphics.endFill()
          graphics.x = x * 140
          graphics.y = y * 140
          this.state.container.addChild(graphics)
          currentColor === 0 ? currentColor = 1 : currentColor = 0
          if (y === this.state.config.GAME_TILES - 1) {
            currentColor === 0 ? currentColor = 1 : currentColor = 0
          }
        }
      }
      // borders
      let sprite = new PIXI.Sprite(this.state.resources['bordersMatch3'].texture)
      sprite.x = -32
      sprite.y = -34
      sprite.width = 1185
      sprite.height = 1185
      this.state.container.addChild(sprite)
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
      graphics.beginFill(0x44413a, 0.75)
      graphics.drawRect(0, 0, this.state.config.GAME_TILES * 140, this.state.config.GAME_TILES * 140)
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
    this.state.container.visible = this.state.currentState === 'STATE_FIGHTING'
    return (null)
  }
}

Board.propTypes = {
  id: PropTypes.string,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired
}

export default Board
