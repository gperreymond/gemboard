import Debug from 'debug'

import Actions from '../../GameActions'

const debug = Debug('gemboard-game:actions:onRemoveClusters')

/**
Loop over the cluster tiles and execute a function
**/
const loopClusters = (context, func) => {
  for (let i = 0; i < context.state.game.clusters.length; i++) {
    //  { column, row, length, horizontal }
    let cluster = context.state.game.clusters[i]
    let coffset = 0
    let roffset = 0
    for (let j = 0; j < cluster.length; j++) {
      func(i, cluster.column + coffset, cluster.row + roffset, cluster)
      if (cluster.horizontal) {
        coffset++
      } else {
        roffset++
      }
    }
  }
}

const handler = (callback, context) => {
  debug('remove the clusters')
  // Change the type of the tiles to -1, indicating a removed tile
  loopClusters(context, (index, col, row, cluster) => {
    context.state.game.tiles[col][row].type = -1
    context.state.game.animations.explode.push({x: col, y: row})
    context.setState({
      game: context.state.game
    })
  })
  // Calculate how much a tile should be shifted downwards
  for (let i = 0; i < context.state.config.GAME_TILES; i++) {
    let shift = 0
    for (let j = context.state.config.GAME_TILES - 1; j >= 0; j--) {
      // Loop from bottom to top
      if (context.state.game.tiles[i][j].type === -1) {
        // Tile is removed, increase shift
        shift++
        context.state.game.tiles[i][j].shift = 0
      } else {
        // Set the shift
        context.state.game.tiles[i][j].shift = shift
      }
    }
  }
  context.setState({
    game: context.state.game
  })
  if (callback) return callback()
  Actions.shiftTiles()
}

export default handler
