// Drawing context
let ctx;
// How big is the population
let totalPopulation = 500;
// All active birds (not yet collided with pipe)
let activeBirds = [];
// All birds for any given population
let allBirds = [];
// Pipes
let pipes = [];
// A frame counter to determine when to add a pipe
let counter = 0;

// Interface elements
let speedSlider;
let speedSpan;
let highScoreSpan;
let allTimeHighScoreSpan;

// All time high score
let highScore = 0;

let canvasHeight;
let cnavasWidth;
let canvasScale = 0.6;

// Images
let backgroundImg = loadImage("img/background.png"); 

let groundImg = loadImage("img/ground.png"); 
let groundHeight = 80 / canvasScale;
let groundSpeed = 6;

let pipeEnd = loadImage("img/pipe_end.png"); 
let pipeBody = loadImage("img/pipe_body.png");

let birdSpriteSheet = loadImage("img/bird.png");
let birdWidth = 92;



function loadImage(src) {
  let image = new Image();
  image.src = src;
  return image;
}

function toogleDebugInfo(elem){
  let info = document.getElementById('debug-info');
  if(info.classList.contains('hidden')){
    document.getElementById('debug-info').classList.remove('hidden');    
    elem.innerText = 'Hide info';
  }
  else {
    document.getElementById('debug-info').classList.add('hidden');    
    elem.innerText = 'Show info';
  }
}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('canvas-container');
  canvasHeight = canvas.height / canvasScale;
  canvasWidth = canvas.width / canvasScale;
  ctx = document.getElementById('defaultCanvas0').getContext('2d');
  
  // Access the interface elements
  speedSlider = select('#speedSlider');
  speedSpan = select('#speed');
  highScoreSpan = select('#hs');
  allTimeHighScoreSpan = select('#ahs');

  // Create a population
  for (let i = 0; i < totalPopulation; i++) {
    let bird = new Bird();
    activeBirds[i] = bird;
    allBirds[i] = bird;
  }
}

function draw() {
  ctx.scale(canvasScale,canvasScale);
  // Draw background
  background('#70C5CE');
  for(let i = 0; i < canvasWidth; i+=backgroundImg.width)
    ctx.drawImage(backgroundImg, i, canvasHeight - groundHeight - backgroundImg.height);


  // Should we speed up cycles per frame
  let cycles = speedSlider.value();
  speedSpan.html(cycles);


  // How many times to advance the game
  for (let n = 0; n < cycles; n++) {
    // Show all the pipes
    for (let i = pipes.length - 1; i >= 0; i--) {
      pipes[i].update();
      if (pipes[i].offscreen()) {
        pipes.splice(i, 1);
      }
    }
    
    // Running all the active birds
    for (let i = activeBirds.length - 1; i >= 0; i--) {
      let bird = activeBirds[i];
      // Bird uses its brain!
      bird.think(pipes);
      bird.update();

      // Check all the pipes
      for (let j = 0; j < pipes.length; j++) {
        // It's hit a pipe
        if (pipes[j].hits(activeBirds[i])) {
          // Remove this bird
          activeBirds.splice(i, 1);
          break;
        }
      }

      if (bird.bottomTop()) {
        activeBirds.splice(i, 1);
      }

    }

    // Add a new pipe every so often
    if (counter % 100 == 0) {
      pipes.push(new Pipe());
    }
    counter++;
  }

  // What is highest score of the current population
  let tempHighScore = 0;
  // Which is the best bird?
  let tempBestBird = null;
  for (let i = 0; i < activeBirds.length; i++) {
    let s = activeBirds[i].score;
    if (s > tempHighScore) {
      tempHighScore = s;
      tempBestBird = activeBirds[i];
    }
  }

  // Is it the all time high scorer?
  if (tempHighScore > highScore) {
    highScore = tempHighScore;
    bestBird = tempBestBird;
  }

  // Update DOM Elements
  highScoreSpan.html(tempHighScore);
  allTimeHighScoreSpan.html(highScore);

  // Draw everything!
  for (let i = 0; i < pipes.length; i++) {
    pipes[i].show();
  }

  for (let i = 0; i < activeBirds.length; i++) {
    activeBirds[i].show();
  }

  // Draw ground here
  for(let i = (-counter * groundSpeed) % groundImg.width - groundImg.width; i <= canvasWidth; i+=groundImg.width)
    ctx.drawImage(groundImg, i, canvasHeight - groundHeight, groundImg.width / canvasScale, groundImg.height / canvasScale);

    
  // If we're out of birds go to the next generation
  if (activeBirds.length == 0) {
    nextGeneration();
  }
}