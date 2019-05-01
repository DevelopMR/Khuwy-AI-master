class DeathLog{
    constructor (){
        this.log = [];
    }

    addDeadDuck(p){

      // vision0 = upSnakeDist;
      // vision1 = xPos;
      // vision2 = duckElevation;
      // vision3 = distObstacle;
      // vision4 = distObstacle Above


        var duckObit = {
            snake:p.vision0,
            xPos:p.vision1, 
            yPos:p.vision2,
            obst:p.vision3,
            obstAbv:p.vision4,
            life:p.lifespan,
            gen:population.gen,
            fitness:p.fitness
        };

        this.log.push(duckObit);

    }



}