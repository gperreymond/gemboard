import uuid from 'uuid'
import ee from 'event-emitter'
import remove from 'lodash.remove'
import Debug from 'debug'

import GemButton from './GemButton'

const debug = Debug('gemboard-game:tile')

const tilecolors = [0x2d4783, 0x990000, 0x369dba, 0x9d5012, 0x71af4a, 0x878c87, 0x953289]
const tilenames = ['gemWater', 'gemFire', 'gemAir', 'gemEarth', 'gemNature', 'gemDeath', 'gemMagic']

class Tile {
  constructor (context) {
    this._context = context
    this.uuid = uuid.v4()
    this.type = Math.floor(Math.random() * tilecolors.length)
    this.name = tilenames[this.type]
    this.color = tilecolors[this.type]
    this.gem = false
    this.on('resolve_explode', () => {
      debug('gem %s (%s,%s) explode', this.name, this.x, this.y)
      return this.exploders()
    })
    this.on('resolve_explode_complete', () => {
      debug('gem %s (%s,%s) explode complete', this.name, this.x, this.y)
      let match3 = this._context.state.game.match3
      remove(match3.getContainer().children, this.getContainer())
      match3.tiles[this.x][this.y] = false
    })
    this.on('resolve_move', (shift) => {
      debug('gem %s (%s,%s) move shift', this.name, this.x, this.y, shift)
      return this.movers(shift)
    })
    this.on('resolve_move_complete', () => {
      this.y = Math.round(this.y)
      this.shift = 0
      this.move()
      debug('gem %s (%s,%s) move complete', this.name, this.x, this.y)
      let match3 = this._context.state.game.match3
      match3.tiles[this.x][this.y] = this
    })
    this.on('resolve_create', (position) => {
      let game = this._context.state.game
      let currentTile = game.currentAnimations.create[position].tile
      for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
          let tile = game.match3.tiles[x][y]
          if (tile === false) {
            game.match3.tiles[x][y] = currentTile
            currentTile.x = x
            currentTile.y = y
            currentTile.getContainer().scale.x = 0
            currentTile.getContainer().scale.y = 0
            game.match3.getContainer().addChild(currentTile.getContainer())
            currentTile.move()
            debug('gem %s (%s,%s) create in position', currentTile.name, currentTile.x, currentTile.y, position)
            return this.creaters()
          }
        }
      }
    })
  }
  getContainer () {
    return this.gem.getContainer()
  }
  generate () {
    this.gem = new GemButton({
      color: tilecolors[this.type],
      texture: this._context.state.game.resources[tilenames[this.type]].texture
    })
    this.getContainer().on('pointerup', () => {
      debug('tile %s (%s,%s) is pointerup', this.name, this.x, this.y)
      let match3 = this._context.state.game.match3
      if (this._context.state.game.selectedTile === null) return false
      if (this.gem.isDown() === true) {
        this._context.state.game.selectedTile = null
        this.unselect()
      } else {
        let canSwap = match3.canSwap(this.x, this.y, this._context.state.game.selectedTile.x, this._context.state.game.selectedTile.y)
        debug('... can swap ? result=%s', canSwap)
        if (canSwap === false) {
          this._context.state.game.selectedTile.unselect()
          this._context.state.game.selectedTile = null
        } else {
          this.checkMoves()
        }
      }
    })
    this.getContainer().on('pointerdown', () => {
      debug('tile %s (%s,%s) is pointerdown', this.name, this.x, this.y)
      this._context.state.game.selectedTile = this
      this.select()
    })
  }
  exploders () {
    setTimeout(() => {
      this.getContainer().scale.x += 0.02
      this.getContainer().scale.y += 0.02
      if (this.getContainer().scale.x < 2) {
        return this.exploders()
      } else {
        this.emit('resolve_explode_complete')
        let game = this._context.state.game
        game.currentAnimationsExplode += 1
        if (game.currentAnimations.explode.length === game.currentAnimationsExplode) {
          debug('all gem has exploded')
          setTimeout(() => {
            this.animationsMove()
          }, 150)
        }
      }
    }, 5)
  }
  movers (shift) {
    setTimeout(() => {
      shift -= 0.1
      this.y += 0.1
      this.move()
      if (shift > 0) {
        return this.movers(shift)
      } else {
        this.emit('resolve_move_complete')
        let game = this._context.state.game
        game.currentAnimationsMove += 1
        if (game.currentAnimations.move.length === game.currentAnimationsMove) {
          debug('all gem has moved')
          setTimeout(() => {
            this.animationsCreate()
          }, 150)
        }
      }
    }, 5)
  }
  creaters () {
    setTimeout(() => {
      this.getContainer().scale.x += 0.02
      this.getContainer().scale.y += 0.02
      if (this.getContainer().scale.x < 1) {
        return this.creaters()
      } else {
        this.emit('resolve_create_complete')
        let game = this._context.state.game
        game.currentAnimationsCreate += 1
        if (game.currentAnimations.create.length === game.currentAnimationsCreate) {
          debug('all gem has been created')
          debug('########## DONE')
          setTimeout(() => {
            this.animationsNext()
          }, 150)
        }
      }
    }, 5)
  }
  move () {
    this.getContainer().x = this.x * 100 + 50
    this.getContainer().y = this.y * 100 + 50
  }
  select () {
    this.gem.select()
  }
  unselect () {
    this.gem.unselect()
  }
  checkMoves () {
    let match3 = this._context.state.game.match3
    match3.swap(this.x, this.y, this._context.state.game.selectedTile.x, this._context.state.game.selectedTile.y)
    match3.findClusters()
    debug('checkMoves clusters %o', match3.clusters)
    if (match3.clusters.length === 0) {
      debug('... unauthorized move')
      // move back
      match3.swap(this._context.state.game.selectedTile.x, this._context.state.game.selectedTile.y, this.x, this.y)
      this._context.state.game.selectedTile.unselect()
      this._context.state.game.selectedTile = null
    } else {
      debug('... resolve move')
      this.resolve()
    }
  }
  resolve () {
    debug('resolve')
    let source = this
    let target = this._context.state.game.selectedTile
    let sx = source.x
    let sy = source.y
    source.x = target.x
    source.y = target.y
    target.x = sx
    target.y = sy
    source.move()
    target.move()
    // end move
    source.unselect()
    target.unselect()
    this._context.state.game.selectedGem = null
    // resolve animations
    let match3 = this._context.state.game.match3
    match3.animations = []
    match3.resolveClusters()
    debug('########## ANIMATIONS %s', match3.animations.length)
    this.animations()
  }
  animations () {
    let game = this._context.state.game
    game.currentAnimations = game.match3.animations.shift()
    game.currentAnimationsExplode = 0
    game.currentAnimationsMove = 0
    game.currentAnimationsCreate = 0
    debug('********** currentAnimations %o', game.currentAnimations)
    this.animationsExplode()
  }
  animationsExplode () {
    let game = this._context.state.game
    game.currentAnimations.explode.map(item => {
      setTimeout(() => {
        return item.tile.emit('resolve_explode')
      }, 50 * (game.currentAnimations.explode.indexOf(item) + 1))
    })
  }
  animationsMove () {
    let game = this._context.state.game
    if (game.currentAnimations.move.length === 0) {
      return this.animationsCreate()
    }
    game.currentAnimations.move.map(item => {
      game.match3.tiles[item.tile.x][item.tile.y] = false
      return item.tile.emit('resolve_move', item.shift)
    })
  }
  animationsCreate () {
    let game = this._context.state.game
    game.currentAnimations.create.map(item => {
      setTimeout(() => {
        return item.tile.emit('resolve_create', game.currentAnimations.create.indexOf(item))
      }, 50 * (game.currentAnimations.create.indexOf(item) + 1))
    })
  }
  animationsNext () {
    let match3 = this._context.state.game.match3
    if (match3.animations.length > 0) {
      debug('########## ANIMATIONS %s', match3.animations.length)
      this.animations()
    } else {
      match3.findClusters()
      if (match3.clusters.length > 0) {
        debug('NEW CLUSTERS FOUND')
        match3.animations = []
        match3.resolveClusters()
        this.animations()
      } else {
        match3.findMoves()
        debug('NO CLUSTERS, PLAYER TURN, MOVES=%s', match3.moves)
      }
    }
  }
}

ee(Tile.prototype)

export default Tile
