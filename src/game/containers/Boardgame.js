const Container = window.PIXI.Container
const Graphics = window.PIXI.Graphics
const Sprite = window.PIXI.Sprite
const Text = window.PIXI.Text
const TextStyle = window.PIXI.TextStyle

const tilenames = ['tileBg001', 'tileBg002', 'tileBg003', 'tileBg004']

/**
PROPERTIES
@context: react global store
**/

/**
METHODS
@initialize: create the party to play
**/

class Boardgame {
  constructor (context) {
    this._context = context
    this._container = false
    this.initialize()
  }
  initialize () {
    const game = this._context.state.game
    this._container = new Container()
    this._container.x = 0
    this._container.y = 0
    this._container.width = game.GAME_WIDTH
    this._container.height = game.GAME_HEIGHT
    // match3 background
    let container = new Container()
    container.width = game.BOARD_SIZE * 140
    container.height = game.BOARD_SIZE * 140
    container.x = (game.GAME_WIDTH - game.BOARD_SIZE * 140) / 2
    container.y = 0
    for (let x = 0; x < game.BOARD_SIZE; x++) {
      for (let y = 0; y < game.BOARD_SIZE; y++) {
        let tilename = tilenames[Math.floor(Math.random() * tilenames.length)]
        let texture = game.resources[tilename].texture
        let sprite = new Sprite(texture)
        sprite.width = 140
        sprite.height = 140
        sprite.x = x * 140
        sprite.y = y * 140
        sprite.width = 140
        sprite.height = 140
        container.addChild(sprite)
      }
    }
    this._container.addChild(container)
    // player background
    let graphics = new Graphics()
    graphics.lineStyle(6, 0x1a1b23, 1)
    graphics.beginFill(0x454f66, 0.5)
    graphics.moveTo(0, 0)
    graphics.lineTo(250 - 12, 0)
    graphics.lineTo(250 - 12, (game.BOARD_SIZE * 140) / 4)
    graphics.lineTo(0, (game.BOARD_SIZE * 140) / 4)
    graphics.lineTo(0, 0)
    graphics.x = 6
    graphics.y = 6
    this._container.addChild(graphics)
    // player name
    game.player.score.style.normal = new TextStyle({fill: 0xffffff, fontSize: 50})
    game.player.score.style.selected = new TextStyle({fill: 0x008900, fontSize: 50})
    game.player.score.pixi = new Text('(0)', game.player.score.style.selected)
    game.player.score.pixi.x = graphics.x
    game.player.score.pixi.y = 0
    this._container.addChild(game.player.score.pixi)
    // computer background
    graphics = new Graphics()
    graphics.lineStyle(6, 0x1a1b23, 1)
    graphics.beginFill(0x454f66, 0.5)
    graphics.moveTo(0, 0)
    graphics.lineTo(250 - 12, 0)
    graphics.lineTo(250 - 12, (game.BOARD_SIZE * 140) / 4)
    graphics.lineTo(0, (game.BOARD_SIZE * 140) / 4)
    graphics.lineTo(0, 0)
    graphics.x = game.GAME_WIDTH - 250 + 6
    graphics.y = 6
    this._container.addChild(graphics)
    // computer score
    game.computer.score.style.normal = new TextStyle({fill: 0xffffff, fontSize: 50})
    game.computer.score.style.selected = new TextStyle({fill: 0x008900, fontSize: 50})
    game.computer.score.pixi = new Text('(0)', game.computer.score.style.normal)
    game.computer.score.pixi.x = graphics.x
    game.computer.score.pixi.y = 0
    this._container.addChild(game.computer.score.pixi)
    console.log(game.computer.score.pixi)
  }
  getContainer () {
    return this._container
  }
}

export default Boardgame
