/* eslint jsx-quotes: ["error", "prefer-double"] */

import PropTypes from 'prop-types'
import Reflux from 'reflux'

const PIXI = require('pixi.js')

class Text extends Reflux.Component {
  constructor (props) {
    super(props)
    this.state = {
      container: false
    }
  }
  componentDidUpdate (prevProps, prevState) {
    if (this.state.container === false) {
      this.state.container = new PIXI.Text(this.props.label, {
        fill: '0xffffff',
        fontSize: this.props.fontSize
      })
      this.state.container.id = this.props.id
      this.state.container.visible = false
      this.state.container.x = this.props.x
      this.state.container.y = this.props.y
      // if (this.props.visible) this.state.container.visible = this.props.visible
      this.props.stage.addChild(this.state.container)
    } else {
      // console.log(this.props.id, this.props.visible)
      this.state.container.text = this.props.label
      // if (this.props.visible) this.state.container.visible = this.props.visible
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
  id: PropTypes.string,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  visible: PropTypes.bool,
  fontSize: PropTypes.number.isRequired
}

export default Text
