let resolution = 10
let rows = 0
let cols = 0
let grid
let map
let pathFinder
let state = 'idleing'
let startButton
let resetButton
let generateButton
let BACKGROUND_COLOR = '#c99fbf'

let props = {
  wallsPercent: 20,
  smoothIterations: 2,
  algorithm: 'dfs',
}

const changeState = () => {
  if (state == 'idleing') {
    if (pathFinder.ready()) {
      state = 'searching'
      startButton.innerHTML = 'stop'
      startButton.innerText = 'stop'
    }
  }
  else if (state == 'searching') {
    state = 'stop'
    startButton.innerHTML = 'start'
    startButton.innerText = 'start'
  }
  else if (state == 'stop') {
    state = 'searching'
    startButton.innerHTML = 'stop'
    startButton.innerText = 'stop'
  }
}

const generateNewMap = () => {
  // Reset current map
  resetCurrentMap()
  // Reset map's state
  state = 'idleing'
  startButton.innerHTML = 'start'
  startButton.innerText = 'start'
  // Clear background
  clear()
  background(BACKGROUND_COLOR)
  // Create new canvas
  canvas = createCanvas(800, 800);
  canvas.parent('sketch-container');
  background(BACKGROUND_COLOR)

  grid = new Grid(rows, cols, resolution, props.wallsPercent, props.smoothIterations)
  grid.show()
  map = get()
  pathFinder = new PathFinder(grid.points.slice(), rows, cols)
}

const resetCurrentMap = () => {
  state = 'idleing'
  image(map, 0, 0, width, height)
  pathFinder.reset()
  startButton.innerHTML = 'start'
  startButton.innerText = 'start'
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
  // Create a p5 canvas
  let canvas = createCanvas(800, 800);
  canvas.parent('sketch-container');
  background(BACKGROUND_COLOR)

  props.wallsPercent = document.getElementById('rangevalue1').value;
  props.smoothIterations = document.getElementById('rangevalue2').value;

  startButton = document.getElementById('start-button');
  startButton.onclick = changeState;

  resetButton = document.getElementById('reset-button');
  resetButton.onclick = resetCurrentMap;

  generateButton = document.getElementById('generate-button');
  generateButton.onclick = generateNewMap;


  cols = width / resolution
  rows = height / resolution
  grid = new Grid(rows, cols, resolution, props.wallsPercent, props.smoothIterations)
  grid.show()
  map = get()
  pathFinder = new PathFinder(grid.points.slice(), rows, cols)
}

function draw() {
  if (state == 'searching') {
    pathFinder.iterate()
  }
  props.wallsPercent = document.getElementById('rangevalue1').value;
  props.smoothIterations = document.getElementById('rangevalue2').value;
}
