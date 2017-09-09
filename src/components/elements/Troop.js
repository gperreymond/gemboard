/* eslint jsx-quotes: ["error", "prefer-double"] */

import PropTypes from 'prop-types'
import Reflux from 'reflux'
import Debug from 'debug'

import Store from '../../GameStore'

const debug = Debug('gemboard-game:Troop')
const PIXI = require('pixi.js')

class Troop extends Reflux.Component {
  constructor (props) {
    debug('constructor')
    super(props)
    this.state = {
      container: false,
      card: false
    }
    this.store = Store
    this.getCardById = (id) => {
      let card = false
      this.state.cards.dataProvider.map(function (item) {
        if (item.id === id) card = item
      })
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
      this.state.card = this.getCardById(this.props.data.id)
      this.state.container = new PIXI.Container()
      this.state.container.visible = false
      // background
      let texture = this.state.resources[this.state.card.picture].texture
      let sprite = new PIXI.Sprite(texture)
      sprite.x = 0
      sprite.y = 0
      sprite.width = 250
      sprite.height = 250
      this.state.container.addChild(sprite)
      // end
      this.state.container.x = this.props.x + 40
      this.state.container.y = this.props.y + 40
      this.props.stage.addChild(this.state.container)
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
