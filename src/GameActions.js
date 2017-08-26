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
  'moveGems',
  'explodeGems',
  'moveDownGems',
  'createGems',
  'animationsDone'
])

export default GameActions
