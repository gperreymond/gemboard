import Debug from 'debug'

const debug = Debug('gemboard-game:actions:onMoveDownGems')

const handler = (context) => {
  debug('animations move start')
  context.setState({
    game: context.state.game
  })
  let match3 = false
  context.state.stage.children.map((child) => {
    if (child.id === 'Match3Gems') match3 = child
    return child
  })
  context.state.game.animations.move.map((item) => {
    return match3.children.map((child) => {
      let x = (child.x - 70) / 140
      let y = (child.y - 70) / 140
      if (item.x === x && item.y === y) {
        debug('... move in (%s:%s) shift=%s', item.x, item.y, item.shift)
        child.emit('animation_move', item)
      }
      return child
    })
  })
}

export default handler
