class Genome {
    constructor(inputs, outputs, crossover) {
      this.genes = []; //a list of connections between this.nodes which represent the NN
      this.nodes = [];
      this.inputs = inputs;
      this.outputs = outputs;
      this.layers = 2;
      this.nextNode = 0;
      // this.biasNode;
      this.network = []; //a list of the this.nodes in the order that they need to be considered in the NN
      //create input this.nodes
  
      if (crossover) {
        return;
      }
  
      for (var i = 0; i < this.inputs; i++) {
        this.nodes.push(new Node(i));
        this.nextNode++;
        this.nodes[i].layer = 0;
      }
  
      //create output this.nodes
      for (var i = 0; i < this.outputs; i++) {
        this.nodes.push(new Node(i + this.inputs));
        this.nodes[i + this.inputs].layer = 1;
        this.nextNode++;
      }
  
      this.nodes.push(new Node(this.nextNode)); //bias node
      this.biasNode = this.nextNode;
      this.nextNode++;
      this.nodes[this.biasNode].layer = 0;
  
  
  
    }
  
  
    fullyConnect(innovationHistory) {
  
      //this will be a new number if no identical genome has mutated in the same
  
      for (var i = 0; i < this.inputs; i++) {
        for (var j = 0; j < this.outputs; j++) {
          var connectionInnovationNumber = this.getInnovationNumber(innovationHistory, this.nodes[i], this.nodes[this.nodes.length - j - 2]);
          this.genes.push(new connectionGene(this.nodes[i], this.nodes[this.nodes.length - j - 2], random(-1, 1), connectionInnovationNumber));
        }
      }
  
      var connectionInnovationNumber = this.getInnovationNumber(innovationHistory, this.nodes[this.biasNode], this.nodes[this.nodes.length - 2]);
      this.genes.push(new connectionGene(this.nodes[this.biasNode], this.nodes[this.nodes.length - 2], random(-1, 1), connectionInnovationNumber));
      //
      // connectionInnovationNumber = this.getInnovationNumber(innovationHistory, this.nodes[this.biasNode], this.nodes[this.nodes.length - 3]);
      // this.genes.push(new connectionGene(this.nodes[this.biasNode], this.nodes[this.nodes.length - 3], random(-1, 1), connectionInnovationNumber));
      // //add the connection with a random array
  
  
      //changed this so if error here
      this.connectNodes();
    }
  
  
  
    //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //returns the node with a matching number
    //sometimes the this.nodes will not be in order
    getNode(nodeNumber) {
      for (var i = 0; i < this.nodes.length; i++) {
        if (this.nodes[i].number == nodeNumber) {
          return this.nodes[i];
        }
      }
      return null;
    }
  
  
    //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //adds the conenctions going out of a node to that node so that it can acess the next node during feeding forward
    connectNodes() {
  
      for (var i = 0; i < this.nodes.length; i++) { //clear the connections
        this.nodes[i].outputConnections = [];
      }
  
      for (var i = 0; i < this.genes.length; i++) { //for each connectionGene
        this.genes[i].fromNode.outputConnections.push(this.genes[i]); //add it to node
      }
    }
  
    //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //feeding in input values varo the NN and returning output array
    feedForward(inputValues) {
      //set the outputs of the input this.nodes
      for (var i = 0; i < this.inputs; i++) {
        this.nodes[i].outputValue = inputValues[i];
      }
      this.nodes[this.biasNode].outputValue = 1; //output of bias is 1
  
      for (var i = 0; i < this.network.length; i++) { //for each node in the network engage it(see node class for what this does)
        this.network[i].engage();
      }
  
      //the outputs are this.nodes[inputs] to this.nodes [inputs+outputs-1]
      var outs = [];
      for (var i = 0; i < this.outputs; i++) {
        outs[i] = this.nodes[this.inputs + i].outputValue;
      }
  
      for (var i = 0; i < this.nodes.length; i++) { //reset all the this.nodes for the next feed forward
        this.nodes[i].inputSum = 0;
      }
  
      return outs;
    }
  
    //----------------------------------------------------------------------------------------------------------------------------------------
    //sets up the NN as a list of this.nodes in order to be engaged
  
