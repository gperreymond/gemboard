import Reflux from 'reflux'
import Debug from 'debug'

import Actions from './GameActions'
import Handlers from './GameHandlers'

const debug = Debug('gemboard-game:GameStore')

class GameStore extends Reflux.Store {
  constructor () {
    debug('constructor')
    super()
    this.state = {
      currentTime: new Date(),
      currentState: 'STATE_INITIALIZE',
      progress: {
        title: '...',
        message: '...'
      },
      config: {
        STATE_INITIALIZE: 'STATE_INITIALIZE',
        STATE_HOMEPAGE: 'STATE_HOMEPAGE',
        STATE_FIGHTING: 'STATE_FIGHTING',
        GAME_TILES: 8,
        GAME_WIDTH: (8 * 140) + (2 * 250),
        GAME_HEIGHT: 8 * 140
      },
      resources: false,
      stage: false,
      engine: false
    }
    this.listenables = [Actions]
    this.handlers = new Handlers()
  }
  onUpdateCurrentTime () { this.handlers.onUpdateCurrentTime(this) }
  onPreloadData () { this.handlers.onPreloadData(this) }
}

export default GameStore
