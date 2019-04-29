// initial variables
var gravity = .4;
var headwind = .1; // speed of platform flow, direction will change per platform?
var humanPlayer;
var humanPlaying;
var pauseBecauseDead = false;

var dieOff = false;

var bestDuckLog; // global
var bestDuckLogYPos = 400; // global

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
    duckSpriteRight = loadImage("images/DuckRT.png");
    duckSpriteLeft = loadImage("images/DuckLT.png");
    goldenDuckSpriteLeft = loadImage("images/BestDuckLT.png");
    goldenDuckSpriteRight = loadImage("images/BestDuckRT.png");
    snakeSprite = loadImage("images/Snake.png");
    beaverRtSprite = loadImage("images/Beaver_rt.png");
    beaverLtSprite = loadImage("images/Beaver_lt.png");
}

function setup() {
    window.canvas = createCanvas(1000, 916); // 636, 916
    player = new Duck();
    pauseBecauseDead = false;
    population = new Population(1000);

    bestDuckLog = []; // set as empty array - zeros each new setup
    deathLog = new DeathLog();
  
    
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
    if (!showNothing){
        writeInfo();
    }
}

function drawBrain() { //show the brain of whatever genome is currently showing
    if (!showNothing){
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
}

function showLuckyDuckData(){
    if (!showNothing){
        var luckyDuck = population.getCurrentBest();
        generationLog = population.log;
        var lastNode = luckyDuck.brain.nodes.length-1;
        //var yStart = luckyDuck.brain.nodes[lastNode].drawPos.y + 350;

        if (luckyDuck != null){
            push();
            translate(650, bestDuckLogYPos);
            textSize(26);
            textAlign(LEFT);
            textFont('Arial Black');
            text("SCORE " + luckyDuck.score.toFixed(0), 0, 0);
            textSize(20);
            text("FITNESS " + luckyDuck.fitness.toFixed(0), 0, 27);
            text("GRAV " + luckyDuck.duckGravity + "  PLAT "+ luckyDuck.platforms.currentPlatform, 0, 51);
            
            text("LOG", 0, 75);
            textAlign(LEFT);
            textSize(16);
            

            i = 0;
            generationLog.forEach(entry => {
                text(entry, 0, 98 + i*20);
                i++;
            });

            if (bestDuckLog.length < 18) {
                bestDuckLog.forEach(entry => {
                    text(entry, 0, 98 + i*20);
                    i++;
                });


            } else {

                i = 0;
                for (j=bestDuckLog.length-17; j<bestDuckLog.length; j++)
                {
                    text(bestDuckLog[j], 0, 158 + i*20);
                    i++;
                }
            }
            

            
            pop();
        }
    }
}

function writeInfo() {
    fill(255);
    stroke(255);
    textFont('Arial Black');

    if (humanPlaying) {
      textSize(50);
      textAlign(CENTER);
      text(humanPlayer.score, 317, 42); 
    } else {
      //
      textSize(26);
      textAlign(LEFT);
      text("GENERATION " + population.gen, 10, 876);
      textAlign(RIGHT);
      text(population.remaining + " ALIVE", 620, 876);
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
