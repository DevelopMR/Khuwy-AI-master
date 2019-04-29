class Platform {

    constructor(pParent, xPos, yPos, pWidth, startDir, pUpSnake, pDownSnake) {
      
      this.parent = pParent;
      this.x = xPos;
      this.y = yPos;
      this.width = pWidth;
      this.startDirection = startDir; // 1 or -1

      this.upSnake;
      if (pUpSnake != null){
        this.upSnake = pUpSnake;
      }

      this.downSnake;
      if (pDownSnake != null){
          this.downSnake = pDownSnake;
      }

      this.obstacle = new Obstacle(yPos, startDir, xPos, xPos+  pWidth);

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
      if (this.upSnake != null){
        this.upSnake.show();
      }

      // show obstacles
      this.obstacle.show();

    }
  
  
  
    update() {
        this.obstacle.update();
    }
  
    collided(p) {
      if((p.y + p.height > this.y)&&(p.y < this.y))
        {
            return true;
        }
    }
  }
  