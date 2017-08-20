import Debug from 'debug'

import Actions from '../GameActions'

const debug = Debug('gemboard-game:actions:onMoveGem')

const handler = (gem, context) => {
  if (context.state.selectedGem === false) return true
  debug('gem is %s in (%s:%s)', gem.props.name, gem.props.x, gem.props.y)
  if (gem === context.state.selectedGem) {
    Actions.unselectGem()
  } else {
    debug('swap moves')
    context.setState({
      canSwap: {
        source: context.state.selectedGem,
        target: gem
      }
    })
  }
}

export default handler
