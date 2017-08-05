class Match3 {
  constructor (options, context) {
    this._options = options
    this._context = context
    this.clusters = []    // { column, row, length, horizontal }
    this.moves = []       // { column1, row1, column2, row2 }
  }
  createLevel () {
    console.log('createLevel')
    let done = false
    this.tiles = []
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
    let tilecolors = [0x2d4783, 0xc93402, 0x369dba, 0x9d5012, 0x71af4a, 0x555555, 0x953289]
    let tilename = ['gemWater', 'gemFire', 'gemAir', 'gemEarth', 'gemNature', 'gemDeath', 'gemMagic']
    let type = Math.floor(Math.random() * tilecolors.length)
    return {
      type,
      color: tilecolors[type],
      sprite: tilename[type] || false
    }
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
    // Change the type of the tiles to -1, indicating a removed tile
    this.loopClusters((index, column, row, cluster) => { this.tiles[column][row].type = -1 })
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
    console.log('loopClusters')
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
        } else {
          // Swap tile to shift it
          let shift = this.tiles[i][j].shift
          if (shift > 0) {
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
    console.log('findClusters')
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
    console.log('findMoves')
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
