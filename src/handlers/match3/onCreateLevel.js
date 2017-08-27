import Debug from 'debug'

import Actions from '../../GameActions'

const debug = Debug('gemboard-game:actions:onCreateLevel')

const handler = (currentState, context) => {
  debug('create a level with random tiles')
  context.state.game = {
    currentState: false,
    music: false,
    tiles: [],
    clusters: [],
    moves: [],
    animations: {
      explode: [],
      move: [],
      create: []
    },
    selectedGem: false,
    score: {
      extraTurn: false,
      consecutiveKills: 1
    }
  }
  debug(currentState)
  for (let col = 0; col < context.state.config.GAME_TILES; col++) {
    context.state.game.tiles[col] = []
    for (let row = 0; row < context.state.config.GAME_TILES; row++) {
      context.state.game.tiles[col][row] = {
        x: col,
        y: row,
        type: Math.floor(Math.random() * context.state.config.GAME_TILES_NAMES.length)
      }
    }
  }
  context.state.game.currentState = currentState
  context.setState({
    game: context.state.game,
    currentState
  })
  Actions.resolveClusters()
}

export default handler
