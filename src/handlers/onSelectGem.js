import Debug from 'debug'

const debug = Debug('gemboard-game:actions:onSelectGem')

const handler = (gem, context) => {
  debug('gem is %s in (%s:%s)', gem.props.name, gem.props.x, gem.props.y)
  gem.state.container.scale.x = 1.25
  gem.state.container.scale.y = 1.25
  context.setState({
    selectedGem: gem
  })
}

export default handler
