import Debug from 'debug'

import Actions from '../../GameActions'

const debug = Debug('gemboard-game:actions:onMoveGems')

const swap = (context, x1, y1, x2, y2) => {
  let typeswap = context.state.game.tiles[x1][y1]
  debug(typeswap)
  context.state.game.tiles[x1][y1] = context.state.game.tiles[x2][y2]
  context.state.game.tiles[x2][y2] = typeswap
}

const handler = (gem, context) => {
  debug('targeted gem is %o', gem.props)
  let x1 = context.state.game.selectedGem.props.x
  let y1 = context.state.game.selectedGem.props.y
  let x2 = gem.props.x
  let y2 = gem.props.y
  let canSwap = false
  if ((Math.abs(x1 - x2) === 1 && y1 === y2) || (Math.abs(y1 - y2) === 1 && x1 === x2)) {
    canSwap = true
  }
  debug('can swap is %s', canSwap)
  context.state.game.selectedGem.state.container.scale.x = 1
  context.state.game.selectedGem.state.container.scale.y = 1
  context.state.game.selectedGem = false
  context.setState({
    game: context.state.game
  })
  if (canSwap === true) {
    swap(context, x1, y1, x2, y2)
    // Actions.findClusters()
  }
}

export default handler
