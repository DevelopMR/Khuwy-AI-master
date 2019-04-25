class Snake {

    constructor(xPos, yPos) {
      
      this.x = xPos;
      this.y = yPos;
      this.width = 46; 
      this.height = 150; 
      this.scaled = false;
    }
  
    show() {
        
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
                if (this === p.platforms.platforms[p.platforms.currentPlatform].downSnake){
                    p.atDownSnake = true;
                    
                    if (p.log[p.log.length-1]!="Over a Terrace Snake."){
                        p.log.push("Over a Terrace Snake.");
                    }

                    if (p.isBest){
                        if (bestDuckLog[bestDuckLog.length-1]!="Over a Terrace Snake."){
                            bestDuckLog.push("Over a Terrace Snake.");
                        }
                    }
                }
                else {
                    
                    p.atUpSnake = true;

                    if (p.log[p.log.length-1]!="Under a Terrace Snake."){
                        p.log.push("Under a Terrace Snake.");
                    }

                    if (p.isBest){
                        if (bestDuckLog[bestDuckLog.length-1]!="Under a Terrace Snake."){
                            bestDuckLog.push("Under a Terrace Snake.");
                        }
                    }
                }
                
                if (!this.scaled) {
                    p.score+= 2 + (this.y + this.height - p.y) / 1000 + 5*p.platforms.currentPlatform; // added incentive to go to snakes and go up // go minimal!
                }
                
                
                return true;
            }            
        }

      return false;
    }
  }
  