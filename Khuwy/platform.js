class Platform {

    constructor(xPos, yPos, pWidth, windDir, pUpSnake, pDownSnake) {
      
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
  