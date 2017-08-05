require('pixi.js/dist/pixi.min.js')
const Container = window.PIXI.Container
const Sprite = window.PIXI.Sprite

class Playground {
  constructor (options, context) {
    this._options = options
    this._context = context
  }
  initialize () {
    this._container = new Container()
    this._container.x = 0
    this._container.y = 0
    this._container.width = 800
    this._container.height = 800
    const TILE_A = 'tile4X4001'
    const TILE_B = 'tile4X4001'
    let tileName = TILE_A
    for (let x = 0; x < 8 / this._options.size; x++) {
      tileName === TILE_A ? tileName = TILE_B : tileName = TILE_A
      for (let y = 0; y < 8 / this._options.size; y++) {
        tileName === TILE_A ? tileName = TILE_B : tileName = TILE_A
        let texture = this._context.state.game.resources[tileName].texture
        let sprite = new Sprite(texture)
        sprite.alpha = 0.5
        sprite.width = 100
        sprite.height = 100
        sprite.x = x * 100 * this._options.size
        sprite.y = y * 100 * this._options.size
        sprite.width = 100 * this._options.size
        sprite.height = 100 * this._options.size
        this._container.addChild(sprite)
      }
    }
  }
  getContainer () {
    return this._container
  }
}

export default Playground
