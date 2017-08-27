import Debug from 'debug'

import Actions from '../../GameActions'
const debug = Debug('gemboard-game:actions:onAnimationsDone')

const handler = (context) => {
  debug('animations all done')
  context.setState({
    game: context.state.game
  })
  setTimeout(() => {
    Actions.findClusters(() => {
      debug('clusters %o', context.state.game.clusters)
      if (context.state.game.clusters.length > 0) {
        // clusters to resolve
        Actions.removeClusters(() => {
          debug('clusters has been removed')
          context.setState({
            game: context.state.game
          })
          Actions.shiftTiles(() => {
            debug('animations %o', context.state.game.animations)
            context.setState({
              game: context.state.game
            })
            Actions.explodeGems()
          })
        })
      } else {
        // moves to resolve
        debug('moves left ?')
        Actions.findMoves(() => {
        })
      }
    })
  }, 250)
}

export default handler
