/* eslint jsx-quotes: ["error", "prefer-double"] */

import PropTypes from 'prop-types'
import Reflux from 'reflux'
import Debug from 'debug'
import clone from 'lodash.clone'

import Store from '../../GameStore'

const debug = Debug('gemboard-game:Troop')
const PIXI = require('pixi.js')

const colors = {
  'commun': 0x0e6eaeb,
  'uncommun': 0x24b944,
  'rare': 0x1eafe5,
  'legendary': 0xe5a61e
}

class Troop extends Reflux.Component {
  constructor (props) {
    debug('constructor')
    super(props)
    this.state = {
      container: false,
      scoreAttack: false,
      scoreLife: false,
      scoreArmore: false,
      card: false
    }
    this.store = Store
    this.getCardById = (id) => {
      let card = false
      this.state.cards.dataProvider.map(function (item) {
        if (item.id === id) card = clone(item)
      })
      if (card === false) return false
      // card update
      debug('card loaded is %o', card)
      return card
    }
  }
  componentDidMount () {
    debug('componentDidMount id=%s', this.props.data.id)
  }
  componentWillUnmount () {
    Reflux.Component.prototype.componentWillUnmount.call(this)
  }
  componentDidUpdate (prevProps, prevState) {
    if (this.state.stage === false) return false
    if (this.state.container === false) {
      debug('componentDidUpdate id=%s', this.props.data.id)
      const iconSize = 80
      const fontSize = 60
      const iconPadding = 10
      const padding = 45
      let scale = (340 - 2 * padding) / 340
      this.state.card = this.getCardById(this.props.data.id)
      this.state.container = new PIXI.Container()
      this.state.container.visible = false
      // background
      let graphics = new PIXI.Graphics()
      graphics.lineStyle(20, colors[this.state.card.rarity], 1)
      graphics.beginFill(colors[this.state.card.rarity], 1)
      graphics.drawRect(0, 0, 340, 280)
      graphics.endFill()
      this.state.container.addChild(graphics)
      // picture
      let texture = this.state.resources[this.state.card.picture].texture
      let sprite = new PIXI.Sprite(texture)
      sprite.x = 0
      sprite.y = 0
      sprite.width = 340
      sprite.height = 220
      this.state.container.addChild(sprite)
      // borders
      graphics = new PIXI.Graphics()
      graphics.lineStyle(20, colors[this.state.card.rarity], 1)
      graphics.drawRect(0, 0, 340, 280)
      graphics.endFill()
      this.state.container.addChild(graphics)
      // icon attack
      texture = this.state.resources['iconAttack'].texture
      sprite = new PIXI.Sprite(texture)
      sprite.x = iconPadding
      sprite.y = 280 - iconSize - iconPadding
      sprite.width = iconSize
      sprite.height = iconSize
      this.state.container.addChild(sprite)
      // score attack
      this.state.scoreAttack = new PIXI.Text(this.state.card.attack, {
        fill: '#ffffff',
        fontSize,
        fontWeight: 'bold',
        stroke: '#333333',
        strokeThickness: 8,
        dropShadow: true,
        dropShadowColor: '#000000'
      })
      this.state.scoreAttack.x = iconPadding + (iconSize - this.state.scoreAttack.width) / 2
      this.state.scoreAttack.y = 280 - iconSize - iconPadding
      this.state.container.addChild(this.state.scoreAttack)
      // icon life
      texture = this.state.resources['iconLife'].texture
      sprite = new PIXI.Sprite(texture)
      sprite.x = 340 - iconSize - iconPadding
      sprite.y = 280 - iconSize - iconPadding
      sprite.width = iconSize
      sprite.height = iconSize
      this.state.container.addChild(sprite)
      // score life
      this.state.scoreLife = new PIXI.Text(this.state.card.life, {
        fill: '#ffffff',
        fontSize,
        fontWeight: 'bold',
        stroke: '#333333',
        strokeThickness: 8,
        dropShadow: true,
        dropShadowColor: '#000000'
      })
      this.state.scoreLife.x = 340 - iconSize - iconPadding + (iconSize - this.state.scoreLife.width) / 2
      this.state.scoreLife.y = 280 - iconSize - iconPadding
      this.state.container.addChild(this.state.scoreLife)
      // icon armor
      texture = this.state.resources['iconArmor'].texture
      sprite = new PIXI.Sprite(texture)
      sprite.x = 340 - iconSize - iconPadding
      sprite.y = 280 - 2 * iconSize - iconPadding
      sprite.width = iconSize
      sprite.height = iconSize
      this.state.container.addChild(sprite)
      // score armor
      this.state.scoreArmor = new PIXI.Text(this.state.card.armor, {
        fill: '#ffffff',
        fontSize,
        fontWeight: 'bold',
        stroke: '#333333',
        strokeThickness: 8,
        dropShadow: true,
        dropShadowColor: '#000000'
      })
      this.state.scoreArmor.x = 340 - iconSize - iconPadding + (iconSize - this.state.scoreArmor.width) / 2
      this.state.scoreArmor.y = 280 - 2 * iconSize - iconPadding
      this.state.container.addChild(this.state.scoreArmor)
      // end
      this.state.container.x = this.props.x + padding
      this.state.container.y = this.props.y + padding
      this.state.container.scale.x = scale
      this.state.container.scale.y = scale
      this.props.stage.addChildAt(this.state.container, 1)
    }
  }
  render () {
    if (this.state.container === false) return (null)
    this.state.container.visible = this.state.currentState === 'STATE_FIGHTING'
    return (null)
  }
}

Troop.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  data: PropTypes.object.isRequired,
  stage: PropTypes.object.isRequired
}

export default Troop
