import Debug from 'debug'

const debug = Debug('gemboard-game:actions:onAnimationsDone')

const handler = (context) => {
  debug('animations all done')
  context.setState({
    game: context.state.game
  })
}

export default handler
