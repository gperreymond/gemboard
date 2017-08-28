import Reflux from 'reflux'
import Debug from 'debug'

import Actions from './GameActions'
import Handlers from './GameHandlers'

const debug = Debug('gemboard-game:GameStore')

class GameStore extends Reflux.Store {
  constructor () {
    debug('constructor')
    super()
    const sizeOfTiles = 8
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
        GAME_TILES: sizeOfTiles,
        GAME_TILES_COLORS: [0x2d4783, 0x990000, 0x369dba, 0x9d5012, 0x71af4a, 0x878c87, 0x953289],
        GAME_TILES_NAMES: ['gemWater', 'gemFire', 'gemAir', 'gemEarth', 'gemNature', 'gemDeath', 'gemMagic'],
        GAME_BGS_NAMES: ['tileBg001', 'tileBg002', 'tileBg003', 'tileBg004'],
        GAME_WIDTH: (sizeOfTiles * 140) + (2 * 250),
        GAME_HEIGHT: (sizeOfTiles * 140) + 100
      },
      resources: false,
      stage: false,
      engine: false,
      game: {
        currentState: false,
        currentTurnPlayer: true,
        music: false,
        tiles: [],
        clusters: [],
        moves: [],
        animations: {
          explode: [],
          move: [],
          create: []
        },
        selectedGem: false,
        score: {
          extraTurn: false,
          consecutiveKills: 1
        }
      }
    }
    this.listenables = [Actions]
    this.handlers = new Handlers()
  }

  onPreloadData () { this.handlers.onPreloadData(this) }
  onStartEngine () { this.handlers.onStartEngine(this) }
  onUpdateCurrentTime () { this.handlers.onUpdateCurrentTime(this) }

  onCreateLevel (currentState) { this.handlers.onCreateLevel(currentState, this) }
  onResolveClusters () { this.handlers.onResolveClusters(this) }
  onFindClusters (callback = false) { this.handlers.onFindClusters(callback, this) }
  onRemoveClusters (callback = false) { this.handlers.onRemoveClusters(callback, this) }
  onShiftTiles (callback = false) { this.handlers.onShiftTiles(callback, this) }
  onFindMoves (callback = false) { this.handlers.onFindMoves(callback, this) }
  onCreateLevelComplete () { this.handlers.onCreateLevelComplete(this) }

  onSelectGem (gem, callback = false) { this.handlers.onSelectGem(gem, callback, this) }
  onMoveGems (gem) { this.handlers.onMoveGems(gem, this) }
  onExplodeGems () { this.handlers.onExplodeGems(this) }
  onMoveDownGems () { this.handlers.onMoveDownGems(this) }
  onCreateGems () { this.handlers.onCreateGems(this) }
  onAnimationsDone () { this.handlers.onAnimationsDone(this) }
}

export default GameStore
