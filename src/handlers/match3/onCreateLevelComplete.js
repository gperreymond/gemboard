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
}

export default handler
