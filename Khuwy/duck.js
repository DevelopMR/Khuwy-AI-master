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
  
      this.genomeInputs = 4;
      this.genomeOutputs = 4;
  
      this.brain = new Genome(this.genomeInputs, this.genomeOutputs);
    }
  
  
    show() {
  
      this.platforms.show();
       

      if(this.isBest){
        image(goldenDuckSprite, this.x, this.y);
      }
      else{
        image(duckSprite, this.x, this.y);
      }
      
    }
  

  
  
    update() {
      this.lifespan++;
      this.updateObstacles();
      this.move();
  
        // THIS NEEDS MOVED INTO PLATFORMS
      // passed first platform
      if (this.y + this.height < this.platforms.platforms[1].y){
          if (!this.platforms.platforms[1].wasReached){
            this.score +=5000; 
            this.platforms.platforms[1].wasReached = true;
          }
        
        this.platforms.currentPlatform = 1;
      }

      // passed second platform
      if (this.y + this.height < this.platforms.platforms[2].y){

        this.score++; 
        
        this.platforms.currentPlatform = 2;
      }

      // passed third platform
      if (this.y + this.height < this.platforms.platforms[3].y){
        this.score++; 
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

      // check all obstacles
      for(let i=0; i<this.platforms.platforms.length; i++){
        if (this.platforms.platforms[i].obstacle.collided(this))
          {
            this.dead = true;
            pauseBecauseDead = true;
          }

          if (this.platforms.platforms[i].obstacle.playerPassed(this)) {
            this.score += 1000; // +1000 points for jumping a fire beaver
          }

      }

  
      // check all platforms
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
          this.score += 100; // helps tease them up the snake
        } else if ((!this.dead)&&(this.y + this.height == this.platforms.platforms[this.platforms.currentPlatform].y)) {
            this.duckGravity = gravity; 
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
      var upSnake = currentPlatform.upSnake;
      var downSnake = currentPlatform.downSnake;
      var platformObstacle = currentPlatform.obstacle;
      var upSnakeDist = this.x - upSnake.x;
      var dnSnakeDist = this.x;
      if (downSnake != null){
        dnSnakeDist = this.x - downSnake.x; // duck can see downSnake
      }
      var duckElevation = 820 - this.y;
      var distObstacle = this.x - platformObstacle.x;

      this.vision = [];

      this.vision[0] = map(upSnakeDist, -560, 560, -1, 1); // duck can see upSnake 
      this.vision[1] = map(dnSnakeDist, -560, 560, -1, 1); // duck can see downSnake 
      this.vision[2] = map(duckElevation, 0, 820, 0, 1); // duck elevation
      this.vision[3] = map(distObstacle , -560, 560, -1, 1); // obstacle
  
        
      // set player object vision properties for display
      this.vision0 = upSnakeDist;
      this.vision1 = dnSnakeDist;
      this.vision2 = duckElevation;
      this.vision3 = distObstacle;
  
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
      this.fitness = 1 + this.score * this.score + this.lifespan / 20.0;
      //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<replace
    }
  
    //---------------------------------------------------------------------------------------------------------------------------------------------------------
    crossover(parent2) {
  
      var child = new Duck();
      child.brain = this.brain.crossover(parent2.brain);
      child.brain.generateNetwork();
      return child;
    }
  
  }
  