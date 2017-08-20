import onUpdateCurrentTime from './handlers/onUpdateCurrentTime'
import onPreloadData from './handlers/onPreloadData'
import onChangeModeToPVP from './handlers/onChangeModeToPVP'
import onSelectGem from './handlers/onSelectGem'
import onUnselectGem from './handlers/onUnselectGem'
import onMoveGem from './handlers/onMoveGem'

class GameHandlers {
}

GameHandlers.prototype.onUpdateCurrentTime = onUpdateCurrentTime
GameHandlers.prototype.onPreloadData = onPreloadData
GameHandlers.prototype.onChangeModeToPVP = onChangeModeToPVP
GameHandlers.prototype.onSelectGem = onSelectGem
GameHandlers.prototype.onUnselectGem = onUnselectGem
GameHandlers.prototype.onMoveGem = onMoveGem

export default GameHandlers
