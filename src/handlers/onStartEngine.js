import Debug from 'debug'

import Engine from '../components/Engine'

const debug = Debug('gemboard-game:actions:onStartEngine')

const handler = (context) => {
  let ratio = Math.min(window.innerWidth / context.state.config.GAME_WIDTH, window.innerHeight / context.state.config.GAME_HEIGHT)
  debug('calculate game screen ratio=%s', ratio.toFixed(2))
  let engine = new Engine(context.state.config.GAME_WIDTH, context.state.config.GAME_HEIGHT, '#game-canvas', { backgroundColor: 0x000d1a })
  engine.stage.visible = true
  engine.stage.scale.x = ratio
  engine.stage.scale.y = ratio
  debug('engine has been created and scaled')
  context.setState({
    stage: engine.stage,
    engine
  })
}

export default handler