    generateNetwork() {
        this.connectNodes();
        this.network = [];
        //for each layer add the node in that layer, since layers cannot connect to themselves there is no need to order the this.nodes within a layer
  
        for (var l = 0; l < this.layers; l++) { //for each layer
          for (var i = 0; i < this.nodes.length; i++) { //for each node
            if (this.nodes[i].layer == l) { //if that node is in that layer
              this.network.push(this.nodes[i]);
            }
          }
        }
      }
      //-----------------------------------------------------------------------------------------------------------------------------------------
      //mutate the NN by adding a new node
      //it does this by picking a random connection and disabling it then 2 new connections are added
      //1 between the input node of the disabled connection and the new node
      //and the other between the new node and the output of the disabled connection
    addNode(innovationHistory) {
      //pick a random connection to create a node between
      if (this.genes.length == 0) {
        this.addConnection(innovationHistory);
        return;
      }
      var randomConnection = floor(random(this.genes.length));
  
      while (this.genes[randomConnection].fromNode == this.nodes[this.biasNode] && this.genes.length != 1) { //dont disconnect bias
        randomConnection = floor(random(this.genes.length));
      }
  
      this.genes[randomConnection].enabled = false; //disable it
  
      var newNodeNo = this.nextNode;
      this.nodes.push(new Node(newNodeNo));
      this.nextNode++;
      //add a new connection to the new node with a weight of 1
      var connectionInnovationNumber = this.getInnovationNumber(innovationHistory, this.genes[randomConnection].fromNode, this.getNode(newNodeNo));
      this.genes.push(new connectionGene(this.genes[randomConnection].fromNode, this.getNode(newNodeNo), 1, connectionInnovationNumber));
  
  
      connectionInnovationNumber = this.getInnovationNumber(innovationHistory, this.getNode(newNodeNo), this.genes[randomConnection].toNode);
      //add a new connection from the new node with a weight the same as the disabled connection
      this.genes.push(new connectionGene(this.getNode(newNodeNo), this.genes[randomConnection].toNode, this.genes[randomConnection].weight, connectionInnovationNumber));
      this.getNode(newNodeNo).layer = this.genes[randomConnection].fromNode.layer + 1;
  
  
      connectionInnovationNumber = this.getInnovationNumber(innovationHistory, this.nodes[this.biasNode], this.getNode(newNodeNo));
      //connect the bias to the new node with a weight of 0
      this.genes.push(new connectionGene(this.nodes[this.biasNode], this.getNode(newNodeNo), 0, connectionInnovationNumber));
  
      //if the layer of the new node is equal to the layer of the output node of the old connection then a new layer needs to be created
      //more accurately the layer numbers of all layers equal to or greater than this new node need to be incrimented
      if (this.getNode(newNodeNo).layer == this.genes[randomConnection].toNode.layer) {
        for (var i = 0; i < this.nodes.length - 1; i++) { //dont include this newest node
          if (this.nodes[i].layer >= this.getNode(newNodeNo).layer) {
            this.nodes[i].layer++;
          }
        }
        this.layers++;
      }
      this.connectNodes();
    }
  
    //------------------------------------------------------------------------------------------------------------------
    //adds a connection between 2 this.nodes which aren't currently connected
    addConnection(innovationHistory) {
        //cannot add a connection to a fully connected network
        if (this.fullyConnected()) {
          console.log("connection failed");
          return;
        }
  
  
        //get random this.nodes
        var randomNode1 = floor(random(this.nodes.length));
        var randomNode2 = floor(random(this.nodes.length));
        while (this.randomConnectionNodesAreShit(randomNode1, randomNode2)) { //while the random this.nodes are no good
          //get new ones
          randomNode1 = floor(random(this.nodes.length));
          randomNode2 = floor(random(this.nodes.length));
        }
        var temp;
        if (this.nodes[randomNode1].layer > this.nodes[randomNode2].layer) { //if the first random node is after the second then switch
          temp = randomNode2;
          randomNode2 = randomNode1;
          randomNode1 = temp;
        }
  
        //get the innovation number of the connection
        //this will be a new number if no identical genome has mutated in the same way
        var connectionInnovationNumber = this.getInnovationNumber(innovationHistory, this.nodes[randomNode1], this.nodes[randomNode2]);
        //add the connection with a random array
  
        this.genes.push(new connectionGene(this.nodes[randomNode1], this.nodes[randomNode2], random(-1, 1), connectionInnovationNumber)); //changed this so if error here
        this.connectNodes();
      }
      //-------------------------------------------------------------------------------------------------------------------------------------------
    randomConnectionNodesAreShit(r1, r2) {
      if (this.nodes[r1].layer == this.nodes[r2].layer) return true; // if the this.nodes are in the same layer
      if (this.nodes[r1].isConnectedTo(this.nodes[r2])) return true; //if the this.nodes are already connected
  
  
  
      return false;
    }
  
