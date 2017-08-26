import Debug from 'debug'

import Actions from '../../GameActions'

const PIXI = require('pixi.js')
const debug = Debug('gemboard-game:actions:onMoveGems')

const swap = (context, x1, y1, x2, y2) => {
  let typeswap = context.state.game.tiles[x1][y1]
  context.state.game.tiles[x1][y1] = context.state.game.tiles[x2][y2]
  context.state.game.tiles[x2][y2] = typeswap
}

const handler = (gem, context) => {
  if (!context.state.game.selectedGem) return false
  if (context.state.game.selectedGem === false) return false
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
  if (canSwap === false) {
    debug('swap is impossible')
    const action = new PIXI.action.ScaleTo(1, 1, 0.1)
    const animation = PIXI.actionManager.runAction(context.state.game.selectedGem.state.container, action)
    animation.on('end', () => {
      context.state.game.selectedGem = false
      context.setState({
        game: context.state.game
      })
    })
  } else {
    debug('swap could be done')
    swap(context, x1, y1, x2, y2)
    Actions.findClusters(() => {
      debug('clusters %o', context.state.game.clusters)
      if (context.state.game.clusters.length === 0) {
        debug('move is unauthorized')
        swap(context, x2, y2, x1, y1)
        const action = new PIXI.action.ScaleTo(1, 1, 0.1)
        const animation = PIXI.actionManager.runAction(context.state.game.selectedGem.state.container, action)
        animation.on('end', () => {
          context.state.game.selectedGem = false
          context.setState({
            game: context.state.game
          })
        })
      } else {
        debug('move could be done')
        const action = new PIXI.action.ScaleTo(1, 1, 0.1)
        const animation = PIXI.actionManager.runAction(context.state.game.selectedGem.state.container, action)
        animation.on('end', () => {
          const action1 = new PIXI.action.MoveTo(x1 * 140 + 70, y1 * 140 + 70, 0.1)
          const action2 = new PIXI.action.MoveTo(x2 * 140 + 70, y2 * 140 + 70, 0.1)
          PIXI.actionManager.runAction(gem.state.container, action1)
          const animation = PIXI.actionManager.runAction(context.state.game.selectedGem.state.container, action2)
          animation.on('end', () => {
            gem.props.x = x1
            gem.props.y = y1
            context.state.game.selectedGem.props.x = x2
            context.state.game.selectedGem.props.y = y2
            context.state.game.selectedGem = false
            context.setState({
              game: context.state.game
            })
            debug('swap animations completed')
            Actions.removeClusters(() => {
              debug('clusters has been removed')
            })
          })
        })
      }
    })
  }
}

export default handler
