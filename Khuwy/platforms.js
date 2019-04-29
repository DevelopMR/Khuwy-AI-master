class Platforms {

    constructor() {
      
      this.currentPlatform = 0;

      this.platforms = [];

      var level0Snake = new Snake(83,690);
      var level1Snake = new Snake(503,517);
      var level2Snake = new Snake(51,395);
      var level3Snake = new Snake(504,268);

      var level4Snake = new Snake(273,158);

      this.platforms[0] = new Platform(this, 34, 817, 560, 1, level0Snake, null);
      this.platforms[1] = new Platform(this, 34, 695, 560, -1, level1Snake, level0Snake);
      this.platforms[2] = new Platform(this, 34, 517, 560, 1, level2Snake, level1Snake);
      this.platforms[3] = new Platform(this, 37, 410, 560, -1, level3Snake, level2Snake);

      this.platforms[4] = new Platform(this, 267, 276, 325, 1, level4Snake, level3Snake);
      this.platforms[5] = new Platform(this, 270, 161, 321, -1, null, level4Snake);

    }
  
    show() {

        for (let i = 0; i < this.platforms.length; i++){

            var thisPlatform = this.platforms[i];
            thisPlatform.show();
        }
    
    }
  
  

    collided(p) {

        if (this.platforms[0].collided(p)){
            return true;
        }

        if (this.platforms[1].collided(p)){
            return true;
        }

        if (this.platforms[2].collided(p)){
            return true;
        }

        if (this.platforms[3].collided(p)){
            return true;
        }

      }


  }
  