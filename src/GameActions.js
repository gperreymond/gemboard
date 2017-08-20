import Reflux from 'reflux'

const GameActions = Reflux.createActions([
  'updateCurrentTime',
  'preloadData',
  'changeModeToPVP',
  'selectGem',
  'unselectGem',
  'moveGem'
])

export default GameActions
