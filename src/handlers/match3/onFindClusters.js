import Debug from 'debug'

import Actions from '../../GameActions'

const debug = Debug('gemboard-game:actions:onFindClusters')

const handler = (callback, context) => {
  if (!callback) debug('find clusters in the level')
  // Reset clusters
  context.state.game.clusters = []
  // Find horizontal clusters
  for (let j = 0; j < context.state.config.GAME_TILES; j++) {
    // Start with a single tile, cluster of 1
    let matchlength = 1
    for (let i = 0; i < context.state.config.GAME_TILES; i++) {
      let checkcluster = false
      if (i === context.state.config.GAME_TILES - 1) {
        // Last tile
        checkcluster = true
      } else {
        // Check the type of the next tile
        if (context.state.game.tiles[i][j].type === context.state.game.tiles[i + 1][j].type && context.state.game.tiles[i][j].type !== -1) {
          // Same type as the previous tile, increase matchlength
          matchlength += 1
        } else {
          // Different type
          checkcluster = true
        }
      }
      // Check if there was a cluster
      if (checkcluster) {
        if (matchlength >= 3) {
          // Found a horizontal cluster
          context.state.game.clusters.push({ column: i + 1 - matchlength, row: j, length: matchlength, horizontal: true })
        }
        matchlength = 1
      }
    }
  }
  // Find vertical clusters
  for (let i = 0; i < context.state.config.GAME_TILES; i++) {
    // Start with a single tile, cluster of 1
    let matchlength = 1
    for (let j = 0; j < context.state.config.GAME_TILES; j++) {
      let checkcluster = false
      if (j === context.state.config.GAME_TILES - 1) {
        // Last tile
        checkcluster = true
      } else {
        // Check the type of the next tile
        if (context.state.game.tiles[i][j].type === context.state.game.tiles[i][j + 1].type && context.state.game.tiles[i][j].type !== -1) {
          // Same type as the previous tile, increase matchlength
          matchlength += 1
        } else {
          // Different type
          checkcluster = true
        }
      }
      // Check if there was a cluster
      if (checkcluster) {
        if (matchlength >= 3) {
          // Found a vertical cluster
          context.state.game.clusters.push({ column: i, row: j + 1 - matchlength, length: matchlength, horizontal: false })
        }
        matchlength = 1
      }
    }
  }
  context.setState({
    game: context.state.game
  })
  if (callback) return callback()
  debug('clusters %o', context.state.game.clusters)
  if (context.state.game.clusters.length > 0) {
    Actions.removeClusters()
  } else {
    Actions.findMoves()
  }
}

export default handler
