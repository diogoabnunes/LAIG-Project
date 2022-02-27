class Pieces extends CGFobject {
    constructor(scene) {
        super(scene);

        this.clear();
        this.createPieces();
    }

    clear() {
        this.pieces = [];
        this.gPiecesEated = [];
        this.oPiecesEated = [];
        this.zPiecesEated = [];
    }

    createPieces() {
        /**initialBoard
         *       [e],         
                [e,e],         
               [z,e,z],        
              [z,e,e,z],         
             [e,e,z,e,e],         
            [e,e,z,z,e,e],             
           [g,e,e,z,e,e,o],       
          [g,g,e,e,e,e,o,o],        
         [g,g,g,e,e,e,o,o,o],   
        [g,g,g,g,e,e,o,o,o,o] 
         */
        
        //goblins: 71, 81, 82, 91, 92, 93, 101, 102, 103, 104 (10)
        this.pieces.push(new Goblin(this.scene,1,71, "g"));
        this.pieces.push(new Goblin(this.scene,2,81, "g"));
        this.pieces.push(new Goblin(this.scene,3,82, "g"));
        this.pieces.push(new Goblin(this.scene,4,91, "g"));
        this.pieces.push(new Goblin(this.scene,5,92, "g"));
        this.pieces.push(new Goblin(this.scene,6,93, "g"));
        this.pieces.push(new Goblin(this.scene,7,101, "g"));
        this.pieces.push(new Goblin(this.scene,8,102, "g"));
        this.pieces.push(new Goblin(this.scene,9,103, "g"));
        this.pieces.push(new Goblin(this.scene,10,104, "g"));

        //orcs: 77,87,88,97,98,99,107,108,109,1010 (10)    
        this.pieces.push(new Orc(this.scene,11,77, "o"));
        this.pieces.push(new Orc(this.scene,12,87, "o"));
        this.pieces.push(new Orc(this.scene,13,88, "o"));
        this.pieces.push(new Orc(this.scene,14,97, "o"));
        this.pieces.push(new Orc(this.scene,15,98, "o"));
        this.pieces.push(new Orc(this.scene,16,99, "o"));
        this.pieces.push(new Orc(this.scene,17,107, "o"));
        this.pieces.push(new Orc(this.scene,18,108, "o"));
        this.pieces.push(new Orc(this.scene,19,109, "o"));
        this.pieces.push(new Orc(this.scene,20,1010, "o"));    

        // zombies: 31, 33, 41, 44, 53, 63, 64, 74 (8)
        this.pieces.push(new Zombie(this.scene,21,31, "z"));
        this.pieces.push(new Zombie(this.scene,22,33, "z"));
        this.pieces.push(new Zombie(this.scene,23,41, "z"));
        this.pieces.push(new Zombie(this.scene,24,44, "z"));
        this.pieces.push(new Zombie(this.scene,25,53, "z"));
        this.pieces.push(new Zombie(this.scene,26,63, "z"));
        this.pieces.push(new Zombie(this.scene,27,64, "z"));
        this.pieces.push(new Zombie(this.scene,28,74, "z"));
    }

    display() {
        for (var i = 0; i < this.gPiecesEated.length; i++) {
            this.scene.pushMatrix();
            this.gPiecesEated[i].display();
            this.scene.popMatrix();
        }

        for (var i = 0; i < this.oPiecesEated.length; i++) {
            this.scene.pushMatrix();
            this.oPiecesEated[i].display();
            this.scene.popMatrix();
        }

        for (var i = 0; i < this.zPiecesEated.length; i++) {
            this.scene.pushMatrix();
            this.zPiecesEated[i].display();
            this.scene.popMatrix();
        }

        for (var i = 0; i < this.pieces.length; i++) {
            this.scene.pushMatrix();
            this.scene.registerForPick(this.pieces[i].cell, this.pieces[i]);
            this.pieces[i].display();
            this.scene.popMatrix();
        }
    }
}