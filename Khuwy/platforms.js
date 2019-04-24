class Platforms {

    constructor() {
      
      this.currentPlatform = 0;

      this.platforms = [];

      var level0Snake = new Snake(83,680);
      var level1Snake = new Snake(503,507);
      var level2Snake = new Snake(51,385);
      var level3Snake = new Snake(504,258);

      this.platforms[0] = new Platform(this, 34, 817, 560, 1, level0Snake, null);
      this.platforms[1] = new Platform(this, 34, 695, 560, -1, level1Snake, level0Snake);
      this.platforms[2] = new Platform(this, 34, 517, 560, 1, level2Snake, level1Snake);
      this.platforms[3] = new Platform(this, 37, 410, 160, -1, level3Snake, level2Snake);
  
    }
  
    show() {

        for (let i = 0; i < this.platforms.length; i++){

            var thisPlatform = this.platforms[i];
            thisPlatform.show();
        }
    
    }
  
  

    collided(p) {

        if(((p.y + p.height > this.platforms[0].y)&&(p.y < this.platforms[0].y)) || ((p.y + p.height > this.platforms[1].y)&&(p.y < this.platforms[1].y))
            || ((p.y + p.height > this.platforms[2].y)&&(p.y < this.platforms[2].y)) || ((p.y + p.height > this.platforms[3].y)&&(p.y < this.platforms[3].y)))
        {
            return true;
        }
      }


  }
  