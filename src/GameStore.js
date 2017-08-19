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
      currentMatch: false,
      progress: {
        title: '...',
        message: '...'
      },
      config: {
        STATE_INITIALIZE: 'STATE_INITIALIZE',
        STATE_HOMEPAGE: 'STATE_HOMEPAGE',
        STATE_FIGHTING: 'STATE_FIGHTING',
        GAME_TILES: 8,
        GAME_TILES_COLORS: [0x2d4783, 0x990000, 0x369dba, 0x9d5012, 0x71af4a, 0x878c87, 0x953289],
        GAME_TILES_NAMES: ['gemWater', 'gemFire', 'gemAir', 'gemEarth', 'gemNature', 'gemDeath', 'gemMagic'],
        GAME_BGS_NAMES: ['tileBg001', 'tileBg002', 'tileBg003', 'tileBg004'],
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
  onChangeModeToPVP () { this.handlers.onChangeModeToPVP(this) }
}

export default GameStore
