import Debug from 'debug'

const debug = Debug('gemboard-game:actions:onExplodeGems')

const handler = (context) => {
  debug('animations explode start')
  context.setState({
    game: context.state.game
  })
  let match3 = false
  context.state.stage.children.map((child) => {
    if (child.id === 'match3') match3 = child
    return true
  })
  context.state.game.animations.explode.map(function (item) {
    match3.children.map(function (child) {
      let x = (child.x - 70) / 140
      let y = (child.y - 70) / 140
      if (item.x === x && item.y === y) {
        debug('... explode in (%s:%s)', item.x, item.y)
        child.emit('animation_explode', item)
      }
    })
  })
}

export default handler
