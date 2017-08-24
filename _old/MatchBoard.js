/* eslint jsx-quotes: ["error", "prefer-double"] */

import PropTypes from 'prop-types'
import Reflux from 'reflux'
import remove from 'lodash.remove'
import clone from 'lodash.clone'
import Debug from 'debug'

import Actions from '../GameActions'
import Store from '../GameStore'
import Gem from './elements/Gem'

const PIXI = require('pixi.js')
const debug = Debug('gemboard-game:MatchBoard')

class MatchBoard extends Reflux.Component {
  constructor (props) {
    debug('constructor')
    super(props)
    this.state = {
      music: false,
      container: false,
      game: false,
      tiles: [],
      moves: [],
      clusters: [],
      animations: false,
      currentAnimations: false,
      currentAnimationsExplode: 0,
      currentAnimationsCreate: 0,
      currentAnimationsMove: 0
    }
    this.store = Store
  }
  /**
  Create the match3 game level
  **/
  createLevel () {
    debug('>>> CREATE LEVEL START')
    let done = false
    // Keep generating levels until it is correct
    while (!done) {
      this.state.animations = false
      remove(this.props.stage.children, this.state.game)
      this.state.game = new PIXI.Container()
      this.state.game.visible = false
      this.state.game.x = this.props.x + 70
      this.state.game.y = -1000
      this.props.stage.addChild(this.state.game)
      this.state.tiles = []
      // Create a level with random tiles
      for (let x = 0; x < this.state.config.GAME_TILES; x++) {
        for (let y = 0; y < this.state.config.GAME_TILES; y++) {
          if (!this.state.tiles[x]) this.state.tiles[x] = []
          this.state.tiles[x][y] = this.getRandomGem(x, y)
        }
      }
      // Resolve the clusters
      do {
        this.resolveClusters()
      } while (this.state.clusters.length !== 0)
      // Check if there are valid moves
      this.findMoves()
      // Done when there is a valid move
      if (this.state.moves.length > 0) {
        done = true
        debug('moves %s', this.state.moves.length)
        debug('>>> CREATE LEVEL END with %s children', this.state.game.children.length)
        console.log(this.state.tiles)
        this.animationsShow()
      }
    }
  }
  replaceCoordsTiles () {
    debug('replaceCoordsTiles')
    for (let x = 0; x < this.state.config.GAME_TILES; x++) {
      for (let y = 0; y < this.state.config.GAME_TILES; y++) {
        if (!this.state.tiles[x]) this.state.tiles[x] = []
        this.state.tiles[x][y].props.x = x
        this.state.tiles[x][y].props.y = y
        if (this.state.animations === false) {
          this.state.tiles[x][y].state.container.x = x * 140
          this.state.tiles[x][y].state.container.y = y * 140
        }
      }
    }
  }
  removeInvisibleTiles () {
    debug('removeInvisibleTiles')
    this.state.game.children.map((child) => {
      if (child.visible === false) {
        remove(this.state.game.children, child)
      }
    })
  }
  getRandomGem (x, y) {
    let type = Math.floor(Math.random() * this.state.config.GAME_TILES_NAMES.length)
    debug('getRandomGem (%s:%s) is %s', x, y, this.state.config.GAME_TILES_NAMES[type])
    return new Gem({
      name: this.state.config.GAME_TILES_NAMES[type],
      x,
      y,
      shift: 0,
      type,
      color: this.state.config.GAME_TILES_COLORS[type],
      texture: this.state.resources[this.state.config.GAME_TILES_NAMES[type]].texture,
      stage: this.state.game
    })
  }
  /**
  Remove clusters and insert tiles
  **/
  resolveClusters () {
    this.findClusters()
    debug('resolveClusters clusters %o', this.state.clusters)
    this.removeClusters()
    this.shiftTiles()
    this.removeInvisibleTiles()
    this.replaceCoordsTiles()
    if (this.state.animations === false) return true
    this.state.clusters.map((cluster) => {
      this.state.currentSoundsGemKill += cluster.length
      if (cluster.length === 4) {
        debug('EXTRA TURN')
      }
      if (cluster.length === 5) {
        debug('EXTRA TURN, MANA BONUS')
      }
      return true
    })
  }
  /**
  Find available moves
  **/
  findMoves () {
    debug('findMoves')
    // Reset moves
    this.state.moves = []
    // Check horizontal swaps
    for (let j = 0; j < this.state.config.GAME_TILES; j++) {
      for (let i = 0; i < this.state.config.GAME_TILES - 1; i++) {
        // Swap, find clusters and swap back
        this.swap(i, j, i + 1, j)
        this.findClusters()
        this.swap(i, j, i + 1, j)
        // Check if the swap made a cluster
        if (this.state.clusters.length > 0) {
          // Found a move
          this.state.moves.push({column1: i, row1: j, column2: i + 1, row2: j})
        }
      }
    }
    // Check vertical swaps
    for (let i = 0; i < this.state.config.GAME_TILES; i++) {
      for (let j = 0; j < this.state.config.GAME_TILES - 1; j++) {
        // Swap, find clusters and swap back
        this.swap(i, j, i, j + 1)
        this.findClusters()
        this.swap(i, j, i, j + 1)
        // Check if the swap made a cluster
        if (this.state.clusters.length > 0) {
          // Found a move
          this.state.moves.push({column1: i, row1: j, column2: i, row2: j + 1})
        }
      }
    }
    // Reset clusters
    this.state.clusters = []
  }
  /**
  Shift tiles and insert new tiles
  **/
  shiftTiles () {
    debug('shiftTiles')
    // Shift tiles
    for (let i = 0; i < this.state.config.GAME_TILES; i++) {
      for (let j = this.state.config.GAME_TILES - 1; j >= 0; j--) {
        // Loop from bottom to top
        if (this.state.tiles[i][j].props.type === -1) {
          // Insert new random tile
          if (this.state.animations === false) {
            this.state.tiles[i][j].state.container.visible = false
            this.state.tiles[i][j] = this.getRandomGem(i, j)
          } else {
            this.addAnimationCreate(i, j)
          }
        } else {
          // Swap tile to shift it
          let shift = this.state.tiles[i][j].props.shift
          if (shift > 0) {
            if (this.state.animations !== false) this.addAnimationMove(i, j, shift)
            this.swap(i, j, i, j + shift)
          }
        }
        // Reset shift
        this.state.tiles[i][j].props.shift = 0
      }
    }
  }
  /**
  Swap two tiles in the level
  **/
  swap (x1, y1, x2, y2) {
    let typeswap = this.state.tiles[x1][y1]
    this.state.tiles[x1][y1] = this.state.tiles[x2][y2]
    this.state.tiles[x2][y2] = typeswap
  }
  /**
  Check if two tiles can be swapped
  **/
  canSwap (x1, y1, x2, y2) {
    // Check if the tile is a direct neighbor of the selected tile
    if ((Math.abs(x1 - x2) === 1 && y1 === y2) || (Math.abs(y1 - y2) === 1 && x1 === x2)) {
      return true
    }
    return false
  }
  /**
  Check if the swap is a good move
  **/
  checkMoves (source, target) {
    let x1 = source.props.x
    let y1 = source.props.y
    let x2 = target.props.x
    let y2 = target.props.y
    debug('checkMoves (%s:%s) (%s:%s)', x1, y1, x2, y2)
    this.swap(x1, y1, x2, y2)
    this.findClusters()
    debug('checkMoves clusters %o', this.state.clusters)
    if (this.state.clusters.length === 0) {
      debug('... unauthorized move')
      // move back
      this.swap(x2, y2, x1, y1)
      Actions.unselectGem()
    } else {
      debug('... resolve move')
      // move source
      this.state.tiles[x1][y1].state.container.x = x1 * 140
      this.state.tiles[x1][y1].state.container.y = y1 * 140
      // move target
      this.state.tiles[x2][y2].state.container.x = x2 * 140
      this.state.tiles[x2][y2].state.container.y = y2 * 140
      // resolve
      this.state.currentSoundsGemKill = 0
      this.state.currentSoundsConsecutiveKill = 1
      this.state.currentSoundsGemKill = 0
      this.state.animations = []
      this.resolveClusters()
      debug('########## ANIMATIONS %s', this.state.animations.length)
      this.animations()
    }
  }
  playPowerfulSounds () {
    debug('consecutive kills=%s', this.state.currentSoundsConsecutiveKill)
    if (this.state.currentSoundsConsecutiveKill === 2) {
      this.state.resources['doubleKill'].sound.play()
    }
    if (this.state.currentSoundsConsecutiveKill === 3) {
      this.state.resources['tripleKill'].sound.play()
    }
    if (this.state.currentSoundsConsecutiveKill === 4) {
      this.state.resources['megaKill'].sound.play()
    }
    if (this.state.currentSoundsConsecutiveKill === 5) {
      this.state.resources['rampage'].sound.play()
    }
    if (this.state.currentSoundsConsecutiveKill >= 6) {
      this.state.resources['rampage'].sound.play()
    }
  }
  animations () {
    this.state.currentAnimations = this.state.animations.shift()
    this.state.currentAnimationsExplode = 0
    this.state.currentAnimationsMove = 0
    this.state.currentAnimationsCreate = 0
    debug('********** currentAnimations %o', this.state.currentAnimations)
    this.animationsExplode()
  }
  animationsExplode () {
    this.state.currentAnimations.explode.map(item => {
      return setTimeout(() => {
        item.tile.on('resolve_explode_complete', () => {
          debug('events >> resolve_explode_complete')
          this.state.currentAnimationsExplode += 1
          if (this.state.currentAnimations.explode.length === this.state.currentAnimationsExplode) {
            debug('all gem has exploded')
            setTimeout(() => {
              if (this.state.currentAnimations.move.length > 0) {
                this.animationsMove()
              } else {
                this.animationsCreate()
              }
            }, 50)
          }
        })
        debug('events >> resolve_explode')
        return item.tile.emit('resolve_explode')
      }, 5 * (this.state.currentAnimations.explode.indexOf(item) + 1))
    })
  }
  animationsMove () {
    this.state.currentAnimations.move.map(item => {
      return setTimeout(() => {
        item.tile.on('resolve_move_complete', () => {
          debug('events >> resolve_move_complete')
          this.state.currentAnimationsMove += 1
          if (this.state.currentAnimations.move.length === this.state.currentAnimationsMove) {
            debug('all gem has moved')
            setTimeout(() => {
              this.animationsCreate()
            }, 50)
          }
        })
        debug('events >> resolve_move')
        return item.tile.emit('resolve_move', item.shift)
      }, 5 * (this.state.currentAnimations.move.indexOf(item) + 1))
    })
  }
  animationsCreate () {
    this.state.currentAnimations.create.map(item => {
      return setTimeout(() => {
        item.tile.on('resolve_create_complete', () => {
          debug('events >> resolve_create_complete')
          this.state.currentAnimationsCreate += 1
          if (this.state.currentAnimations.create.length === this.state.currentAnimationsCreate) {
            debug('all gem has been creeated')
            setTimeout(() => {
              debug('########## DONE')
              setTimeout(() => {
                this.animationsNext()
              }, 50)
            }, 50)
          }
        })
        debug('events >> resolve_create')
        return item.tile.emit('resolve_create', this.state)
      }, 5 * (this.state.currentAnimations.create.indexOf(item) + 1))
    })
  }
  addAnimationExplode (col, row) {
    this.state.animations[this.state.animations.length - 1]['explode'].push({
      col,
      row,
      tile: this.state.tiles[col][row]
    })
  }
  addAnimationCreate (col, row) {
    this.state.animations[this.state.animations.length - 1]['create'].push({
      col,
      row,
      tile: this.state.tiles[col][row]
    })
  }
  addAnimationMove (col, row, shift) {
    this.state.animations[this.state.animations.length - 1]['move'].push({
      col,
      row,
      shift,
      tile: this.state.tiles[col][row]
    })
  }
  /**
  Animation from top to bottom
  **/
  animationsShow () {
    this.state.game.visible = true
    setTimeout(() => {
      this.state.game.y += 10
      if (this.state.game.y < this.props.y + 70) {
        this.animationsShow()
      } else {
        debug('>>> READY TO RUMBLE')
      }
    }, 5)
  }
  animationsNext () {
    if (this.state.animations.length > 0) {
      debug('########## ANIMATIONS %s', this.state.animations.length)
      this.animations()
    } else {
      this.findClusters()
      if (this.state.clusters.length > 0) {
        debug('NEW CLUSTERS FOUND')
        this.state.currentSoundsConsecutiveKill += 1
        this.playPowerfulSounds()
        setTimeout(() => {
          this.state.animations = []
          this.resolveClusters()
          this.animations()
        }, 200)
      } else {
        setTimeout(() => {
          this.findMoves()
          if (this.state.moves.length === 0) {
            return debug('$$$$$$$$$$ NEED TO RECREATE MATCH3 BOARD')
          }
          debug('NO CLUSTERS, MOVES=%s', this.state.moves)
          debug('GEM kills=%s', this.state.currentSoundsGemKill)
          if (this.state.currentSoundsGemKill >= 6 && this.state.currentSoundsGemKill < 12) {
            this.state.resources['killingSpree'].sound.play()
          }
          if (this.state.currentSoundsGemKill >= 12 && this.state.currentSoundsGemKill < 18) {
            this.state.resources['dominating'].sound.play()
          }
          if (this.state.currentSoundsGemKill >= 18) {
            this.state.resources['godLike'].sound.play()
          }
        }, 200)
      }
    }
  }
  componentDidUpdate (prevProps, prevState) {
    if (this.state.resources['festival'] && this.state.music === false) {
      this.state.music = this.state.resources['festival'].sound
      this.state.music.volume = 0
      this.state.music.play({loop: true, singleInstance: true})
    }
    if (this.props.stage === false) return false
    if (this.state.resources === false || this.state.resources === true) return false
    if (this.state.container === false) {
      // background
      this.state.container = new PIXI.Container()
      for (let x = 0; x < this.state.config.GAME_TILES; x++) {
        for (let y = 0; y < this.state.config.GAME_TILES; y++) {
          let tilename = this.state.config.GAME_BGS_NAMES[Math.floor(Math.random() * this.state.config.GAME_BGS_NAMES.length)]
          let texture = this.state.resources[tilename].texture
          let sprite = new PIXI.Sprite(texture)
          sprite.width = 140
          sprite.height = 140
          sprite.x = x * 140
          sprite.y = y * 140
          sprite.width = 140
          sprite.height = 140
          this.state.container.addChild(sprite)
        }
      }
      this.state.container.visible = false
      this.state.container.x = this.props.x
      this.state.container.y = this.props.y
      // gems gameboard
      this.state.game = new PIXI.Container()
      this.state.game.visible = false
      // insert into
      this.props.stage.addChild(this.state.container)
      this.props.stage.addChild(this.state.game)
    }
    if (prevState.currentState !== this.state.currentState && this.state.currentState === 'STATE_FIGHTING_PVP') {
      this.createLevel()
    }
    if (this.state.canSwap !== false && this.state.currentState === 'STATE_FIGHTING_PVP') {
      let source = clone(this.state.canSwap.source)
      let target = clone(this.state.canSwap.target)
      Actions.unselectGem()
      debug('resolve swap gems (%s:%s) (%s:%s)', source.props.x, source.props.y, target.props.x, target.props.y)
      let canSwap = this.canSwap(source.props.x, source.props.y, target.props.x, target.props.y)
      debug('resolve swap is %s', canSwap)
      if (canSwap === false) {
        Actions.unselectGem()
      } else {
        this.checkMoves(source, target)
      }
    }
  }
  componentDidMount () {
    debug('componentDidMount')
  }
  componentWillUnmount () {
    Reflux.Component.prototype.componentWillUnmount.call(this)
  }
  render () {
    if (this.state.container === false) return (null)
    this.state.container.visible = this.state.currentState === 'STATE_FIGHTING_PVP'
    return (null)
  }
}

MatchBoard.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired
}

export default MatchBoard