import Reflux from 'reflux'

const GameActions = Reflux.createActions([
  'changeModeToPVP',
  'moveGem',
  'preloadData',
  'selectGem',
  'unselectGem',
  'updateCurrentTime'
])

export default GameActions
