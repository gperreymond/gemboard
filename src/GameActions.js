import Reflux from 'reflux'

const GameActions = Reflux.createActions([
  'preloadData',
  'startEngine',
  'updateCurrentTime',
  'createLevel',
  'resolveClusters',
  'findClusters',
  'removeClusters',
  'shiftTiles',
  'findMoves',
  'createLevelComplete',
  'selectGem',
  'moveGems'
])

export default GameActions
