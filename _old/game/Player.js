// const Container = window.PIXI.Container
// const Sprite = window.PIXI.Sprite

class Player {
  constructor (options, context) {
    this._options = options
    this._context = context
  }
  getContainer () {
    return this._container
  }
}

export default Player
