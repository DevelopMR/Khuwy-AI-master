class Platform {

    constructor(pParent, xPos, yPos, pWidth, windDir, pUpSnake, pDownSnake) {
      
      this.parent = pParent;
      this.x = xPos;
      this.y = yPos;
      this.width = pWidth;
      this.windDirection = windDir; // 1 or -1
      this.upSnake = pUpSnake;
      this.downSnake;
      if (pDownSnake != null){
          this.downSnake = pDownSnake;
      }

      this.obstacle = new Obstacle(yPos, windDir);

      this.wasReached = false;
  
    }
  
    show() {

      stroke(55,30,30);
      strokeWeight(1);
      if (this === this.parent.platforms[this.parent.currentPlatform]){
        stroke(155,30,30);
        strokeWeight(3);
      }
      line(this.x, this.y, this.x + this.width, this.y);  

      // show up snake
      this.upSnake.show();
      // show obstacles
      this.obstacle.show();

    }
  
  
  
    update() {
        this.obstacle.update();
    }
  
    collided(p) {
      //return p.y + p.size / 2 >= this.topPixelCoord;
    }
  }
  