    //-------------------------------------------------------------------------------------------------------------------------------------------
    //returns the innovation number for the new mutation
    //if this mutation has never been seen before then it will be given a new unique innovation number
    //if this mutation matches a previous mutation then it will be given the same innovation number as the previous one
    getInnovationNumber(innovationHistory, from, to) {
        var isNew = true;
        var connectionInnovationNumber = nextConnectionNo;
        for (var i = 0; i < innovationHistory.length; i++) { //for each previous mutation
          if (innovationHistory[i].matches(this, from, to)) { //if match found
            isNew = false; //its not a new mutation
            connectionInnovationNumber = innovationHistory[i].innovationNumber; //set the innovation number as the innovation number of the match
            break;
          }
        }
  
        if (isNew) { //if the mutation is new then create an arrayList of varegers representing the current state of the genome
          var innoNumbers = [];
          for (var i = 0; i < this.genes.length; i++) { //set the innovation numbers
            innoNumbers.push(this.genes[i].innovationNo);
          }
  
          //then add this mutation to the innovationHistory
          innovationHistory.push(new connectionHistory(from.number, to.number, connectionInnovationNumber, innoNumbers));
          nextConnectionNo++;
        }
        return connectionInnovationNumber;
      }
      //----------------------------------------------------------------------------------------------------------------------------------------
  
    //returns whether the network is fully connected or not
    fullyConnected() {
  
      var maxConnections = 0;
      var nodesInLayers = []; //array which stored the amount of this.nodes in each layer
      for (var i = 0; i < this.layers; i++) {
        nodesInLayers[i] = 0;
      }
      //populate array
      for (var i = 0; i < this.nodes.length; i++) {
        nodesInLayers[this.nodes[i].layer] += 1;
      }
      //for each layer the maximum amount of connections is the number in this layer * the number of this.nodes infront of it
      //so lets add the max for each layer together and then we will get the maximum amount of connections in the network
      for (var i = 0; i < this.layers - 1; i++) {
        var nodesInFront = 0;
        for (var j = i + 1; j < this.layers; j++) { //for each layer infront of this layer
          nodesInFront += nodesInLayers[j]; //add up this.nodes
        }
  
        maxConnections += nodesInLayers[i] * nodesInFront;
      }
      if (maxConnections <= this.genes.length) { //if the number of connections is equal to the max number of connections possible then it is full
        return true;
      }
  
      return false;
    }
  
  
    //-------------------------------------------------------------------------------------------------------------------------------
    //mutates the genome
    mutate(innovationHistory) {
      if (this.genes.length == 0) {
        this.addConnection(innovationHistory);
      }
  
  
      var rand1 = random(1);
      if (rand1 < 0.8) { // 80% of the time mutate weights
  
        for (var i = 0; i < this.genes.length; i++) {
          this.genes[i].mutateWeight();
        }
      }
  
      //5% of the time add a new connection
      var rand2 = random(1);
      if (rand2 < 0.05) {
  
        this.addConnection(innovationHistory);
      }
  
      //1% of the time add a node
      var rand3 = random(1);
      // if (rand3 < 0.01) {
      if (rand3 < 0.01) {
  
        this.addNode(innovationHistory);
      }
    }
  
