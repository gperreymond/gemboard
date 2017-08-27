import clone from 'lodash.clone'
import Debug from 'debug'

import Actions from '../../GameActions'

const debug = Debug('gemboard-game:actions:onFindMoves')

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
  debug('search and find moves in the tiles')
  // Reset moves
  context.state.game.moves = []
  // Check horizontal swaps
  debug('check horizontal swaps')
  for (let j = 0; j < context.state.config.GAME_TILES; j++) {
    for (let i = 0; i < context.state.config.GAME_TILES - 1; i++) {
      // Swap, find clusters and swap back
      swap(context, i, j, i + 1, j)
      Actions.findClusters(() => {
        swap(context, i, j, i + 1, j)
        // Check if the swap made a cluster
        if (context.state.game.clusters.length > 0) {
          // Found a move
          debug('... found a move')
          context.state.game.moves.push({column1: i, row1: j, column2: i + 1, row2: j})
          context.setState({
            game: context.state.game
          })
        }
      })
    }
  }
  // Check vertical swaps
  debug('check vertical swaps')
  for (let i = 0; i < context.state.config.GAME_TILES; i++) {
    for (let j = 0; j < context.state.config.GAME_TILES - 1; j++) {
      // Swap, find clusters and swap back
      swap(context, i, j, i, j + 1)
      Actions.findClusters(() => {
        swap(context, i, j, i, j + 1)
        // Check if the swap made a cluster
        if (context.state.game.clusters.length > 0) {
          // Found a move
          debug('... found a move')
          context.state.game.moves.push({column1: i, row1: j, column2: i, row2: j + 1})
          context.setState({
            game: context.state.game
          })
        }
      })
    }
  }
  // Reset clusters
  debug('reset clusters')
  context.state.game.clusters = []
  context.setState({
    game: context.state.game
  })
  debug('moves %o', context.state.game.moves)
  if (callback) return callback()
  if (context.state.game.moves.length > 0) {
    Actions.createLevelComplete()
  } else {
    Actions.createLevel()
  }
}

export default handler
