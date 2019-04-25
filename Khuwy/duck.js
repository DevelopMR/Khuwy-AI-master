class Duck {

    constructor() {
      this.x = 430;
      this.y = 785;
      this.velY = 0;
      this.velX = 0;
      this.size = 40;
      this.width = 66; // 132 88
      this.height = 55; // 110 73
      this.dead = false;
      this.isOnGround = true;
      this.deadOnGroundCount = 0;
      this.fallRotation = -PI / 6;
      this.duckGravity = gravity;
      this.log = []; // dear diary for lucky duck
      this.log.push("A new Duck");
    
      /* this.obstacles = new Obstacles(); */
      this.platforms = new Platforms();
      this.atSnake = false;
      this.atUpSnake = false;
      this.atDownSnake = false;
      this.isBest = false;
  
      // genome PROJECT SPECIFIC VISIONS / RESPONSES
      // Vision values
      this.vision0 = 0; // left near
      this.vision1 = 0; // right near
      this.vision2 = 0; // snake 1 (left)
      this.vision3 = 0; // snake 2 (right)
      this.vision4 = 0; // distance to goodies

      // Response values
      this.response0 = 0; // left
      this.response1 = 0; // right
      this.response2 = 0; // up
      this.response3 = 0; // down
  
      //-----------------------------------------------------------------------
      //neat stuff
      this.fitness = 0;
      this.vision = []; //the input array fed into the neuralNet
      this.decision = []; //the out put of the NN
      this.unadjustedFitness;
      this.lifespan = 0; //how long the player lived for this.fitness
      this.bestScore = 0; //stores the this.score achieved used for replay
      this.dead = false;
      this.score = 0;
      this.gen = 0;
  
      this.genomeInputs = 5;
      this.genomeOutputs = 4;
  
      this.brain = new Genome(this.genomeInputs, this.genomeOutputs);
    }
  
  
    show() {
  
      this.platforms.show();

      if(this.isBest){

        if(this.velX > 0){
          image(goldenDuckSpriteRight, this.x, this.y);
        }
        else
        { 
          image(goldenDuckSpriteLeft, this.x, this.y);
        }
        // duck vision
        this.bestVisionHUD();
      }
      else {

        if(this.velX > 0){
          image(duckSpriteRight, this.x, this.y);
        }
        else {
          image(duckSpriteLeft, this.x, this.y);
        }

      }
      
    }
  
    bestVisionHUD(){

      // vision0 = upSnakeDist;
      // vision1 = xPos;
      // vision2 = duckElevation;
      // vision3 = distObstacle;

        // draw visions for Lucky Duck
        push();

        var facingDelta = 0; // allows for vision to meet ducks eyes when facing right
        if (this.velX > 0){
          facingDelta = 34;
        }

        translate(this.x+15, this.y+5); // get to duck eye

        // upSnakeDist
        strokeWeight(1);
        stroke(50,200,50);
        line(0+facingDelta,0, this.vision0, 0);
        line(this.vision0, 0, this.vision0, -10);

        // xPos
          stroke(120);
          line(0+facingDelta,0, -this.vision1, 0);
          line(-this.vision1, -10, -this.vision1, 10);

        // duckElevation
        stroke(255);
        line(0+facingDelta,0,0+facingDelta, this.vision2);
        ellipse(0+facingDelta, this.vision2, 4, 4);


        // distObstacleAbove
        stroke(230,180,30);
        line(0+facingDelta,0,this.vision4, this.platforms.platforms[this.platforms.currentPlatform+1].obstacle.y - this.y+5);
        strokeWeight(2);
        stroke(230,180,50);
        line(0+facingDelta,0,this.vision4, 0);
        line(this.vision4,0,this.vision4, -10);


        // distObstacle
        strokeWeight(1);
        stroke(230, 90, 30);
        line(0 + facingDelta, 0, this.vision3, this.platforms.platforms[this.platforms.currentPlatform].obstacle.y - this.y + 5);
        strokeWeight(2);
        stroke(255, 90, 50);
        line(0 + facingDelta, 0, this.vision3, 0);
        line(this.vision3, 0, this.vision3, 10);
    

        // display duck actions
        stroke(255,0,50);
        strokeWeight(2);
        // left
        if (this.response0 > .6){
          line(0+facingDelta, 0, -15+facingDelta, 0);
          ellipse(-15+facingDelta, 0, 4, 4);
        }
        // right
        if (this.response1 > .6){
          line(0+facingDelta, 0, 15+facingDelta, 0);
          ellipse(15+facingDelta, 0, 4, 4);
        }
        // up
        if (this.response2 > .6){
          line(0+facingDelta, 0, 0+facingDelta, -15);
          ellipse(0+facingDelta, -15, 4, 4);
        }
        // down
        if (this.response3 > .6){
          line(0+facingDelta, 0, 0+facingDelta, 15);
          ellipse(0+facingDelta, 15, 4, 4);
        }

        pop();
    
    }

  
  
    update() {
      this.lifespan++;
      this.updateObstacles();
      this.move();
  
        // THIS NEEDS MOVED INTO PLATFORMS
        this.platforms.currentPlatform = 0;
      // passed first platform
      if (this.y + this.height < this.platforms.platforms[1].y){
          if (!this.platforms.platforms[1].wasReached){
            this.score +=1000; 
            this.platforms.platforms[1].wasReached = true;
            this.platforms.platforms[0].upSnake.scaled = true;
          }
        
        this.platforms.currentPlatform = 1;
      }

      // passed second platform
      if (this.y + this.height < this.platforms.platforms[2].y){
        if (!this.platforms.platforms[2].wasReached){
          this.score +=10000; 
          this.platforms.platforms[2].wasReached = true;
          this.platforms.platforms[1].upSnake.scaled = true;
        }
        
        this.platforms.currentPlatform = 2;
      }

      // passed third platform
      if (this.y + this.height < this.platforms.platforms[3].y){
        if (!this.platforms.platforms[3].wasReached){
          this.score +=50000; 
          this.platforms.platforms[3].wasReached = true;
          this.platforms.platforms[2].upSnake.scaled = true;
        }

        this.platforms.currentPlatform = 3;
      }

      if (!dieOff) {
        this.checkCollisions();
      }

      // update turn score (reward for living)
      this.score++;

    }


    move() {
        this.velY += this.duckGravity;
        this.velX += headwind;
         
        this.velY = constrain(this.velY, -25, 25);
        

        // position from velocity
          this.y += this.velY;
          this.x += this.velX;
      
      }

    updateObstacles() {
      
        for(let i=0; i<this.platforms.platforms.length; i++){
            this.platforms.platforms[i].update();
        }

    }

  
    checkCollisions() {
      if (!this.dead) {
        pauseBecauseDead = false;
      }

      // check all obstacles - MOVE TO OBSTACLES
/*       for(let i=0; i<this.platforms.platforms.length; i++){
        if (this.platforms.platforms[i].obstacle.collided(this))
          {
            this.dead = true;
            pauseBecauseDead = true;
          }
          this.platforms.platforms[i].obstacle.playerPassed(this); // scoring at obstacle
      } */


      if (this.platforms.platforms[this.platforms.currentPlatform].obstacle.collided(this))
      {
        this.dead = true;
        pauseBecauseDead = true;
      }
      //this.platforms.platforms[this.platforms.currentPlatform].obstacle.playerPassed(this); // scoring at obstacle

  
      // check all platforms - MOVE TO PLATFORMS
      if (this.platforms.collided(this)) {

        // check for snakes
        var snake1 = this.platforms.platforms[this.platforms.currentPlatform].upSnake;
        var snake2 = this.platforms.platforms[this.platforms.currentPlatform].downSnake;

        this.atSnake = false;
        this.duckGravity = gravity; // keep for cycle

        snake1.collided(this); // upsnake
        if (snake2 != null){ // downsnake
            snake2.collided(this);
        }

        if (!this.atSnake){
            this.y = this.platforms.platforms[this.platforms.currentPlatform].y - this.height;
        } 
        else if (this.atUpSnake){    
            // just stay on top, check for falls later
            this.y = Math.min(this.platforms.platforms[this.platforms.currentPlatform].y - this.height, this.y);
        }
      }
  

      // boundery checks compound statement
      //   ordered by importance
      if ((this.x > 565)||(this.x < 32)||(this.y > 835)||(this.y < 30))
        {
            this.log.push("I hit a boundary!");
            if(this.isBest){
              bestDuckLog.push("I hit a boundary!");
            }
            this.dead = true;
            pauseBecauseDead = true;
        }

  
      if (this.dead && this.velY < 0) {
        this.velY = 0;
      }
  
  
    }
  


// Duck Movements

    // jump / up
    jump() {
       // if (!this.dead && this.atUpSnake) {
        if (!this.dead && this.atSnake) {
          this.velX = 0;
          this.velY = -3;
          //this.score += 10; //100 // helps tease them up the snake
        } else if ((!this.dead)&&(this.y + this.height == this.platforms.platforms[this.platforms.currentPlatform].y)) {
            //this.duckGravity = gravity; 
          this.velX = 2 * this.velX;
          this.velY = -6;
      }


    }
  
    right(){
      if (!this.dead) {
          this.velX = 4;
      }
    }
  
    left(){
      if (!this.dead) {
          this.velX = -4;
      }
    }

    // down / stop
    down(){
        if (!this.dead && this.atSnake) {
            this.velX = 0;
        this.velY = 2;
        }
        else{
            this.velX = 0;
        }
    }
    
  
    //-------------------------------------------------------------------neat functions
    look() {
      // calc visions
      var currentPlatform = this.platforms.platforms[this.platforms.currentPlatform];
      var abovePlatform = this.platforms.platforms[this.platforms.currentPlatform + 1];
      var upSnake = currentPlatform.upSnake;
      var platformObstacle = currentPlatform.obstacle;
      var platformObstacleAbove = abovePlatform.obstacle; 
      var upSnakeDist = upSnake.x - this.x;
      var duckElevation = 810 - this.y;
      var distObstacle = platformObstacle.x - this.x;
      var distObstacleAbove = platformObstacleAbove.x - this.x;

      this.vision = [];

      this.vision[0] = map(upSnakeDist, -560, 560, -1, 1); // duck can see upSnake 
      this.vision[1] = map(this.x, -560, 560, -1, 1); // duck x position
      this.vision[2] = map(duckElevation, 0, 810, 0, 1); // duck elevation
      this.vision[3] = map(distObstacle , -560, 560, -1, 1); // obstacle
      this.vision[4] = map(distObstacleAbove , -560, 560, -1, 1); // obstacle above
  
        
      // set player object vision properties for display
      this.vision0 = upSnakeDist;
      this.vision1 = this.x;
      this.vision2 = duckElevation;
      this.vision3 = distObstacle;
      this.vision4 = distObstacleAbove;
    }
  
  
    //---------------------------------------------------------------------------------------------------------------------------------------------------------
    //gets the output of the this.brain then converts them to actions
    think() {
  
        var max = 0;
        var maxIndex = 0;
        //get the output of the neural network
        this.decision = this.brain.feedForward(this.vision);
  
        if (this.decision[0] > 0.6) {
          this.left();
        }
  
        if (this.decision[1] > 0.6) {
          this.right();
        }
  
        if (this.decision[2] > 0.6) {
          this.jump(); // up / jump
        }

        if (this.decision[3] > 0.6) {
          this.down();
        }


        this.response0 = this.decision[0];
        this.response1 = this.decision[1];
        this.response2 = this.decision[2];
        this.response3 = this.decision[3];
  
  
      }
      //---------------------------------------------------------------------------------------------------------------------------------------------------------
      //returns a clone of this player with the same brain
    clone() {
      var clone = new Duck();
      clone.brain = this.brain.clone();
      clone.fitness = this.fitness;
      clone.brain.generateNetwork();
      clone.gen = this.gen;
      clone.bestScore = this.score;
      print("cloning done");
      return clone;
    }
  
    //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //since there is some randomness in games sometimes when we want to replay the game we need to remove that randomness
    //this fuction does that
  
    cloneForReplay() {
      var clone = new Duck();
      clone.brain = this.brain.clone();
      clone.fitness = this.fitness;
      clone.brain.generateNetwork();
      clone.gen = this.gen;
      clone.bestScore = this.score;
  
      //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<replace
      return clone;
    }
  
    //---------------------------------------------------------------------------------------------------------------------------------------------------------
    //fot Genetic algorithm
    calculateFitness() {
      //this.fitness = 1 + this.score * this.score + this.lifespan / 20.0;

      this.fitness = 1 + this.score * 2 + this.lifespan / 5.0; //new fitness - LOWER
      
    }
  
    //---------------------------------------------------------------------------------------------------------------------------------------------------------
    crossover(parent2) {
  
      var child = new Duck();
      child.brain = this.brain.crossover(parent2.brain);
      child.brain.generateNetwork();
      return child;
    }
  
  }
  