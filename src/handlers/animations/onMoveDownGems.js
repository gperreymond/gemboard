import Debug from 'debug'

const debug = Debug('gemboard-game:actions:onMoveDownGems')

const handler = (context) => {
  debug('animations move start')
  context.setState({
    game: context.state.game
  })
  let match3 = false
  context.state.stage.children.map(function (child) {
    if (child.id === 'match3') match3 = child
  })
  context.state.game.animations.move.map(function (item) {
    match3.children.map(function (child) {
      let x = (child.x - 70) / 140
      let y = (child.y - 70) / 140
      if (item.x === x && item.y === y) {
        debug('... move in (%s:%s) shift=%s', item.x, item.y, item.shift)
        child.emit('animation_move', item)
      }
    })
  })
}

export default handler
