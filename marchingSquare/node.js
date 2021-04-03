class Node {
  constructor(pos, idx) {
    this.pos = pos
    this.idx = idx
    this.color = color(255, 0, 0)
    this.size = 1
    this.start = false
    this.target = false
    this.visited = false
    this.reached = false
    this.current = false
  }

  show() {
    stroke(this.color)
    strokeWeight(10)
    point(this.pos.x, this.pos.y)
  }

  hide() {
    let i = this.pos.x
    let j = this.pos.y
    //stroke(180)
    //strokeWeight(resolution*0.9)
    //point(this.pos.x, this.pos.y)
    //noStroke()
    //fill(180)
    //rectMode(CENTER)
    //rect(this.pos.x, this.pos.y, resolution*0.9, resolution*0.9)
    let region = map.get(i-resolution/2, j-resolution/2, resolution, resolution)
    image(region, i-resolution/2, j-resolution/2, resolution, resolution)
  }

}

class ControlNode extends Node {

  constructor(pos, idx, active, resolution) {
    super(pos, idx)
    this.resolution = resolution
    this.active = active
    // Node controled by this Control Node
    this.above = createVector(this.pos.x, this.pos.y-resolution/2)
    this.right = createVector(this.pos.x+resolution/2, this.pos.y)
    this.above = this.boundsY(this.above.y) ? new Node(this.above, -1) : null
    this.right = this.boundsX(this.right.x) ? new Node(this.right, -1) : null
    super.color = this.active ? color(0, 0, 0) : color(255, 255, 255)
  }

  boundsX(val) {
    return val > 0  && val < width 
  }

  boundsY(val) {
    return val > 0 && val < height
  }

  show() {
    //this.color = this.start ? color(0, 255, 0) : this.color
    //this.color = this.target ? color(255, 0, 0) : this.color
    this.color = this.active ? color(0, 0, 0) : color(255, 255, 255)
    if (this.reached) {
      this.color = color(255, 255, 0)
    }
    if (this.visited)
      this.color = color(255, 255, 255)
    if (this.current)
      this.color = color(160, 0, 120)
    if (this.start) {
      this.color = color(0, 255, 0)
    }
    if (this.target) {
      this.color = color(255, 0, 0)
    }

    if (this.start || this.current || this.target) {
      strokeWeight(this.resolution*0.9)
    }
    else {
      strokeWeight(this.resolution*0.5)
    }
    stroke(this.color)
    point(this.pos.x, this.pos.y)
    //if (this.above) {
    //  this.above.show()
    //}
    //if (this.right) {
    //  this.right.show()
    //}
  }
}
