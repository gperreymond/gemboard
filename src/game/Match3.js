// import findIndex from 'lodash.findindex'
// import clone from 'lodash.clone'

import GemButton from './GemButton'

require('pixi.js/dist/pixi.min.js')
const Container = window.PIXI.Container

class Match3 {
  constructor (options, context) {
    this._options = options
    this._context = context
    this.tiles = []
    this.clusters = []    // { column, row, length, horizontal }
    this.moves = []       // { column1, row1, column2, row2 }
    this.animations = false
  }
  initialize () {
    this._container = new Container()
    this._container.x = 0
    this._container.y = 0
    this._container.width = 800
    this._container.height = 800
    this.createLevel()
    this.findMoves()
    this.findClusters()
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        let gem = this.tiles[x][y].gem
        gem.x = x
        gem.y = y
        gem.move()
        gem.getContainer().on('pointerdown', () => {
          if (this.clusters.length !== 0) return false
          this._context.state.game.selectedGem = gem
          gem.select()
        })
        gem.getContainer().on('pointerup', () => {
          if (this._context.state.game.selectedGem === null) return false
          if (gem.isDown() === true) {
            this._context.state.game.selectedGem = null
            gem.unselect()
          } else {
            let canSwap = this.canSwap(gem.x, gem.y, this._context.state.game.selectedGem.x, this._context.state.game.selectedGem.y)
            if (canSwap === false) {
              this._context.state.game.selectedGem.unselect()
              this._context.state.game.selectedGem = null
            } else {
              // time to check the move
              this.swap(gem.x, gem.y, this._context.state.game.selectedGem.x, this._context.state.game.selectedGem.y)
              this.findClusters()
              if (this.clusters.length === 0) {
                console.log('unauthorized move')
                // move back
                this.swap(this._context.state.game.selectedGem.x, this._context.state.game.selectedGem.y, gem.x, gem.y)
                this._context.state.game.selectedGem.unselect()
                this._context.state.game.selectedGem = null
              } else {
                console.log('valid move')
                let source = gem
                let target = this._context.state.game.selectedGem
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
                this.animations = []
                this.resolveClusters()
                console.log('animations')
                this.animations.map(animations => {
                  console.log('... block')
                  animations.map(animation => {
                    console.log('...... animation', animation)
                    switch (animation.type) {
                      case '1explode':
                        animation.tile.gem.explode()
                        break
                      case '2move':
                        animation.tile.gem.y = animation.row + animation.shift
                        animation.tile.gem.move()
                        break
                      case '3create':
                        break
                    }
                  })
                })
              }
            }
          }
        })
        this._container.addChild(gem.getContainer())
      }
    }
  }
  addAnimationExplode (col, row) {
    this.animations[this.animations.length - 1].push({
      col,
      row,
      type: '1explode',
      tile: this.tiles[col][row]
    })
  }
  addAnimationCreate (col, row) {
    this.animations[this.animations.length - 1].push({
      col,
      row,
      type: '3create',
      tile: this.tiles[col][row]
    })
  }
  addAnimationMove (col, row, shift) {
    this.animations[this.animations.length - 1].push({
      col,
      row,
      type: '2move',
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
      this.resolveClusters()
      // Check if there are valid moves
      this.findMoves()
      // Done when there is a valid move
      if (this.moves.length > 0) {
        done = true
      }
    }
  }
  getRandomTile () {
    let tilecolors = [0x2d4783, 0x990000, 0x369dba, 0x9d5012, 0x71af4a, 0x878c87, 0x953289]
    let tilenames = ['gemWater', 'gemFire', 'gemAir', 'gemEarth', 'gemNature', 'gemDeath', 'gemMagic']
    let type = Math.floor(Math.random() * tilecolors.length)
    return {
      type,
      name: tilenames[type],
      color: tilecolors[type],
      gem: new GemButton({
        color: tilecolors[type],
        texture: this._context.state.game.resources[tilenames[type]].texture
      })
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
    console.log('resolveClusters')
    // Check for clusters
    this.findClusters()
    // While there are clusters left
    while (this.clusters.length > 0) {
      // Remove clusters
      this.removeClusters()
      // Shift tiles
      this.shiftTiles()
      // Check if there are clusters left
      this.findClusters()
    }
  }
  /**
  Remove the clusters
  **/
  removeClusters () {
    console.log('removeClusters')
    if (this.animations !== false) this.animations.push([])
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
    // Shift tiles
    for (let i = 0; i < this._options.cols; i++) {
      for (let j = this._options.rows - 1; j >= 0; j--) {
        // Loop from bottom to top
        if (this.tiles[i][j].type === -1) {
          // Insert new random tile
          this.tiles[i][j] = this.getRandomTile()
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
