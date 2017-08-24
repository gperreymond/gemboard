import Debug from 'debug'

import Actions from '../../GameActions'

const debug = Debug('gemboard-game:actions:onShiftTiles')

const swap = (context, x1, y1, x2, y2) => {
  let typeswap = context.state.game.tiles[x1][y1]
  context.state.game.tiles[x1][y1] = context.state.game.tiles[x2][y2]
  context.state.game.tiles[x2][y2] = typeswap
}

const handler = (context) => {
  debug('shift tiles and insert new tiles')
  // Shift tiles
  for (let i = 0; i < context.state.config.GAME_TILES; i++) {
    for (let j = context.state.config.GAME_TILES - 1; j >= 0; j--) {
      // Loop from bottom to top
      if (context.state.game.tiles[i][j].type === -1) {
        // Insert new random tile
        context.state.game.tiles[i][j].type = Math.floor(Math.random() * context.state.config.GAME_TILES_NAMES.length)
      } else {
        // Swap tile to shift it
        let shift = context.state.game.tiles[i][j].shift
        if (shift > 0) {
          swap(context, i, j, i, j + shift)
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
  Actions.resolveClusters()
}

export default handler
