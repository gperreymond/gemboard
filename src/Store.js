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
        contentWidth: 1024,
        contentHeight: 768
      },
      data: null,
      game: {
        renderer: null,
        stage: null,
        ressources: null
      }
    }
    debug('constructor')
    this.listenables = [Actions]
    this.handlers = new Handlers()
  }
  onInitialize () { this.handlers.onInitialize(this) }
  onInitializeComplete () { this.handlers.onInitializeComplete(this) }
}

export default Store
