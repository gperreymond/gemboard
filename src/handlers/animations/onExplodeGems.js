import Debug from 'debug'

const debug = Debug('gemboard-game:actions:onExplodeGems')

const handler = (context) => {
  debug('animations explode start')
  context.setState({
    game: context.state.game
  })
  let match3 = false
  context.state.stage.children.map((child) => {
    if (child.id === 'Match3Gems') match3 = child
    return child
  })
  context.state.game.animations.explode.map((item) => {
    return match3.children.map((child) => {
      let x = (child.x - 70) / 140
      let y = (child.y - 70) / 140
      if (item.x === x && item.y === y) {
        debug('... explode in (%s:%s)', item.x, item.y)
        child.emit('animation_explode', item)
      }
      return child
    })
  })
}

export default handler
