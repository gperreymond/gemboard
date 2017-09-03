import Debug from 'debug'

const debug = Debug('gemboard-game:actions:onCreateGems')

const handler = (context) => {
  debug('animations create start')
  context.setState({
    game: context.state.game
  })
  let match3 = false
  context.state.stage.children.map((child) => {
    if (child.id === 'Match3Gems') match3 = child
  })
  for (let col = 0; col < context.state.config.GAME_TILES; col++) {
    for (let row = 0; row < context.state.config.GAME_TILES; row++) {
      if (context.state.game.tiles[col][row].inserted === true) {
        delete context.state.game.tiles[col][row].inserted
        debug('... tile is %s in (%s:%s)', context.state.game.tiles[col][row].type, context.state.game.tiles[col][row].x, context.state.game.tiles[col][row].y)
        let use = false
        context.state.game.animations.create.map((item) => {
          match3.children.map((child) => {
            if (child.visible === false && use === false) {
              use = true
              debug('... create gem %s in (%s:%s)', context.state.game.tiles[col][row].type, col, row)
              child.emit('animation_create', {x: col, y: row, type: context.state.game.tiles[col][row].type})
              context.setState({
                game: context.state.game
              })
            }
          })
        })
      }
    }
  }
}

export default handler
