/* eslint jsx-quotes: ["error", "prefer-double"] */

import PropTypes from 'prop-types'
import Reflux from 'reflux'

const PIXI = require('pixi.js')

class Text extends Reflux.Component {
  constructor (props) {
    super(props)
    this.state = {
      element: false
    }
  }
  componentDidUpdate () {
    if (this.props.stage === false) return false
    if (this.state.element === false) {
      // ckecks done, time to create the element
      this.state.element = new PIXI.Text(this.props.text, {
        fill: '0xffffff',
        fontSize: this.props.fontSize
      })
      this.state.element.x = this.props.x
      this.state.element.y = this.props.y
      this.props.stage.addChild(this.state.element)
    } else {
      this.state.element.text = this.props.text
    }
  }
  componentWillUnmount () {
    Reflux.Component.prototype.componentWillUnmount.call(this)
  }
  render () {
    return (null)
  }
}

Text.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
  fontSize: PropTypes.number.isRequired
}

export default Text
