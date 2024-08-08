const WIDTH = 800;
const HEIGHT = 800;
const SIZE = 3;
const SLIDE_SPEED = 0.8;

let puzzle;
let shuffleMovesLeft = 0;
let shuffling = false;
let algorithmUsed = "bfs";
let solving = false;
let showNumbers= true;
let moves = [];
let mi;
let takesteps = false;
let images = [];
let img;
let startTime;
let endTime;

function preload() {
  // Preload images into the array
  for (let i = 1; i <= 4; i++) {
    images[i - 1] = loadImage(`images/img${i}.jpg`);
  }
}

function setup() {
  createCanvas(WIDTH, HEIGHT);

  // Initialize img with a random image from the images array
  img = images[int(random(images.length))];

  if (img) {
    img = resizeImage(img, WIDTH, HEIGHT);
  }

  puzzle = new Puzzle(SIZE, img);
  mi = 0;

  const shuffleSlider = document.getElementById('shuffleSlider');
  const shuffleMovesDisplay = document.getElementById('shuffleValue');
  const algorithmSelect = document.getElementById('algorithmSelect');
  const startShuffleButton = document.getElementById('shuffleButton');
  const startSolveButton = document.getElementById('solveButton');
  const showNumbersCheckbox = document.getElementById('showNumbersCheckbox');

  shuffleSlider.value = shuffleMovesLeft;
  shuffleMovesDisplay.innerText = shuffleMovesLeft;

  shuffleSlider.oninput = function () {
    shuffleMovesLeft = this.value;
    shuffleMovesDisplay.innerText = shuffleMovesLeft;
    console.log("Shuffle moves set to:", shuffleMovesLeft);
  };

  algorithmSelect.onchange = function () {
    algorithmUsed = this.value;
    console.log(`Algorithm used: ${algorithmUsed}`);
  };

  startShuffleButton.onclick = startShuffling;
  startSolveButton.onclick = startSolving;

  // Checkbox event listener
  showNumbersCheckbox.checked = showNumbers; // Initialize checkbox state
  showNumbersCheckbox.addEventListener('change', function () {
    showNumbers = this.checked;
    console.log("Show Numbers:", showNumbers);
  });
}


function resizeImage(img, width, height) {
  let cropSize = min(img.width, img.height);
  let xOffset = (img.width - cropSize) / 2;
  let yOffset = 0;
  let resizedImg = createImage(width, height);
  resizedImg.copy(img, xOffset, yOffset, cropSize, cropSize, 0, 0, width, height);
  return resizedImg;
}

function draw() {
  background(51);
  shufflePuzzle();
  if (takesteps) {
    moveStep(moves);
  }
  puzzle.update();
  puzzle.show();
}

function mousePressed() {
  if (puzzle) {
    if (mouseX >= 0 && mouseX < WIDTH && mouseY >= 0 && mouseY < HEIGHT)
      puzzle.moveTile(mouseX, mouseY);
  }
}

function shufflePuzzle() {
  if (shuffleMovesLeft > 0 && !puzzle.isAnimating()) {
    puzzle.moveRandom();
    shuffleMovesLeft--;
    console.log("Moves left:", shuffleMovesLeft);
  }
}

function moveStep(moves) {
  let movelen = moves.length;
  let legalMoves = puzzle.getLegalBlankMoves();
  if (mi < movelen) {
    if (!puzzle.isAnimating()) {
      if (legalMoves.includes(moves[mi])) {
        puzzle.moveBlankTile(moves[mi]);
        mi++;
      } else {
        console.log("Illegal move:", moves[mi]);
        takesteps = false;
      }
    }
  } else {
    console.log("Done");
    moves = [];
    takesteps = false;
  }
}

function startShuffling() {
  // Reinitialize the puzzle with the same parameters to reset its state
  puzzle = new Puzzle(SIZE, img);
  shuffling = true;
  shuffleMovesLeft = parseInt(document.getElementById('shuffleSlider').value, 10);
  console.log("Shuffling with", shuffleMovesLeft, "moves left.");
  shuffling = false;
}

function startSolving() {
  const algorithms = {
    'bfs': bfsPath,
    'dfs': dfsPath,
    'bestfs': bestFirstSearchPath,
    'idfs': idfsPath,
    'astar': aStarPath,
    'ida': idaStarPath
  };

  const algorithmFunc = algorithms[algorithmUsed];
  if (algorithmFunc) {
    const result = algorithmFunc(puzzle);
    moves = result.moves;
    document.getElementById('timeDisplay').innerText = `Time Taken to find Solution : ${result.time} ms`;
    document.getElementById('movesDisplay').innerText = `Moves to solve : ${moves.length}`;
    takesteps = true;
    mi = 0;// Start the step-by-step process
    console.log("Taking steps:", takesteps);
    console.log(result);
  } else {
    console.log('Invalid algorithm');
  }
}



function keyPressed() {
  if (key === ' ') {
    takesteps = !takesteps;
    mi = 0;
    console.log("Taking steps:", takesteps);
    return;
  }

  const algorithms = {
    'b': { name: "bfs", func: bfsPath },
    'd': { name: "dfs", func: dfsPath },
    'f': { name: "Bestfs", func: bestFirstSearchPath },
    'i': { name: "idfs", func: idfsPath },
    'a': { name: "A*", func: aStarPath },
    's': { name: "IDA*", func: idaStarPath },
    // 'g': { name: "Genetic", func: geneticAlgorithmPath } cant be used because legal moves are not defined in the puzzle class
  };

  if (key in algorithms) {
    const alg = algorithms[key];
    algorithmUsed = alg.name;
    console.log(`Algorithm used: ${algorithmUsed}`);
    const result = alg.func(puzzle);
    moves = result.moves;
    console.log(result);
    //takesteps = true; // Start the step-by-step process
  }
}
