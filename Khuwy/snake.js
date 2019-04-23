class Snake {

    constructor(xPos, yPos) {
      
      this.x = xPos;
      this.y = yPos;
      this.width = 46; // 53
      this.height = 150; // 130
    }
  
    show() {
        
        // image(img, dx, dy, dWidth, dHeight, sx, sy, [sWidth], [sHeight])
        image(snakeSprite, this.x, this.y, this.width, this.height); 
    }
  
  
    update() {
  
    }
  
    collided(p) {
        p.atSnake = false;
        p.atUpSnake = false;
        p.atDownSnake = false;
        p.duckGravity = gravity; // 
        if ((p.x + p.width > this.x) && (p.x < this.x + this.width)){
            //p.duckGravity = gravity;
            
            if ((p.y + p.height > this.y) && (p.y < this.y + this.height)){
                p.atSnake = true;
                p.duckGravity = 0;
                if (this === p.platforms.platforms[p.platforms.currentPlatform].atDownSnake){
                    p.log.push("Over a Terrace Snake.");
                    p.atDownSnake = true;
                }
                else {
                    p.log.push("Under a Terrace Snake.");
                    p.atUpSnake = true;
                }
                
                p.score+= 10 + (this.y + this.height - p.y) / 1000; // added incentive to go to snakes and go up
                
                return true;
            }            
        }

      return false;
    }
  }
  