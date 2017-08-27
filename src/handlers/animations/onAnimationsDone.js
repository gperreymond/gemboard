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
        context.state.game.score.consecutiveKills += 1
        context.setState({
          game: context.state.game
        })
        debug('... consecutiveKills is %s', context.state.game.score.consecutiveKills)
        if (context.state.game.score.consecutiveKills === 3) {
          context.state.resources['dominating'].sound.play()
        }
        if (context.state.game.score.consecutiveKills === 4) {
          context.state.resources['ownage'].sound.play()
        }
        if (context.state.game.score.consecutiveKills === 5) {
          context.state.resources['unstoppable'].sound.play()
        }
        if (context.state.game.score.consecutiveKills === 6) {
          context.state.resources['godLike'].sound.play()
        }
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
        context.state.game.score.consecutiveKills = 1
        context.setState({
          game: context.state.game
        })
        Actions.findMoves(() => {
        })
      }
    })
  }, 250)
}

export default handler
