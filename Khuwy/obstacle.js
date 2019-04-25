class Obstacle {
    constructor(yPos, windDir) {
 
        this.height = 16;
        this.width = 44;
        this.x=32;

        if (windDir < 0){
            this.x=570;
        }
        this.y=yPos - this.height;
        this.xVel = windDir * (.85 + random(2.5));

        this.wasPassed = false;
        this.passesRemaining = 3;
    }
  
  
  
    show() {
      
        if (this.xVel < 0){
            image(beaverLtSprite, this.x, this.y);
        } else {
            image(beaverRtSprite, this.x, this.y);
        }
        
    }
  
    update() {
      
        this.x += this.xVel; 
        if ((this.x < 32)||(this.x > 591)){
            this.xVel = -this.xVel;
            this.wasPassed = false;
        }
  
    }
  
  
    playerPassed(p) {

        if (this.xVel > 0) {
            if (p.x + p.width < this.x) {
                this.wasPassed = !this.wasPassed;
                p.log.push("Jumped a Fire Beaver!");
                this.passesRemaining--;
                if (this.passesRemaining > 0){
                    p.score += 5 * this.passesRemaining * p.platforms.currentPlatform;
                }

                if (p.isBest) {
                    bestDuckLog.push("Jumped a Fire Beaver!");
                }

                return true;
            }
        }
        if (this.xVel < 0) {
            if (p.x < this.x + this.width) {
                this.wasPassed = !this.wasPassed;
                p.log.push("Jumped th Fire Beaver!");
                this.passesRemaining--;
                if (this.passesRemaining > 0){
                    p.score += 5 * this.passesRemaining * p.platforms.currentPlatform;
                }

                if (p.isBest) {
                    bestDuckLog.push("Jumped he Fire Beaver!");
                }

                return true;
            }
        }

        
        return false;
    }
  
    collided(p) {

        // padding added (+13/-5) for duck feet in x below 
       if ((p.x + p.width - 5 > this.x) && (p.x + 13 < this.x + this.width)){
         if ((p.y + p.height > this.y) && (p.y < this.y + this.height)){
            p.log.push("Ouch, hit a Fire Beaver!");
            if (p.isBest){
                bestDuckLog.push("Ouch, hit a Fire Beaver!");
            }

             return true;
         }
         else if (p.y + p.height < this.y){

            p.log.push("Jumping a beaver!");
            if (p.isBest){
                bestDuckLog.push("Jumping a beaver!");
            }

            p.score += 4 * (p.platforms.currentPlatform + 1);
            return false;

         }

       } 

       return false;
  
    }
  

  }
  