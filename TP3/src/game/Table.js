class Table extends CGFobject {
    constructor(scene) {
        super(scene);
        this.scene = scene;

        this.hexagonSideSize = 0.5;
        this.hexagons = [];
        this.zigZag = new MyZigZag(this.scene);
        this.rectangle = new MyRectangle(this.scene, -10, -5, 10, 5);
        
        this.initMaterials();
        this.createHexagons();
    }

    initMaterials(){
        this.greyMaterial=this.scene.getMaterial("greyMaterial");
        this.greenMaterial=this.scene.getMaterial("greenMaterial");
        this.whiteMaterial=this.scene.getMaterial("whiteMaterial");
        this.purpleMaterial=this.scene.getMaterial("purpleMaterial");
        this.blackMaterial=this.scene.getMaterial("blackMaterial");
        this.yellowMaterial=this.scene.getMaterial("yellowMaterial");
    }
    
    createHexagons() {
        for (var column = 0; column < 10; column++) {

            var line_length = column + 1;
            var x = column * 0.8;
            
            for (var row = 0; row < line_length; row++) {

                var y = row*Math.sqrt(3)/2*this.hexagonSideSize + this.hexagonSideSize*row - column*this.hexagonSideSize;
                
                this.hexagons.push(new MyHexagon(this.scene, x, y, this.hexagonSideSize, parseInt((column+1).toString() + (row+1).toString())));
            }
        }
    }
    
    display() {
        var maxColumn = 1;
        var maxRow = 1;
        var row = 1;
        var column =1;
        for (var i = 0; i < this.hexagons.length; i++) {
            this.scene.pushMatrix();
            this.scene.translate(0, 4.5, 0.02);
            this.scene.rotate(-90 * DEGREE_TO_RAD, 0, 0, 1);

            this.scene.registerForPick(parseInt(row.toString() + column.toString()), this.hexagons[i]);

            if (column == maxColumn) { maxColumn++;  maxRow++; column = 1; row++; } 
            else { column++; }

            this.greyMaterial.apply();
            this.hexagons[i].display();
            this.scene.popMatrix();
        }

        this.scene.registerForPick(0, this.rectangle);

        this.scene.pushMatrix();
        this.scene.translate(4.15, -3.25, 0);
        this.scene.rotate(180 * DEGREE_TO_RAD, 0, 0, 1);
        this.greenMaterial.apply();
        this.zigZag.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.scale(1.05, 1, 1);
        this.scene.translate(-4.85, -2.65, 0);
        this.scene.rotate(59.25 * DEGREE_TO_RAD, 0, 0, 1);
        this.whiteMaterial.apply();
        this.zigZag.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.scale(0.925, 1, 1);
        this.scene.translate(0.35, 5, 0);
        this.scene.rotate(-59.50 * DEGREE_TO_RAD, 0, 0, 1);
        this.purpleMaterial.apply();
        this.zigZag.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, 0.75, -0.02);
        this.blackMaterial.apply();
        this.rectangle.display();
        this.scene.popMatrix();
    }

    displayPossibleDestinies(possibleDestinies) {
        var maxColumn = 1;
        var maxRow = 1;
        var row = 1;
        var column =1;
        
        for (var i = 0; i < this.hexagons.length; i++) {
            this.scene.pushMatrix();
            this.scene.translate(0, 4.5, 0.02);
            this.scene.rotate(-90 * DEGREE_TO_RAD, 0, 0, 1);

            this.scene.registerForPick(parseInt(row.toString() + column.toString()), this.hexagons[i]);

            if (column == maxColumn) { maxColumn++;  maxRow++; column = 1; row++; } 
            else { column++; }

            if (possibleDestinies[i] == "X") this.yellowMaterial.apply();
            else this.greyMaterial.apply();
            this.hexagons[i].display();
            this.scene.popMatrix();
        }

        this.scene.registerForPick(0, this.rectangle);

        this.scene.pushMatrix();
        this.scene.translate(4.15, -3.25, 0);
        this.scene.rotate(180 * DEGREE_TO_RAD, 0, 0, 1);
        this.greenMaterial.apply();
        this.zigZag.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.scale(1.05, 1, 1);
        this.scene.translate(-4.85, -2.65, 0);
        this.scene.rotate(59.25 * DEGREE_TO_RAD, 0, 0, 1);
        this.whiteMaterial.apply();
        this.zigZag.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.scale(0.925, 1, 1);
        this.scene.translate(0.35, 5, 0);
        this.scene.rotate(-59.50 * DEGREE_TO_RAD, 0, 0, 1);
        this.purpleMaterial.apply();
        this.zigZag.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, 0.75, -0.02);
        this.blackMaterial.apply();
        this.rectangle.display();
        this.scene.popMatrix();
    }

    updateTexCoords(afs, aft) {}
}