import onInitialize from './handlers/onInitialize'
import onInitializeGame from './handlers/onInitializeGame'
import onInitializeComplete from './handlers/onInitializeComplete'

class Handlers {
}

Handlers.prototype.onInitialize = onInitialize
Handlers.prototype.onInitializeGame = onInitializeGame
Handlers.prototype.onInitializeComplete = onInitializeComplete

export default Handlers
