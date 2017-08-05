import Debug from 'debug'

import Actions from '../Actions'
import Playground from '../game/Playground'
import Match3 from '../game/Match3'

const debug = Debug('gemboard-game:actions:onInitializeGame')

require('pixi.js/dist/pixi.min.js')
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
    // calculate game screen ration
    let ratio = Math.min(window.innerWidth / context.state.options.contentWidth, window.innerHeight / context.state.options.contentHeight)
    debug('screen radio %s', ratio)
    // setup PIXI Canvas in componentDidMount
    let renderer = autoDetectRenderer(context.state.options.contentWidth * ratio, context.state.options.contentHeight * ratio, {antialias: true, transparent: false, resolution: 1})
    // create the root of the scene graph
    let stage = new Container()
    stage.scale.x = ratio
    stage.scale.y = ratio
    debug('game size %s x %s', renderer.width, renderer.height)
    context.setState({game: {renderer, stage, resources}})
    // initialize match3 container
    let playground = new Playground({size: 4}, context)
    playground.initialize()
    stage.addChild(playground.getContainer())
    // initialize match3 content
    let match3 = new Match3({rows: 8, cols: 8}, context)
    match3.initialize()
    stage.addChild(match3.getContainer())
    debug('match3 initialize, mooves %o', match3.moves)
    //
    Actions.initializeComplete()
  })
}

export default handler
