import Debug from 'debug'

import Actions from '../../GameActions'
const debug = Debug('gemboard-game:actions:onAnimationsDone')

const enableMoves = (context) => {
  // disable gems
  let match3 = false
  context.state.stage.children.map(function (child) {
    if (child.id === 'Match3Gems') match3 = child
  })
  context.state.game.enableMoves = true
  match3.children.map(function (child) {
    child.emit('change_enable')
  })
}

const disableMoves = (context) => {
  // disable gems
  let match3 = false
  context.state.stage.children.map(function (child) {
    if (child.id === 'Match3Gems') match3 = child
  })
  context.state.game.enableMoves = false
  match3.children.map(function (child) {
    child.emit('change_enable')
  })
}

const handler = (context) => {
  debug('animations all done')
  disableMoves(context)
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
        if (context.state.game.score.extraTurn === false) context.state.game.currentTurnPlayer = !context.state.game.currentTurnPlayer
        context.state.game.score.extraTurn = false
        context.state.game.score.consecutiveKills = 1
        context.setState({
          game: context.state.game
        })
        let match3 = false
        context.state.stage.children.map(function (child) {
          if (child.id === 'Match3Gems') match3 = child
        })
        Actions.findMoves(() => {
          if (context.state.game.currentTurnPlayer === false) {
            debug('----- COMPUTER TURN -----')
            setTimeout(() => {
              let move = context.state.game.moves.shift()
              debug('computer move is %o', move)
              let gemSource = null
              let gemTarget = null
              match3.children.map(function (child) {
                child.emit('change_enable')
                let x = (child.x - 70) / 140
                let y = (child.y - 70) / 140
                if (move.column1 === x && move.row1 === y) gemSource = child
                if (move.column2 === x && move.row2 === y) gemTarget = child
              })
              gemSource.emit('computer_pointerdown', gemTarget)
            }, 1000)
          } else {
            debug('----- PLAYER TURN -----')
            enableMoves(context)
          }
        })
      }
    })
  }, 250)
}

export default handler
