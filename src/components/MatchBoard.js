/* eslint jsx-quotes: ["error", "prefer-double"] */

import PropTypes from 'prop-types'
import Reflux from 'reflux'
import remove from 'lodash.remove'
import Debug from 'debug'

import Store from '../GameStore'
import Gem from './elements/Gem'

const PIXI = require('pixi.js')
const debug = Debug('gemboard-game:MatchBoard')

class MatchBoard extends Reflux.Component {
  constructor (props) {
    debug('constructor')
    super(props)
    this.state = {
      container: false,
      game: false,
      tiles: [],
      moves: [],
      clusters: [],
      animations: false
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
          this.state.tiles[x][y] = this.getRandomTile(x, y)
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
        debug('>>> CREATE LEVEL END')
        console.log(this.state.game.children.length)
        this.animationsShow()
      }
    }
  }
  getRandomTile (x, y) {
    // remove old
    console.log(this.state.tiles[x][y])
    remove(this.state.game.children, this.state.tiles[x][y])
    // add new
    let random = Math.floor(Math.random() * this.state.config.GAME_TILES_NAMES.length)
    return new Gem({
      x,
      y,
      shift: 0,
      type: random,
      color: this.state.config.GAME_TILES_COLORS[random],
      texture: this.state.resources[this.state.config.GAME_TILES_NAMES[random]].texture,
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
    if (this.state.animations === false) return true
    this.state.clusters.map((cluster) => {
      // WARNING! this._context.state.game.currentSoundsGemKill += cluster.length
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
  Swap two tiles in the level
  **/
  swap (x1, y1, x2, y2) {
    let typeswap = this.state.tiles[x1][y1]
    this.state.tiles[x1][y1] = this.state.tiles[x2][y2]
    this.state.tiles[x2][y2] = typeswap
  }
  /**
  Find clusters in the level
  **/
  findClusters () {
    // Reset clusters
    this.state.clusters = []
    // Find horizontal clusters
    for (let j = 0; j < this.state.config.GAME_TILES; j++) {
      // Start with a single tile, cluster of 1
      let matchlength = 1
      for (let i = 0; i < this.state.config.GAME_TILES; i++) {
        let checkcluster = false
        if (i === this.state.config.GAME_TILES - 1) {
          // Last tile
          checkcluster = true
        } else {
          // Check the type of the next tile
          if (this.state.tiles[i][j].props.type === this.state.tiles[i + 1][j].props.type && this.state.tiles[i][j].props.type !== -1) {
            // Same type as the previous tile, increase matchlength
            matchlength += 1
          } else {
            // Different type
            checkcluster = true
          }
        }
        // Check if there was a cluster
        if (checkcluster) {
          if (matchlength >= 3) {
            // Found a horizontal cluster
            this.state.clusters.push({ column: i + 1 - matchlength, row: j, length: matchlength, horizontal: true })
          }
          matchlength = 1
        }
      }
    }
    // Find vertical clusters
    for (let i = 0; i < this.state.config.GAME_TILES; i++) {
      // Start with a single tile, cluster of 1
      let matchlength = 1
      for (let j = 0; j < this.state.config.GAME_TILES; j++) {
        let checkcluster = false
        if (j === this.state.config.GAME_TILES - 1) {
          // Last tile
          checkcluster = true
        } else {
          // Check the type of the next tile
          if (this.state.tiles[i][j].props.type === this.state.tiles[i][j + 1].props.type && this.state.tiles[i][j].props.type !== -1) {
            // Same type as the previous tile, increase matchlength
            matchlength += 1
          } else {
            // Different type
            checkcluster = true
          }
        }
        // Check if there was a cluster
        if (checkcluster) {
          if (matchlength >= 3) {
            // Found a vertical cluster
            this.state.clusters.push({ column: i, row: j + 1 - matchlength, length: matchlength, horizontal: false })
          }
          matchlength = 1
        }
      }
    }
  }
  /**
  Remove the clusters
  **/
  removeClusters () {
    if (this.state.animations !== false) {
      debug('removeClusters with effects')
      this.state.animations.push({
        explode: [],
        move: [],
        create: []
      })
    } else {
      debug('removeClusters without any effect')
    }
    // Change the type of the tiles to -1, indicating a removed tile
    this.loopClusters((index, col, row, cluster) => {
      this.state.tiles[col][row].props.type = -1
      if (this.state.animations !== false) this.addAnimationExplode(col, row)
    })
    // Calculate how much a tile should be shifted downwards
    for (let i = 0; i < this.state.config.GAME_TILES; i++) {
      let shift = 0
      for (let j = this.state.config.GAME_TILES - 1; j >= 0; j--) {
        // Loop from bottom to top
        if (this.state.tiles[i][j].props.type === -1) {
          // Tile is removed, increase shift
          shift++
          this.state.tiles[i][j].props.shift = 0
        } else {
          // Set the shift
          this.state.tiles[i][j].props.shift = shift
        }
      }
    }
  }
  /**
  Loop over the cluster tiles and execute a function
  **/
  loopClusters (func) {
    for (let i = 0; i < this.state.clusters.length; i++) {
      //  { column, row, length, horizontal }
      let cluster = this.state.clusters[i]
      let coffset = 0
      let roffset = 0
      for (let j = 0; j < cluster.length; j++) {
        func(i, cluster.column + coffset, cluster.row + roffset, cluster)
        if (cluster.horizontal) {
          coffset++
        } else {
          roffset++
        }
      }
    }
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
          this.state.tiles[i][j] = this.getRandomTile(i, j)
          if (this.state.animations !== false) this.addAnimationCreate(i, j)
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
  componentDidUpdate (prevProps, prevState) {
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
    if (prevState.currentState !== this.state.currentState && this.state.currentState === 'STATE_FIGHTING') {
      this.createLevel()
    }
  }
  componentWillUnmount () {
    Reflux.Component.prototype.componentWillUnmount.call(this)
  }
  render () {
    if (this.state.container === false) return (null)
    this.state.container.visible = this.state.currentState === 'STATE_FIGHTING'
    return (null)
  }
}

MatchBoard.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired
}

export default MatchBoard