    //---------------------------------------------------------------------------------------------------------------------------------
    //called when this Genome is better that the other parent
    crossover(parent2) {
      var child = new Genome(this.inputs, this.outputs, true);
      child.genes = [];
      child.nodes = [];
      child.layers = this.layers;
      child.nextNode = this.nextNode;
      child.biasNode = this.biasNode;
      var childGenes = []; // new ArrayList<connectionGene>();//list of genes to be inherrited form the parents
      var isEnabled = []; // new ArrayList<Boolean>();
      //all inherited genes
      for (var i = 0; i < this.genes.length; i++) {
        var setEnabled = true; //is this node in the chlid going to be enabled
  
        var parent2gene = this.matchingGene(parent2, this.genes[i].innovationNo);
        if (parent2gene != -1) { //if the genes match
          if (!this.genes[i].enabled || !parent2.genes[parent2gene].enabled) { //if either of the matching genes are disabled
  
            if (random(1) < 0.75) { //75% of the time disabel the childs gene
              setEnabled = false;
            }
          }
          var rand = random(1);
          if (rand < 0.5) {
            childGenes.push(this.genes[i]);
  
            //get gene from this fucker
          } else {
            //get gene from parent2
            childGenes.push(parent2.genes[parent2gene]);
          }
        } else { //disjoint or excess gene
          childGenes.push(this.genes[i]);
          setEnabled = this.genes[i].enabled;
        }
        isEnabled.push(setEnabled);
      }
  
  
      //since all excess and disjovar genes are inherrited from the more fit parent (this Genome) the childs structure is no different from this parent | with exception of dormant connections being enabled but this wont effect this.nodes
      //so all the this.nodes can be inherrited from this parent
      for (var i = 0; i < this.nodes.length; i++) {
        child.nodes.push(this.nodes[i].clone());
      }
  
      //clone all the connections so that they connect the childs new this.nodes
  
      for (var i = 0; i < childGenes.length; i++) {
        child.genes.push(childGenes[i].clone(child.getNode(childGenes[i].fromNode.number), child.getNode(childGenes[i].toNode.number)));
        child.genes[i].enabled = isEnabled[i];
      }
  
      child.connectNodes();
      return child;
    }
  
    //----------------------------------------------------------------------------------------------------------------------------------------
    //returns whether or not there is a gene matching the input innovation number  in the input genome
    matchingGene(parent2, innovationNumber) {
        for (var i = 0; i < parent2.genes.length; i++) {
          if (parent2.genes[i].innovationNo == innovationNumber) {
            return i;
          }
        }
        return -1; //no matching gene found
      }
      //----------------------------------------------------------------------------------------------------------------------------------------
      //prints out info about the genome to the console
    printGenome() {
      console.log("Prvar genome  layers:" + this.layers);
      console.log("bias node: " + this.biasNode);
      console.log("this.nodes");
      for (var i = 0; i < this.nodes.length; i++) {
        console.log(this.nodes[i].number + ",");
      }
      console.log("Genes");
      for (var i = 0; i < this.genes.length; i++) { //for each connectionGene
        console.log("gene " + this.genes[i].innovationNo + "From node " + this.genes[i].fromNode.number + "To node " + this.genes[i].toNode.number +
          "is enabled " + this.genes[i].enabled + "from layer " + this.genes[i].fromNode.layer + "to layer " + this.genes[i].toNode.layer + "weight: " + this.genes[i].weight);
      }
  
      console.log();
    }
  
    //----------------------------------------------------------------------------------------------------------------------------------------
    //returns a copy of this genome
    clone() {
  
        var clone = new Genome(this.inputs, this.outputs, true);
  
        for (var i = 0; i < this.nodes.length; i++) { //copy this.nodes
          clone.nodes.push(this.nodes[i].clone());
        }
  
        //copy all the connections so that they connect the clone new this.nodes
  
        for (var i = 0; i < this.genes.length; i++) { //copy genes
          clone.genes.push(this.genes[i].clone(clone.getNode(this.genes[i].fromNode.number), clone.getNode(this.genes[i].toNode.number)));
        }
  
        clone.layers = this.layers;
        clone.nextNode = this.nextNode;
        clone.biasNode = this.biasNode;
        clone.connectNodes();
  
        return clone;
      }
  
