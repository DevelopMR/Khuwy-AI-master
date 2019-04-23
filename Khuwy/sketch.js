// initial variables
var gravity = .4;
var headwind = .1; // speed of platform flow, direction will change per platform
var humanPlayer;
var humanPlaying;
var pauseBecauseDead = false;

var dieOff = false;

// neat global variables

var nextConnectionNo = 1000;
var population;
var speed = 60;
var superSpeed = 1;
var showBest = false; //true if only show the best of the previous generation
var runBest = false; //true if replaying the best ever game
var humanPlaying = false; //true if the user is playing

var humanPlayer;

var showNothing = false;

// preload - get image assets
function preload() {
    backgroundSprite = loadImage("images/Khuwy_background.png");
    duckSprite = loadImage("images/Duck.png");
    goldenDuckSprite = loadImage("images/BestDuck.png");
    snakeSprite = loadImage("images/Snake.png");
    beaverRtSprite = loadImage("images/Beaver_rt.png");
    beaverLtSprite = loadImage("images/Beaver_lt.png");
}

function setup() {
    window.canvas = createCanvas(1000, 916); // 636, 916
    player = new Duck();
    pauseBecauseDead = false;
    population = new Population(1000);
  
    
    humanPlayer = new Duck(); // MMMM
    //humanPlaying = true;
}


// a cycle?
function draw() {
    drawBackground();

    if (humanPlaying) { 
      showHumanPlaying();
    } else { //if just evolving normally
      if (!population.done()) { //if any players are alive then update them
        population.updateAlive();
      } else { //all dead
        //genetic algorithm
        population.naturalSelection();
      }
    }

    drawOverlay();
    drawBrain();

    showLuckyDuckData();

}

function drawBackground() {
    if (!showNothing){

        fill(150,150,100);
        rect(0, 0, 1000, 916);
        image(backgroundSprite, 0, 0, 636, 916);
    }
}

function drawOverlay(){
    writeInfo();
}

function drawBrain() { //show the brain of whatever genome is currently showing
    var startX = 615; 
    var startY = 10;
    var w = 350;
    var h = 400;
  
    if (runBest) {
      population.bestPlayer.brain.drawGenome(startX, startY, w, h);
    } else if (humanPlaying) {
      showBrain = false;
    } else {
      population.players[0].brain.drawGenomeDetail(startX, startY, w, h, population.getCurrentBest());
    }
}

function showLuckyDuckData()
{
    var luckyDuck = population.getCurrentBest();

    if (luckyDuck != null){
        push();
        translate(675, 370);
        textSize(20);
        textAlign(LEFT);
        textFont('Arial Black');
        text("SCORE " + luckyDuck.score, 0, 0);
        
        text("FITNESS " + luckyDuck.fitness.toFixed(0), 0, 20);
        
        text("LOG", 0, 40);
        textAlign(LEFT);
        textSize(16);
        i = 0;
        luckyDuck.log.forEach(entry => {
            text(entry, 0, 65 + i*20);
            i++;
        });
        pop();
    }

}
function writeInfo() {
    fill(255);
    stroke(255);
    textAlign(LEFT);
    textSize(30);
    textSize(50);
    textAlign(CENTER);
    textFont('Arial Black');
    if (humanPlaying) {
      text(humanPlayer.score, 317, 42); 
    } else {
      var bestCurrentPlayer = population.getCurrentBest();
  
      text(bestCurrentPlayer.score, 317, 42); 
      textSize(26);
      textAlign(LEFT);
      
      text("GENERATION " + population.gen, 10, 883);
      textAlign(RIGHT);
      text(population.remaining + " ALIVE", 620, 883);
    }
  }


//draws the display screen
function showHumanPlaying() {
    if (!humanPlayer.dead) { //if the player isnt dead then move and show the player based on input
        humanPlayer.look();
        humanPlayer.update();
        humanPlayer.show();
    }
    else { //once done return to ai
    }
}

function keyPressed() {
// function keyDown() {
    switch (key) {
        case 'A':
            // move left
            if (humanPlaying) {
                humanPlayer.left();
            }
            else {
            }
            break;

        case 'D':
            // move right
            if (humanPlaying) {
                humanPlayer.right();
            }
            else {
            }
            break;

        case 'W':
            // up / jump
            if (humanPlaying) {
                humanPlayer.jump();
            }
            else {
            }
            break;

        case 'S': // down
            if (humanPlaying) {
                humanPlayer.down();
            }
            else {
            }
            break;


        case 'M': // minimal  
            showNothing = !showNothing;
            break;
    
    }
    //any of the arrow keys
    switch (keyCode) {
        case RIGHT_ARROW: //right is used to move through the generations
            if (showBestEachGen) { //if showing the best player each generation then move on to the next generation
                upToGen++;
                if (upToGen >= population.genPlayers.length) { //if reached the current generation then exit out of the showing generations mode
                    showBestEachGen = false;
                }
                else {
                    genPlayerTemp = population.genPlayers[upToGen].cloneForReplay();
                }
            }
            break;
    }
}
