/* eslint jsx-quotes: ["error", "prefer-double"] */

import PropTypes from 'prop-types'
import React from 'react'
import Reflux from 'reflux'
import Debug from 'debug'

import Actions from '../../GameActions'
import Store from '../../GameStore'
import Troop from '../elements/Troop'

const debug = Debug('gemboard-game:Match3Player')
const PIXI = require('pixi.js')

class Player extends Reflux.Component {
  constructor (props) {
    debug('constructor')
    super(props)
    this.state = {
      container: false,
      arrow: false,
      arrowLabel: false,
      troops: false
    }
    this.store = Store
    Actions.createTroops.listen((e) => {
      if (this.props.computer === true) {
        this.state.troops = this.state.fight.campaign.troops
      }
    })
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
      // arrow label
      this.state.arrowLabel = new PIXI.Text(this.state.game.currentTurnNumber.toString(), {
        fill: '0xffffff',
        fontSize: 60
      })
      this.state.arrowLabel.id = this.props.id + 'Label'
      this.state.arrowLabel.visible = false
      this.state.arrowLabel.x = 0
      this.state.arrowLabel.y = this.state.arrow.y + 45
      this.state.container.addChild(this.state.arrowLabel)
      // end
      this.state.stage.addChild(this.state.container)
    } else {
      if (this.props.computer) {
        this.state.arrow.visible = !this.state.game.currentTurnPlayer
      } else {
        this.state.arrow.visible = this.state.game.currentTurnPlayer
      }
      this.state.arrowLabel.visible = this.state.arrow.visible
      this.state.arrowLabel.text = this.state.game.currentTurnNumber.toString()
      this.state.arrowLabel.x = this.state.arrow.x + (this.state.arrow.width - this.state.arrowLabel.width) / 2
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
    if (this.state.troops !== false) {
      return (
        <div>
          <Troop data={this.state.troops[0]} stage={this.state.container} x={0} y={0} />
          <Troop data={this.state.troops[1]} stage={this.state.container} x={0} y={250} />
          <Troop data={this.state.troops[3]} stage={this.state.container} x={0} y={500} />
          <Troop data={this.state.troops[3]} stage={this.state.container} x={0} y={750} />
        </div>
      )
    }
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
