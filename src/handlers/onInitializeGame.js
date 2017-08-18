/* eslint no-unused-vars: 0 */
import 'pixi.js'
import Debug from 'debug'

import Actions from '../Actions'

import Boardgame from '../game/containers/Boardgame'
import Match3 from '../game/Match3'

const debug = Debug('gemboard-game:actions:onInitializeGame')

window.PIXI.utils.skipHello()

require('pixi-sound')
const autoDetectRenderer = window.PIXI.autoDetectRenderer
const loader = window.PIXI.loader
const Container = window.PIXI.Container

const handler = (context) => {
  debug('handler')
  context.state.progress.text = 'Initialisation du plateau de jeu...'
  context.setState({progress: context.state.progress})
  // prepare game data loader
  Object.keys(context.state.data).map(type => {
    Object.keys(context.state.data[type]).map(key => {
      loader.add(key, context.state.data[type][key])
      return key
    })
    return type
  })
  // execute game data loader
  loader.on('progress', (loader, resource) => {
    debug('load in progress %s', resource.name)
    context.state.progress.value = Math.round(loader.progress)
    context.setState({progress: context.state.progress})
  })
  loader.load((loader, resources) => {
    debug('load is complete')
    context.state.game.resources = resources
    // calculate game screen ration
    let ratio = Math.min(window.innerWidth / context.state.game.GAME_WIDTH, window.innerHeight / context.state.game.GAME_HEIGHT)
    debug('screen radio %s', ratio)
    // setup PIXI Canvas in componentDidMount
    context.state.game.renderer = autoDetectRenderer(context.state.game.GAME_WIDTH * ratio, context.state.game.GAME_HEIGHT * ratio, {antialias: true, transparent: true, resolution: 1})
    // create the root of the scene graph
    context.state.game.stage = new Container()
    context.state.game.stage.visible = false
    context.state.game.stage.scale.x = ratio
    context.state.game.stage.scale.y = ratio
    debug('game size %s x %s', context.state.game.GAME_WIDTH, context.state.game.GAME_HEIGHT)
    // create boardgame container
    context.state.game.stage.addChild(new Boardgame(context).getContainer())
    // initialize match3 content
    context.state.game.match3 = new Match3({rows: context.state.game.BOARD_SIZE, cols: context.state.game.BOARD_SIZE}, context)
    context.state.game.match3.initialize()
    context.state.game.stage.addChild(context.state.game.match3.getContainer())
    context.state.game.match3.getContainer().x = (context.state.game.GAME_WIDTH - context.state.game.match3.getContainer().width) / 2
    debug('moves %s', context.state.game.match3.moves.length)
    //
    Actions.initializeComplete()
  })
}

export default handler
