let resolution = 10
let rows = 0
let cols = 0
let grid
let map
let pathFinder
let state = 'idleing'
let startButton
let resetButton
//let wallsPercent
//let valueDisplay
//let iterDisplay
//let algorithm
//let smoothIterations
//let wallsPercentController
//let algorithmController
//let smoothIterationsController

let props = {
  wallsPercent: 30,
  smoothIterations: 2,
  algorithm: 'dfs',
}


//let guiState = {
//  circle: {
//    size: {display: 'range', value: 25, listen: true},
//    x: {value: 100, listen: true},
//    y: {value: 100, listen: true}
//  },
//  popThreshold: {display: 'range', value: 200, min: 1},
//  bgColor: {display:'color', value: '#3e3e3e'},
//  clearOnFrame: {value: true}
//}
//
//guiState = guiGlue(guiState)

function changeState() {
  if (state == 'idleing') {
    if (pathFinder.ready()) {
      state = 'searching'
      startButton.html('stop')
      console.log(pathFinder.start)
    }
  }
  else if (state == 'searching') {
    state = 'stop'
    startButton.html('start')
  }
  else if (state == 'stop') {
    state = 'searching'
    startButton.html('stop')
  }
}

function generateNewMap() {
  resetCurrentMap()
  clear()
  background(180)
  grid = new Grid(rows, cols, resolution, props.wallsPercent, props.smoothIterations)
  grid.show()
  map = get()
  pathFinder = new PathFinder(grid.points.slice(), rows, cols)
}

function resetCurrentMap() {
  state = 'idleing'
  image(map, 0, 0, width, height)
  pathFinder.reset()
  startButton.html('start')
}

function mousePressed() {
  let x = mouseX
  let y = mouseY
  if (mouseButton == RIGHT) {
    pathFinder.clicked(x, y, 'right')
  }
  else if (mouseButton == LEFT) {
    pathFinder.clicked(x, y, 'left')
  }
}

function setup() {
  document.oncontextmenu = function() { return false; }

  // Create a p5 canvas
  let canvas = createCanvas(800, 800);
  canvas.parent('sketch-container')
  background(180)

  let guiContainer = document.getElementById('tools-container')

  const gui = new dat.GUI({autoPlace: false, height: 100})
  //gui.domElement.id = 'gui'
  guiContainer.appendChild(gui.domElement)
  

  gui.add(props, 'wallsPercent', 0, 100, 1)
    .name('Walls')
    .listen()

  gui.add(props, 'smoothIterations', 0, 10, 1)
    .name('Iterations')
    .listen()

  gui.add(props, 'algorithm', ['dfs', 'bfs', 'aStar'])
    .name('Search Algorithm')
    .listen()

  props.generate = 
    function() {
      generateNewMap()
    }

  gui.add(props, 'generate')
    .name('Generate')

  
  cols = width / resolution
  rows = height / resolution
  grid = new Grid(rows, cols, resolution, props.wallsPercent, props.smoothIterations)
  grid.show()
  map = get()
  pathFinder = new PathFinder(grid.points.slice(), rows, cols)

  startButton = createButton('Start')
  startButton.position(810, 780)
  startButton.mousePressed(changeState)
  startButton.parent('tools-container')
  resetButton = createButton('Reset')
  resetButton.position(895, 780)
  resetButton.mousePressed(resetCurrentMap)
  resetButton.parent('tools-container')
}

function draw() {
  if (state == 'searching') {
    pathFinder.iterate()
  }
}
