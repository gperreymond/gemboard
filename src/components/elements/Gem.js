import Reflux from 'reflux'

const PIXI = require('pixi.js')

const Actions = require('../../GameActions').default
const Store = require('../../GameStore').default

class Gem extends Reflux.Component {
  constructor (props) {
    super(props)
    this.state = {
      container: false
    }
    this.store = Store.singleton.state
  }
  componentDidUpdate (prevProps, prevState) {
    if (this.state.container === false) {
      // container
      this.state.container = new PIXI.Container()
      this.state.container.width = 140
      this.state.container.height = 140
      this.state.container.interactive = true
      this.state.container.buttonMode = true
      // background
      let graphics = new PIXI.Graphics()
      graphics.lineStyle(0)
      graphics.beginFill(0xffffff, 0)
      graphics.drawCircle(0, 0, 70)
      graphics.endFill()
      this.state.container.addChild(graphics)
      // gem icons
      let sprite = new PIXI.Sprite(this.store.resources[this.store.config.GAME_TILES_NAMES[this.props.type]].texture)
      sprite.width = 120
      sprite.height = 120
      sprite.anchor.set(0.5, 0.5)
      this.state.container.addChild(sprite)
      // circle colors
      graphics = new PIXI.Graphics()
      graphics.lineStyle(0)
      graphics.beginFill(this.store.config.GAME_TILES_COLORS[this.props.type], 0.5)
      graphics.drawCircle(0, 0, 50)
      graphics.endFill()
      graphics.blendMode = 0
      this.state.container.addChild(graphics)
      // end
      this.state.container.x = this.props.x * 140 + 70
      this.state.container.y = this.props.y * 140 + 70
      this.props.stage.addChild(this.state.container)
      // events
      this.state.container.on('pointerdown', () => {
        Actions.selectGem(this)
      })
      this.state.container.on('pointerup', () => {
        if (!this.store.game.selectedGem) return false
        if (this.store.game.selectedGem === false) return false
        Actions.moveGems(this)
      })
    }
  }
  componentWillUnmount () {
    Reflux.Component.prototype.componentWillUnmount.call(this)
  }
  render () {
    return (null)
  }
}

export default Gem
