import onUpdateCurrentTime from './handlers/onUpdateCurrentTime'
import onPreloadData from './handlers/onPreloadData'
import onChangeModeToPVP from './handlers/onChangeModeToPVP'

class GameHandlers {
}

GameHandlers.prototype.onUpdateCurrentTime = onUpdateCurrentTime
GameHandlers.prototype.onPreloadData = onPreloadData
GameHandlers.prototype.onChangeModeToPVP = onChangeModeToPVP

export default GameHandlers
