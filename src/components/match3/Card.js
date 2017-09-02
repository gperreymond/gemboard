/* eslint jsx-quotes: ["error", "prefer-double"] */

// import PropTypes from 'prop-types'
import Reflux from 'reflux'
import Debug from 'debug'

// import Actions from '../../GameActions'
import Store from '../../GameStore'

const debug = Debug('gemboard-game:Match3Card')
const PIXI = require('pixi.js')

class Card extends Reflux.Component {
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
    }
  }
  componentDidMount () {
    debug('componentDidMount')
  }
  componentWillUnmount () {
    debug('componentWillUnmount')
    Reflux.Component.prototype.componentWillUnmount.call(this)
  }
}

Card.propTypes = {
}

export default Card
