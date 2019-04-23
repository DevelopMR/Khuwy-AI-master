class Obstacles {
    constructor() {
 
        this.obstacles = [];

        // first obstacle
        this.obstacles.push(this.newObstacle());
    }
  
  
    newObstacle()
    {
        return new Obstacle();
    }

    recycleObstacle()
    {
        var removed = this.obstacles.pop();
    }
  
    show() {
      /* this.bottomPipe.show();
      this.topPipe.show(); */
  
    }
  
    update() {
      /* this.bottomPipe.update();
      this.topPipe.update(); */
  
    }
  
  
    offScreen() {
 /*      if (this.bottomPipe.x + this.bottomPipe.width < 0) {
        return true;
      }
      return false; */
  
    }
  
    playerPassed(playerX) {
  /*     if (!this.passed && playerX > this.bottomPipe.x + this.bottomPipe.width) {
        this.passed = true;
        return true;
      }
      return false; */
  
    }
  
    colided(p) {
      /* return this.bottomPipe.colided(p) || this.topPipe.colided(p); */
  
    }
  
    setX(newX) {
   /*    this.bottomPipe.x = newX;
      this.topPipe.x = newX; */
    }
  }
  