function myline(a, b) {
  line(a.x, a.y, b.x, b.y)
}

function drawPolygon(nodes) {
  stroke(0)
  fill(0, 0, 0)
  beginShape()
  for (let node of nodes) {
    vertex(node.x, node.y)
  }
  endShape(CLOSE)
}

class Grid {
  constructor(rows, cols, resolution, wp, st) {
    this.maxIterations = st
    this.resolution = resolution
    this.rows = rows
    this.cols = cols
    this.grid = []
    let seed = 100

    this.points = []
    this.cache = null

    for (let j = 0; j < this.rows; j++) {
      for (let i = 0; i < this.cols; i++) {
        let x = i * resolution + resolution / 2
        let y = j * resolution + resolution / 2
        let active = Math.random() < wp / 100 ? true : false
        if (i == 0 || i == this.cols - 1 || j == 0 || j == this.rows - 1)
          active = true
        this.points[this.idx(i, j)] = new ControlNode(createVector(x, y), this.idx(i, j), active, resolution)
      }
    }

    for (let iteration = 0; iteration < this.maxIterations; iteration++) {
      this.smoothMap()
    }

    for (let j = 0; j < this.rows - 1; j++) {
      for (let i = 0; i < this.cols - 1; i++) {
        let tl = this.points[this.idx(i, j)]
        let tr = i < this.cols ? this.points[this.idx(i + 1, j)] : null
        let br = i < this.cols && j < this.rows ? this.points[this.idx(i + 1, j + 1)] : null
        let bl = j < this.rows ? this.points[this.idx(i, j + 1)] : null
        this.grid[i + j * (this.cols - 1)] = new Square(tl, tr, br, bl)
      }
    }
  }

  find(node) {
    while (node.parent != node)
      node = node.parent
    return node
  }

  smoothMap() {
    for (let j = 1; j < this.rows; j++) {
      for (let i = 1; i < this.cols; i++) {
        let neighbors = this.surroundingWallsCount(i, j)
        if (neighbors > 4) {
          this.points[this.idx(i, j)].active = true
        }
        else if (neighbors < 4) {
          this.points[this.idx(i, j)].active = false
        }
        if (i == 0 || i == this.cols - 1 || j == 0 || j == this.rows - 1)
          this.points[this.idx(i, j)].active = true
      }
    }
  }

  surroundingWallsCount(i, j) {
    let cnt = 0
    for (let x = i - 1; x <= i + 1; x++) {
      for (let y = j - 1; y <= j + 1; y++) {
        if (!this.boundsX(x * this.resolution) || !this.boundsY(y * this.resolution))
          continue
        if (!(x == i && y == j))
          cnt += this.points[this.idx(x, y)].active
      }
    }
    return cnt
  }

  union(nodeA, nodeB) {
    let idA = this.find(nodeA)
    let idB = this.find(nodeB)
    if (idA == idB)
      return
    if (idA.size > idB.size) {
      idB.parent = idA
      idA.size += idB.size
    }
    else {
      idA.parent = idB
      idB.size += idA.size
    }
  }

  boundsX(x) {
    return x > 0 && x < width
  }

  boundsY(y) {
    return y > 0 && y < height
  }

  show() {
    let cnt = 0
    for (let square of this.grid) {

      let state = square.getState()

      let tl = square.controlNodes['tl']
      let tr = square.controlNodes['tr']
      let br = square.controlNodes['br']
      let bl = square.controlNodes['bl']


      let a = square.nodes['above'].pos
      let b = square.nodes['right'].pos
      let c = square.nodes['bottom'].pos
      let d = square.nodes['left'].pos

      switch (state) {
        case 0:
          break
        case 1:
          drawPolygon([bl.pos, c, d])
          break
        case 2:
          drawPolygon([br.pos, c, b])
          break
        case 3:
          drawPolygon([d, b, br.pos, bl.pos])
          break
        case 4:
          drawPolygon([tr.pos, a, b])
          break
        case 5:
          drawPolygon([a, d, bl.pos, c, b, tr.pos])
          break
        case 6:
          drawPolygon([a, c, br.pos, tr.pos])
          break
        case 7:
          drawPolygon([a, d, bl.pos, br.pos, tr.pos])
          break
        case 8:
          drawPolygon([tl.pos, a, d])
          break
        case 9:
          drawPolygon([tl.pos, a, c, bl.pos])
          break
        case 10:
          drawPolygon([tl.pos, d, c, br.pos, b, a])
          break
        case 11:
          drawPolygon([tl.pos, bl.pos, br.pos, b, a])
          break
        case 12:
          drawPolygon([tl.pos, tr.pos, b, d])
          break
        case 13:
          drawPolygon([tl.pos, bl.pos, c, b, tr.pos])
          break
        case 14:
          drawPolygon([tl.pos, d, c, br.pos, tr.pos])
          break
        case 15:
          drawPolygon([tl.pos, bl.pos, br.pos, tr.pos])
          break
        default:
          break
      }
      cnt++
    }

    for (let square of this.grid) {
      if (square) {
        for (let node of Object.values(square.controlNodes)) {
          if (node)
            //node.show()
            continue
        }
      }

    }
  }

  idx(i, j) {
    return i + j * this.cols
  }
}

class Square {
  constructor(tl, tr, br, bl) {
    this.controlNodes = {'tl': tl, 'tr': tr, 'br': br, 'bl': bl}
    //this.nodes = {'above': tl ? tl.right : null, 'right': br ? br.above : null, 
    //  'bottom': bl ? bl.right : null, 'left': bl ? bl.above : null}

    this.nodes = {'above': tl.right, 'right': br.above, 'bottom': bl.right, 'left': bl.above}
  }
  getState() {
    let a = this.controlNodes['tl']
    let b = this.controlNodes['tr']
    let c = this.controlNodes['br']
    let d = this.controlNodes['bl']
    if (a && b && c && d)
      return a.active * 8 + b.active * 4 + c.active * 2 + d.active
    else
      return null
  }
}
