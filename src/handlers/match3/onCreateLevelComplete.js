import Debug from 'debug'

const debug = Debug('gemboard-game:actions:onCreateLevelComplete')

const handler = (context) => {
  debug('level is now created')
  debug('animations %o', context.state.game.animations)
  context.state.game.tiles.map(function (item) {
    item.map(function (tile) {
      delete tile.inserted
    })
  })
  context.setState({
    game: context.state.game
  })
  if (context.state.game.music === false) {
    context.state.game.music = context.state.resources['festival'].sound
    context.state.game.music.volume = 0.1
    context.state.game.music.play({loop: true, singleInstance: true})
  }
}

export default handler
