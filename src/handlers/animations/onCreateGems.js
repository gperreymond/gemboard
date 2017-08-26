import Debug from 'debug'

const debug = Debug('gemboard-game:actions:onCreateGems')

const handler = (context) => {
  debug('animations all done')
  context.setState({
    game: context.state.game
  })
  debug(context.state.game.tiles)
}

export default handler
