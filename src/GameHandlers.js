import onPreloadData from './handlers/onPreloadData'
import onStartEngine from './handlers/onStartEngine'
import onUpdateCurrentTime from './handlers/onUpdateCurrentTime'

import onCreateLevel from './handlers/match3/onCreateLevel'
import onResolveClusters from './handlers/match3/onResolveClusters'
import onFindClusters from './handlers/match3/onFindClusters'
import onRemoveClusters from './handlers/match3/onRemoveClusters'
import onShiftTiles from './handlers/match3/onShiftTiles'
import onFindMoves from './handlers/match3/onFindMoves'
import onCreateLevelComplete from './handlers/match3/onCreateLevelComplete'

class GameHandlers {
}

GameHandlers.prototype.onPreloadData = onPreloadData
GameHandlers.prototype.onStartEngine = onStartEngine
GameHandlers.prototype.onUpdateCurrentTime = onUpdateCurrentTime

GameHandlers.prototype.onCreateLevel = onCreateLevel
GameHandlers.prototype.onResolveClusters = onResolveClusters
GameHandlers.prototype.onFindClusters = onFindClusters
GameHandlers.prototype.onRemoveClusters = onRemoveClusters
GameHandlers.prototype.onShiftTiles = onShiftTiles
GameHandlers.prototype.onFindMoves = onFindMoves
GameHandlers.prototype.onCreateLevelComplete = onCreateLevelComplete

export default GameHandlers
