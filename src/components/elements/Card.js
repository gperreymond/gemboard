/* eslint jsx-quotes: ["error", "prefer-double"] */

// import PropTypes from 'prop-types'
import Reflux from 'reflux'

// const Actions = require('../../GameActions').default
const Store = require('../../GameStore').default

const PIXI = require('pixi.js')

class Card extends Reflux.Component {
  constructor (props) {
    super(props)
    this.state = {
      container: false
    }
    this.store = Store.singleton.state
  }
  componentDidUpdate (prevProps, prevState) {
    if (this.state.container === false) {
      this.state.container = new PIXI.Container()
    }
  }
  componentDidMount () {
  }
  componentWillUnmount () {
    Reflux.Component.prototype.componentWillUnmount.call(this)
  }
  render () {
    return (null)
  }
}

Card.propTypes = {
}

export default Card
