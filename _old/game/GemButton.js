const Container = window.PIXI.Container
const Sprite = window.PIXI.Sprite
const Graphics = window.PIXI.Graphics

class GemButton {
  constructor (options) {
    this._name = options.texture.textureCacheIds[0]
    this._container = new Container()
    // background
    let bg = new Graphics()
    bg.lineStyle(0)
    bg.beginFill(0xffffff, 0)
    bg.drawCircle(0, 0, 70)
    bg.endFill()
    // circle colors
    this._graphics = new Graphics()
    this._graphics.lineStyle(0)
    this._graphics.beginFill(options.color, 0.5)
    this._graphics.drawCircle(0, 0, 50)
    this._graphics.endFill()
    this._graphics.blendMode = 0
    // gem icons
    this._sprite = new Sprite(options.texture)
    this._sprite.width = 120
    this._sprite.height = 120
    this._sprite.anchor.set(0.5, 0.5)
    // the button
    this._container.addChild(this._sprite)
    this._container.addChild(this._graphics)
    this._container.addChild(bg)
    this._container.interactive = true
    this._container.buttonMode = true
    this._isDown = false
  }
  unselect () {
    this._container.dragging = false
    this._isDown = false
    this._container.scale.x = 1
    this._container.scale.y = 1
  }
  select () {
    this._container.dragging = true
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
  getGemSprite () {
    return this._container.children[0]
  }
}

export default GemButton
