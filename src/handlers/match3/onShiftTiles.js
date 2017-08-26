import clone from 'lodash.clone'
import Debug from 'debug'

import Actions from '../../GameActions'

const debug = Debug('gemboard-game:actions:onShiftTiles')

const swap = (context, x1, y1, x2, y2) => {
  let source = clone(context.state.game.tiles[x1][y1])
  let target = clone(context.state.game.tiles[x2][y2])
  context.state.game.tiles[x1][y1].type = target.type
  context.state.game.tiles[x1][y1].inserted = target.inserted || false
  if (context.state.game.tiles[x1][y1].inserted === false) delete context.state.game.tiles[x1][y1].inserted
  context.state.game.tiles[x2][y2].type = source.type
  context.state.game.tiles[x2][y2].inserted = source.inserted || false
  if (context.state.game.tiles[x2][y2].inserted === false) delete context.state.game.tiles[x2][y2].inserted
}

const handler = (callback, context) => {
  debug('shift tiles and insert new tiles')
  // Shift tiles
  for (let i = 0; i < context.state.config.GAME_TILES; i++) {
    for (let j = context.state.config.GAME_TILES - 1; j >= 0; j--) {
      // Loop from bottom to top
      if (context.state.game.tiles[i][j].type === -1) {
        // Insert new random tile
        debug('... insert new random tile in (%s:%s)', i, j)
        context.state.game.tiles[i][j] = {
          x: i,
          y: j,
          type: Math.floor(Math.random() * context.state.config.GAME_TILES_NAMES.length),
          inserted: true
        }
        context.state.game.animations.create.push(context.state.game.tiles[i][j])
      } else {
        // Swap tile to shift it
        let shift = context.state.game.tiles[i][j].shift
        if (shift > 0) {
          debug('... swap tile to shift it')
          swap(context, i, j, i, j + shift)
          context.state.game.animations.move.push({x: i, y: j, shift})
        }
      }
      // Reset shift
      context.state.game.tiles[i][j].shift = 0
    }
  }
  debug('shift tiles done')
  context.setState({
    game: context.state.game
  })
  if (callback) return callback()
  Actions.resolveClusters()
}

export default handler