  //----------------------------------------------------------------------------------------------------------------------------------------
      //draw the genome on the screen
      drawGenomeDetail(startX, startY, w, h, player) {
        
        var allNodes = []; 
        var nodePoses = []; 
        var nodeNumbers = []; 
        var nodeOutput = [];
    
        //get the positions on the screen that each node is supposed to be in
    
    
        //split the this.nodes varo layers
        for (var i = 0; i < this.layers; i++) {
          var temp = []; 
          for (var j = 0; j < this.nodes.length; j++) { //for each node
            if (this.nodes[j].layer == i) { //check if it is in this layer
              temp.push(this.nodes[j]); //add it to this layer
            }
          }
          allNodes.push(temp); //add this layer to all this.nodes
        }
    
        //for each layer add the position of the node on the screen to the node posses arraylist
        for (var i = 0; i < this.layers; i++) {
          fill(255, 0, 0);
          // var x = startX + float((i + 1.0) * w) / float(this.layers + 1.0);
          var x = startY + float((i + 1.0) * w) / float(this.layers + 1.0); // REVERSO
          for (var j = 0; j < allNodes[i].length; j++) { //for the position in the layer
            //var y = startY + float((j + 1.0) * h) / float(allNodes[i].length + 1.0);
            var y = startX + float((j + 1.0) * h) / float(allNodes[i].length + 1.0); // REVERSO
            nodePoses.push(createVector(x, y));
            nodeNumbers.push(allNodes[i][j].number);
            nodeOutput.push(allNodes[i][j].outputValue.toFixed(3)); // should be in the same order!
          }
        }
    
        //draw connections
        stroke(0);
        strokeWeight(2);
        for (var i = 0; i < this.genes.length; i++) {
          if (this.genes[i].enabled) {
            stroke(0);
          } else {
            stroke(100);
          }
          var from;
          var to;
          var connectionColor;
          var weightTextColor;
          from = nodePoses[nodeNumbers.indexOf(this.genes[i].fromNode.number)];
          to = nodePoses[nodeNumbers.indexOf(this.genes[i].toNode.number)];
          if (this.genes[i].weight > 0) {
            connectionColor = color(150,50,50, 64);
            weightTextColor = color(255,200,200);
          } else {
            connectionColor = color(50,50,150, 64);
            weightTextColor = color(200,200,255);
          }

          stroke(connectionColor);
          strokeWeight(map(abs(this.genes[i].weight), 0, 1, 1, 25)); // why not just multiply by 3?

          // line(from.x, from.y, to.x, to.y);  
          line(from.y, from.x, to.y, to.x);  // REVERSO
          textSize(10);
          strokeWeight(0);
          textAlign(LEFT);
          fill(weightTextColor);
          text(this.genes[i].weight.toFixed(3), from.y + (to.y-from.y)/2, from.x + (to.x-from.x)/2);
        }
    
        //draw this.nodes last so they appear ontop of the connection lines
        textSize(10);
        textAlign(CENTER, CENTER);
        stroke(0);
        textFont('Arial');
        for (var i = 0; i < nodePoses.length; i++) {
          fill(200, 150, 100);
          strokeWeight(1);
          // ellipse(nodePoses[i].x, nodePoses[i].y, 20, 20); 
          ellipse(nodePoses[i].y, nodePoses[i].x, 35, 35); // REVERSO
          fill(0);
          //text(nodeNumbers[i], nodePoses[i].x, nodePoses[i].y);  
          //text(nodeNumbers[i], nodePoses[i].y, nodePoses[i].x); // REVERSO
          text(nodeOutput[i], nodePoses[i].y, nodePoses[i].x);
          

        }
    
  // add player detail HACK

  try{
    var tPosX = 682; 
    var tPosY =  nodePoses[0].x - 45; // relate to first node
    var tPosY2 = nodePoses[0].x - 30;
    var xSpacer = 67;
  
    textAlign(CENTER);
    noStroke();
    textSize(14);
    textStyle(BOLD);
    fill(230,230,100);

    // vision 0 duck can see upSnake 
    // vision 1 duck can see downSnake 
    // vision 2 duck elevation
    // vision 3 obstacle

    //text("upSnake   dnSnake      elev          obst", tPosX -13, tPosY);
    textSize(10);
    text("UPSNAKE", tPosX , tPosY);
    text("XPOS", tPosX + 1 * xSpacer, tPosY);
    text("ELEV", tPosX + 2 * xSpacer, tPosY);
    text("OBST", tPosX + 3 * xSpacer, tPosY);
    text("BIAS", tPosX + 4 * xSpacer, tPosY);

    textSize(14);
    text(player.vision0.toFixed(1), tPosX, tPosY2);
    text(player.vision1.toFixed(1), tPosX + 1 * xSpacer, tPosY2);
    text(player.vision2.toFixed(1), tPosX + 2 * xSpacer, tPosY2);
    text(player.vision3.toFixed(1), tPosX + 3 * xSpacer, tPosY2);

  }
  catch(err)
  {}

    textFont('Arial');
    textSize(14);
    var res0 = player.response0.toFixed(3);
    var res1 = player.response1.toFixed(3);
    var res2 = player.response2.toFixed(3);
    var res3 = player.response3.toFixed(3);

    var xPos2 = 694;
    var yPos2 = nodePoses[nodePoses.length-1].x + 45; // relate to response nodes
    bestDuckLogYPos = yPos2 + 60; //global
  
    var xSpacer = 80;

    var baseColor = color(230,230,100);
    var hotColor = color(255,0,0);

    fill(baseColor);
    
    if (res0 > .6) {
      fill(hotColor);
    }
    textSize(10);
    text("LEFT", xPos2, yPos2 -15);
    textSize(14);
    text(player.response0.toFixed(3), xPos2, yPos2);
    

    fill(baseColor);
    if (res1 > .6) {
      fill(hotColor);
    }
    textSize(10);
    text("RIGHT", xPos2 + xSpacer, yPos2 -15);
    textSize(14);
    text(player.response1.toFixed(3), xPos2 + xSpacer, yPos2); 
    

    fill(baseColor);
    if (res2 > .6) {
      fill(hotColor);
    }
    textSize(10);
    text("UP", xPos2 + 2*xSpacer, yPos2 -15);
    textSize(14);
    text(player.response2.toFixed(3), xPos2 + 2*xSpacer, yPos2);
    

    fill(baseColor);
    if (res3 > .6) {
      fill(hotColor);
    }
    textSize(10);
    text("DOWN", xPos2 + 3*xSpacer, yPos2 -15);
    textSize(14);
    text(player.response3.toFixed(3), xPos2 + 3*xSpacer, yPos2);
    fill(230,230,100);

    textStyle(NORMAL);
  }
  
  
  
  
  
  
      //----------------------------------------------------------------------------------------------------------------------------------------
      //draw the genome on the screen
    drawGenome(startX, startY, w, h) {
      //i know its ugly but it works (and is not that important) so I'm not going to mess with it
      var allNodes = []; //new ArrayList<ArrayList<Node>>();
      var nodePoses = []; // new ArrayList<PVector>();
      var nodeNumbers = []; // new ArrayList<Integer>();
  
      //get the positions on the screen that each node is supposed to be in
  
  
      //split the this.nodes varo layers
      for (var i = 0; i < this.layers; i++) {
        var temp = []; // new ArrayList<Node>();
        for (var j = 0; j < this.nodes.length; j++) { //for each node
          if (this.nodes[j].layer == i) { //check if it is in this layer
            temp.push(this.nodes[j]); //add it to this layer
          }
        }
        allNodes.push(temp); //add this layer to all this.nodes
      }
  
      //for each layer add the position of the node on the screen to the node posses arraylist
      for (var i = 0; i < this.layers; i++) {
        fill(255, 0, 0);
        var x = startX + float((i + 1.0) * w) / float(this.layers + 1.0);
        for (var j = 0; j < allNodes[i].length; j++) { //for the position in the layer
          var y = startY + float((j + 1.0) * h) / float(allNodes[i].length + 1.0);
          nodePoses.push(createVector(x, y));
          nodeNumbers.push(allNodes[i][j].number);
        }
      }
  
      //draw connections
      stroke(0);
      strokeWeight(2);
      for (var i = 0; i < this.genes.length; i++) {
        if (this.genes[i].enabled) {
          stroke(0);
        } else {
          stroke(100);
        }
        var from;
        var to;
        from = nodePoses[nodeNumbers.indexOf(this.genes[i].fromNode.number)];
        to = nodePoses[nodeNumbers.indexOf(this.genes[i].toNode.number)];
        if (this.genes[i].weight > 0) {
          stroke(255, 0, 0);
        } else {
          stroke(0, 0, 255);
        }
        strokeWeight(map(abs(this.genes[i].weight), 0, 1, 0, 3));
        line(from.x, from.y, to.x, to.y);
      }
  
      //draw this.nodes last so they appear ontop of the connection lines
      for (var i = 0; i < nodePoses.length; i++) {
        fill(255);
        stroke(0);
        strokeWeight(1);
        ellipse(nodePoses[i].x, nodePoses[i].y, 20, 20);
        textSize(10);
        fill(0);
        textAlign(CENTER, CENTER);
        textFont('Arial');

        
        //text(allNodes[i].outputValue, nodePoses[i].x, nodePoses[i].y);
        text(nodeNumbers[i], nodePoses[i].x, nodePoses[i].y);
  
      }
  
  
  
    }
  }
  