import Debug from 'debug'

const debug = Debug('gemboard-game:actions:onSelectGem')

const handler = (gem, context) => {
  debug('selected gem is %o', gem.props)
  gem.state.container.scale.x = 1.25
  gem.state.container.scale.y = 1.25
  context.state.game.selectedGem = gem
  context.setState({
    game: context.state.game
  })
}

export default handler
