import Reflux from 'reflux'

const GameActions = Reflux.createActions([
  'preloadCards',
  'preloadCampaigns',
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
