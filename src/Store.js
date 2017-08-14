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
      options: {
        contentWidth: 800,
        contentHeight: 800
      },
      data: null,
      game: {
        renderer: null,
        stage: null,
        resources: null,
        match3: null,
        selectedTile: null,
        currentAnimations: false,
        currentAnimationsExplode: 0,
        currentAnimationsMove: 0,
        currentAnimationsCreate: 0
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
