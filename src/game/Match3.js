import Debug from 'debug'
import Tile from './Tile'

const Container = window.PIXI.Container

const debug = Debug('gemboard-game:match3')

class Match3 {
  constructor (options, context) {
    this._options = options
    this._context = context
    this.tiles = []
    this.clusters = []    // { column, row, length, horizontal }
    this.moves = []       // { column1, row1, column2, row2 }
    this.animations = false
    this.music = false
  }
  getRandomTile () {
    let tile = new Tile(this._context)
    tile.generate()
    return tile
  }
  initialize () {
    let game = this._context.state.game
    debug('initialize')
    this._container = new Container()
    this._container.x = 0
    this._container.y = 0
    this._container.width = this._context.state.game.BOARD_SIZE * 140
    this._container.height = this._context.state.game.BOARD_SIZE * 140
    this.createLevel()
    this.findMoves()
    this.findClusters()
    for (let x = 0; x < this._context.state.game.BOARD_SIZE; x++) {
      for (let y = 0; y < this._context.state.game.BOARD_SIZE; y++) {
        let tile = this.tiles[x][y]
        tile.x = x
        tile.y = y
        tile.move()
        this._container.addChild(tile.getContainer())
      }
    }
    debug('initialize sizes', game.renderer.width, game.renderer.height, this.getContainer().width, this.getContainer().height)
    debug('initialize sounds')
    this.music = this._context.state.game.resources['festival'].sound
    this.music.volume = 0
    this.music.play({loop: true, singleInstance: true})
  }
  addAnimationExplode (col, row) {
    this.animations[this.animations.length - 1]['explode'].push({
      col,
      row,
      tile: this.tiles[col][row]
    })
  }
  addAnimationCreate (col, row) {
    this.animations[this.animations.length - 1]['create'].push({
      col,
      row,
      tile: this.tiles[col][row]
    })
  }
  addAnimationMove (col, row, shift) {
    this.animations[this.animations.length - 1]['move'].push({
      col,
      row,
      shift,
      tile: this.tiles[col][row]
    })
  }
  getContainer () {
    return this._container
  }
  createLevel () {
    let done = false
    // Keep generating levels until it is correct
    while (!done) {
      // Create a level with random tiles
      for (let i = 0; i < this._options.cols; i++) {
        this.tiles[i] = []
        for (let j = 0; j < this._options.rows; j++) {
          this.tiles[i][j] = this.getRandomTile()
        }
      }
      // Resolve the clusters
      do {
        this.resolveClusters()
      } while (this.clusters.length !== 0)
      // Check if there are valid moves
      this.findMoves()
      // Done when there is a valid move
      if (this.moves.length > 0) {
        done = true
      }
    }
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
  Swap two tiles in the level
  **/
  swap (x1, y1, x2, y2) {
    let typeswap = this.tiles[x1][y1]
    this.tiles[x1][y1] = this.tiles[x2][y2]
    this.tiles[x2][y2] = typeswap
  }
  /**
  Remove clusters and insert tiles
  **/
  resolveClusters () {
    this.findClusters()
    debug('resolveClusters clusters %o', this.clusters)
    this.removeClusters()
    this.shiftTiles()
    if (this.animations === false) return true
    this.clusters.map((cluster) => {
      this._context.state.game.currentSoundsGemKill += cluster.length
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
  Remove the clusters
  **/
  removeClusters () {
    debug('removeClusters')
    if (this.animations !== false) {
      this.animations.push({
        explode: [],
        move: [],
        create: []
      })
    }
    // Change the type of the tiles to -1, indicating a removed tile
    this.loopClusters((index, col, row, cluster) => {
      this.tiles[col][row].type = -1
      if (this.animations !== false) this.addAnimationExplode(col, row)
    })
    // Calculate how much a tile should be shifted downwards
    for (let i = 0; i < this._options.cols; i++) {
      let shift = 0
      for (let j = this._options.rows - 1; j >= 0; j--) {
        // Loop from bottom to top
        if (this.tiles[i][j].type === -1) {
          // Tile is removed, increase shift
          shift++
          this.tiles[i][j].shift = 0
        } else {
          // Set the shift
          this.tiles[i][j].shift = shift
        }
      }
    }
  }
  /**
  Loop over the cluster tiles and execute a function
  **/
  loopClusters (func) {
    for (let i = 0; i < this.clusters.length; i++) {
      //  { column, row, length, horizontal }
      let cluster = this.clusters[i]
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
    for (let i = 0; i < this._options.cols; i++) {
      for (let j = this._options.rows - 1; j >= 0; j--) {
        // Loop from bottom to top
        if (this.tiles[i][j].type === -1) {
          // Insert new random tile
          this.tiles[i][j] = this.getRandomTile()
          this.tiles[i][j].x = i
          this.tiles[i][j].y = j
          if (this.animations !== false) this.addAnimationCreate(i, j)
        } else {
          // Swap tile to shift it
          let shift = this.tiles[i][j].shift
          if (shift > 0) {
            if (this.animations !== false) this.addAnimationMove(i, j, shift)
            this.swap(i, j, i, j + shift)
          }
        }
        // Reset shift
        this.tiles[i][j].shift = 0
      }
    }
  }
  /**
  Find clusters in the level
  **/
  findClusters () {
    // Reset clusters
    this.clusters = []
    // Find horizontal clusters
    for (let j = 0; j < this._options.rows; j++) {
      // Start with a single tile, cluster of 1
      let matchlength = 1
      for (let i = 0; i < this._options.cols; i++) {
        let checkcluster = false
        if (i === this._options.cols - 1) {
          // Last tile
          checkcluster = true
        } else {
          // Check the type of the next tile
          if (this.tiles[i][j].type === this.tiles[i + 1][j].type && this.tiles[i][j].type !== -1) {
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
            this.clusters.push({ column: i + 1 - matchlength, row: j, length: matchlength, horizontal: true })
          }
          matchlength = 1
        }
      }
    }
    // Find vertical clusters
    for (let i = 0; i < this._options.cols; i++) {
      // Start with a single tile, cluster of 1
      let matchlength = 1
      for (let j = 0; j < this._options.rows; j++) {
        let checkcluster = false
        if (j === this._options.rows - 1) {
          // Last tile
          checkcluster = true
        } else {
          // Check the type of the next tile
          if (this.tiles[i][j].type === this.tiles[i][j + 1].type && this.tiles[i][j].type !== -1) {
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
            this.clusters.push({ column: i, row: j + 1 - matchlength, length: matchlength, horizontal: false })
          }
          matchlength = 1
        }
      }
    }
  }
  /**
  Find available moves
  **/
  findMoves () {
    // Reset moves
    this.moves = []
    // Check horizontal swaps
    for (let j = 0; j < this._options.rows; j++) {
      for (let i = 0; i < this._options.cols - 1; i++) {
        // Swap, find clusters and swap back
        this.swap(i, j, i + 1, j)
        this.findClusters()
        this.swap(i, j, i + 1, j)
        // Check if the swap made a cluster
        if (this.clusters.length > 0) {
          // Found a move
          this.moves.push({column1: i, row1: j, column2: i + 1, row2: j})
        }
      }
    }
    // Check vertical swaps
    for (let i = 0; i < this._options.cols; i++) {
      for (let j = 0; j < this._options.rows - 1; j++) {
        // Swap, find clusters and swap back
        this.swap(i, j, i, j + 1)
        this.findClusters()
        this.swap(i, j, i, j + 1)
        // Check if the swap made a cluster
        if (this.clusters.length > 0) {
          // Found a move
          this.moves.push({column1: i, row1: j, column2: i, row2: j + 1})
        }
      }
    }
    // Reset clusters
    this.clusters = []
  }
}

export default Match3
