/* eslint no-unused-vars: 0 */
import Debug from 'debug'

import PIXI from 'pixi.js'
import Actions from '../Actions'
import Playground from '../game/Playground'
import Match3 from '../game/Match3'

const debug = Debug('gemboard-game:actions:onInitializeGame')

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
    let ratio = Math.min(window.innerWidth / context.state.options.contentWidth, window.innerHeight / context.state.options.contentHeight)
    debug('screen radio %s', ratio)
    // setup PIXI Canvas in componentDidMount
    context.state.game.renderer = autoDetectRenderer(context.state.options.contentWidth * ratio, context.state.options.contentHeight * ratio, {antialias: true, transparent: false, resolution: 1})
    // create the root of the scene graph
    context.state.game.stage = new Container()
    context.state.game.stage.visible = false
    context.state.game.stage.scale.x = ratio
    context.state.game.stage.scale.y = ratio
    debug('game size %s x %s', context.state.game.renderer.width, context.state.game.renderer.height)
    // initialize match3 container
    let playground = new Playground({size: 4}, context)
    playground.initialize()
    context.state.game.stage.addChild(playground.getContainer())
    // initialize match3 content
    context.state.game.match3 = new Match3({rows: 8, cols: 8}, context)
    context.state.game.match3.initialize()
    context.state.game.stage.addChild(context.state.game.match3.getContainer())
    debug('moves %s', context.state.game.match3.moves.length)
    //
    Actions.initializeComplete()
  })
}

export default handler
