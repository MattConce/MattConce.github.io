class PathFinder {
  constructor(grid, rows, cols) {
    this.grid = grid
    this.stack = []
    this.drawStack = []
    this.start = null
    this.target = null
    this.rows = rows
    this.cols = cols
  }

  idx(i, j) {
    return i + j * this.cols
  }

  ready() {
    if (this.start) {
      this.stack.push(this.start)
      return true
    }
    return false
  }

  reset() {
    this.start = null
    this.stack = []
    this.target = null
    this.drawStack = []
    for (let point of this.grid) {
      point.current = false
      point.visited = false
      point.reached = false
      point.target = false
      point.start = false
    }
  }

  clicked(x, y, pressedButton) {
    if (pressedButton == 'left') {
      let found = false
      if (!this.boundsX(x) || !this.boundsY(y))
        return
      for (let point of this.grid) {
        if (!point) continue
        if (point.start == true && p5.Vector.dist(point.pos, createVector(x, y)) > resolution*0.5) {
          point.start = false
          point.hide()
        }

        if (p5.Vector.dist(point.pos, createVector(x, y)) < resolution*0.5 && !found && !point.active) {
          this.start = point
          point.start = true
          point.show()
          found = true
        }
      }
    }
    if (pressedButton == 'right') {
      let found = false
      if (!this.boundsX(x) || !this.boundsY(y))
        return
      for (let point of this.grid) {
        if (!point) continue
        if (point.target == true &&
          p5.Vector.dist(point.pos, createVector(x, y)) > resolution*0.5) {
          point.target = false
          point.hide()
        }

        if (p5.Vector.dist(point.pos, createVector(x, y)) < resolution*0.5 && !found && !point.active) {
          this.target = point
          point.target = true
          point.show()
          found = true
        }
      }
    }
  }

  iterate() {
    if (this.stack.length > 0) {
      let cur = this.stack.pop()
      cur.visited = true
      cur.current = true
      cur.show()
      if (cur == this.target) {
        this.reset()
        return
      }
      for (let neighbor of this.neighbors(cur.idx)) {
        if (!neighbor.visited && !neighbor.active) {
          neighbor.reached = true
          neighbor.show()
          this.stack.push(neighbor)
        }
      }
      if (this.drawStack != 0) {
        let pre = this.drawStack.pop()
        pre.hide()
        pre.show()
      }
      cur.current = false
      this.drawStack.push(cur)
    }
  }
  neighbors(idx) {
    let i = idx % this.cols
    let j = floor(idx / this.rows)
    let neighbors = []
    for (let x = i-1; x <= i+1; x++) {
      for (let y = j-1; y <= j+1; y++) {
        if (!this.boundsX(x * resolution) || !this.boundsY(y * resolution))
        continue
        if (!(x == i && y == j)) {
          neighbors.push(this.grid[x + y * this.cols])
        }
      }
    }
    return neighbors.sort(() => Math.random() - 0.5)
  }

  boundsX(x) {
    return x > 0 && x < width
  }

  boundsY(y) {
    return y > 0 && y < height
  }
}
