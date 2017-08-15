import Reflux from 'reflux'
import Debug from 'debug'

import Actions from './Actions'
import Handlers from './Handlers'

const debug = Debug('gemboard-game:store')

class Store extends Reflux.Store {
  constructor () {
    super()
    this.state = {
      initialized: false,
      progress: {
        text: '...',
        value: 0
      },
      data: null,
      game: {
        GAME_WIDTH: (8 * 140) + (2 * 250),
        GAME_HEIGHT: 8 * 140,
        BOARD_SIZE: 8,
        renderer: null,
        stage: null,
        resources: null,
        match3: null,
        selectedTile: null,
        currentAnimations: false,
        currentAnimationsExplode: 0,
        currentAnimationsMove: 0,
        currentAnimationsCreate: 0,
        currentSoundsGemKill: 0,
        currentSoundsConsecutiveKill: 0
      }
    }
    debug('constructor')
    this.listenables = [Actions]
    this.handlers = new Handlers()
  }
  onInitialize () { this.handlers.onInitialize(this) }
  onInitializeGame () { this.handlers.onInitializeGame(this) }
  onInitializeComplete () { this.handlers.onInitializeComplete(this) }
}

export default Store
