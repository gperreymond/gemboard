import uuid from 'uuid'
import ee from 'event-emitter'

require('pixi.js/dist/pixi.min.js')
const Container = window.PIXI.Container
const Sprite = window.PIXI.Sprite
const Graphics = window.PIXI.Graphics

class GemButton {
  constructor (options) { // x, y, context
    this.uuid = uuid.v4()
    this.x = -1
    this.y = -1
    this._name = options.texture.textureCacheIds[0]
    this._container = new Container()
    this._container.uuid = this.uuid
    // circle colors
    this._graphics = new Graphics()
    this._graphics.lineStyle(0)
    this._graphics.beginFill(options.color, 0.5)
    this._graphics.drawCircle(0, 0, 40)
    this._graphics.endFill()
    this._graphics.blendMode = 0
    // gem icons
    this._sprite = new Sprite(options.texture)
    this._sprite.width = 80
    this._sprite.height = 80
    this._sprite.anchor.set(0.5, 0.5)
    // the button
    this._container.addChild(this._sprite)
    this._container.addChild(this._graphics)
    this._container.interactive = true
    this._container.buttonMode = true
    this._isDown = false
  }
  explode () {
    setTimeout(() => {
      this._container.scale.x -= 0.02
      if (this._container.scale.x > 0) {
        return this.explode()
      } else {
        this.emit('animation_explode_done')
      }
    }, 5)
  }
  move (shift) {
    if (!shift) {
      this._container.x = this.x * 100 + 50
      this._container.y = this.y * 100 + 50
    } else {
      let _shift = shift - 0.02
      this.y += 0.02
      this._container.y = this.y * 100 + 50
      if (_shift <= 0) {
        this.emit('animation_move_done')
        this.y = Math.round(this.y)
      } else {
        setTimeout(() => {
          this.move(_shift)
        }, 5)
      }
    }
  }
  unselect () {
    this._isDown = false
    this._container.scale.x = 1
    this._container.scale.y = 1
  }
  select () {
    console.log('gem seleced', this)
    this._isDown = true
    this._container.scale.x = 1.25
    this._container.scale.y = 1.25
  }
  isDown () {
    return this._isDown
  }
  getContainer () {
    return this._container
  }
}

ee(GemButton.prototype)

export default GemButton
