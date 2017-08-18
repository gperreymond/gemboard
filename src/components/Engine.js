import Debug from 'debug'

import 'fpsmeter'
const PIXI = require('pixi.js')

const debug = Debug('gemboard-game:Engine')

class Engine {
  constructor (width, height, targetEl, opts = {}) {
    debug('constructor')
    // calculate game screen ratio
    let ratio = Math.min(window.innerWidth / width, window.innerHeight / height)
    // initial context binds
    this.animate = this.animate.bind(this)
    // build the initial renderer context
    this.renderer = PIXI.autoDetectRenderer(width * ratio, height * ratio, opts)
    // gross, but apparently necessary
    document.querySelector(targetEl).appendChild(this.renderer.view)
    // create the root of the scene graph
    this.stage = new PIXI.Container()
    // render to the stage
    this.renderer.render(this.stage)
    this.setup()
  }
  setup () {
    debug('setup')
    // fps meter
    window.meter = new window.FPSMeter({ theme: 'light' })
    // call the main animation loop
    this.animate()
  }
  animate () {
    window.meter.tick()
    requestAnimationFrame(this.animate)
    if (this.renderer) {
      this.renderer.render(this.stage)
    }
  }
}

export default Engine
