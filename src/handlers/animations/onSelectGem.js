import Debug from 'debug'

const PIXI = require('pixi.js')
const debug = Debug('gemboard-game:actions:onSelectGem')

const handler = (gem, context) => {
  debug('selected gem is %s (%s:%s)', gem.props.type, gem.props.x, gem.props.y)
  const action = new PIXI.action.ScaleTo(1.25, 1.25, 0.1)
  const animation = PIXI.actionManager.runAction(gem.state.container, action)
  animation.on('end', (elapsed) => {
    context.state.game.selectedGem = gem
    context.setState({
      game: context.state.game
    })
  })
}

export default handler
