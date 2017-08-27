import Reflux from 'reflux'
import remove from 'lodash.remove'

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
  componentDidUpdate (visible = true) {
    if (this.state.container === false) {
      // container
      this.state.container = new PIXI.Container()
      this.state.container.visible = visible
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
      this.state.container.on('animation_explode', (item) => {
        const action = new PIXI.action.ScaleTo(0, 0, 0.2)
        const animation = PIXI.actionManager.runAction(this.state.container, action)
        animation.on('end', () => {
          remove(this.store.game.animations.explode, item)
          this.state.container.visible = false
          if (this.store.game.animations.explode.length === 0) {
            if (this.store.game.animations.move.length === 0) {
              Actions.createGems()
            } else {
              Actions.moveDownGems()
            }
          }
        })
      })
      this.state.container.on('animation_move', (item) => {
        const action = new PIXI.action.MoveTo(item.x * 140 + 70, (item.y + item.shift) * 140 + 70, 0.2)
        const animation = PIXI.actionManager.runAction(this.state.container, action)
        animation.on('end', () => {
          this.props.x = item.x
          this.props.y = item.y + item.shift
          remove(this.store.game.animations.move, item)
          if (this.store.game.animations.move.length === 0) {
            Actions.createGems()
          }
        })
      })
      this.state.container.on('animation_create', (item) => {
        this.props.x = item.x
        this.props.y = item.y
        this.props.type = item.type
        this.state.container.destroy()
        this.state.container = false
        this.componentDidUpdate(false)
      })
      // animation when created
      if (this.state.container.visible === false) {
        this.state.container.scale.x = 0
        this.state.container.scale.y = 0
        this.state.container.visible = true
        const action = new PIXI.action.ScaleTo(1, 1, 0.2)
        const animation = PIXI.actionManager.runAction(this.state.container, action)
        animation.on('end', () => {
          if (this.store.game.animations.create.length === 0) {
            Actions.animationsDone()
          }
        })
      }
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
