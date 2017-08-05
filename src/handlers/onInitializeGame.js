import Debug from 'debug'

import Actions from '../Actions'
import Playground from '../game/Playground'
import Match3 from '../game/Match3'

const debug = Debug('gemboard-game:actions:onInitializeGame')

require('pixi.js/dist/pixi.min.js')
const autoDetectRenderer = window.PIXI.autoDetectRenderer
const loader = window.PIXI.loader
const Container = window.PIXI.Container
const Graphics = window.PIXI.Graphics
const Sprite = window.PIXI.Sprite

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
    match3.createLevel()
    match3.findMoves()
    match3.findClusters()
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        let tile = match3.tiles[x][y]
        let circle = new Graphics()
        circle.lineStyle(0)
        circle.beginFill(tile.color, 1)
        circle.drawCircle(0, 0, 40)
        circle.endFill()
        circle.x = x * 100 + 50
        circle.y = y * 100 + 50
        if (tile.sprite) {
          let texture = context.state.game.resources[tile.sprite].texture
          let sprite = new Sprite(texture)
          sprite.alpha = 0.5
          sprite.width = 80
          sprite.height = 80
          sprite.anchor.set(0.5, 0.5)
          circle.addChild(sprite)
        }
        stage.addChild(circle)
      }
    }
    console.log(match3.moves)
    //
    Actions.initializeComplete()
  })
}

export default handler
