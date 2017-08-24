/* eslint jsx-quotes: ["error", "prefer-double"] */

import PropTypes from 'prop-types'
import Reflux from 'reflux'
import Debug from 'debug'

import Actions from '../GameActions'
import Store from '../GameStore'

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
      debug('start()')
      this.state.stage.removeChild(this.state.match)
      // create new
      this.state.match = new PIXI.Container()
      this.state.match.id = 'match3'
      this.state.match.visible = false
      this.state.match.x = this.props.x
      this.state.match.y = -1000
      // create tiles
      this.state.game.tiles.map((item) => {
        item.map((tile) => {
          let color = this.state.config.GAME_TILES_COLORS[tile.type]
          let graphics = new PIXI.Graphics()
          graphics.beginFill(color, 1)
          graphics.drawRoundedRect(tile.x * 140, tile.y * 140, 140, 140, 10)
          graphics.endFill()
          this.state.match.addChild(graphics)
          return true
        })
        return true
      })
      this.state.stage.addChild(this.state.match)
      debug('show()')
      this.show()
    }
    this.show = () => {
      if (this.state.match.y === 0) return false
      this.state.match.visible = true
      setTimeout(() => {
        this.state.match.y += 10
        if (this.state.match.y < 0) {
          this.show()
        } else {
          this.state.match.y = 0
          debug('show() done')
        }
      }, 5)
    }
  }
  componentDidMount () {
    debug('componentDidMount')
    Actions.createLevelComplete.listen((e) => {
      debug('createLevelComplete()')
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
