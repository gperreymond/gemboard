import Debug from 'debug'

const debug = Debug('gemboard-game:actions:onUnselectGem')

const handler = (context) => {
  if (context.state.selectedGem === false) return true
  debug('gem is %s in (%s:%s)', context.state.selectedGem.props.name, context.state.selectedGem.props.x, context.state.selectedGem.props.y)
  context.state.selectedGem.state.container.scale.x = 1
  context.state.selectedGem.state.container.scale.y = 1
  context.setState({
    selectedGem: false,
    canSwap: false
  })
}

export default handler
