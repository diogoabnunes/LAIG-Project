class Buttons extends CGFobject {
    constructor(scene) {
        super(scene);

        this.scene = scene;
        this.texture = this.scene.graph.textTexture;
        this.redMaterial = this.scene.getMaterial("redMaterial");
        this.greenMaterial = this.scene.getMaterial("greenMaterial");
        this.purpleMaterial = this.scene.getMaterial("purpleMaterial");
        this.whiteMaterial = this.scene.getMaterial("whiteMaterial");
        this.greyMaterial = this.scene.getMaterial("greyMaterial");

        this.cylinder= new MyCylinder(scene, 0.05, 0.25, 0.25, 16, 16);

        this.play = new MySpriteText(this.scene, "PLAY ", this.texture);
        this.playQuestion = new MySpriteText(this.scene, "PLAY ?", this.texture);
        this.starting = new MySpriteText(this.scene, "LET'S PLAY!", this.texture);
        this.pressStart = new MySpriteText(this.scene, "PRESS START TO CONTINUE", this.texture);
        this.wantToPlayAgain = new MySpriteText(this.scene, "PLAY AGAIN?", this.texture);
        this.gameWinner = new MySpriteText(this.scene, "WINNER   ", this.texture);
        this.nextButton = new MySpriteText(this.scene, "NEXT", this.texture);
        this.nextRec = new MyRectangle(this.scene, -2.6, -0.6, 2.6, 0.6);

        this.yes = new MyRectangle(this.scene, -1, -0.5, 1, 0.5);
        this.no = new MyRectangle(this.scene, -1, -0.5, 1, 0.5);

        this.purpleScore = new MySpriteText(this.scene, "00", this.texture);
        this.whiteScore = new MySpriteText(this.scene, "00", this.texture);
        this.greenScore = new MySpriteText(this.scene, "00", this.texture);

        this.rectangle = new MyRectangle(this.scene, -1.1, -0.6, 1.1, 0.6);

        this.counter = new MySpriteText(this.scene, "TIME:00", this.texture);
        this.counterRec = new MyRectangle(this.scene, -3.6, -0.6, 3.6, 0.6);
    }

    gScore(score) {
        this.scene.pushMatrix();
        this.scene.translate(-9, 0, 0);
        if (score.toString().length == 1) this.purpleScore.text = "0" + score.toString();
        else this.purpleScore.text = score.toString();
        this.purpleMaterial.apply();
        this.rectangle.display();
        this.scene.translate(0, 0, 0.02);
        this.purpleScore.display();
        this.scene.defaultAppearance.apply();
        this.scene.popMatrix();
    }

    oScore(score) {
        this.scene.pushMatrix();
        this.scene.translate(9, 0, 0);
        if (score.toString().length == 1) this.whiteScore.text = "0" + score.toString();
        else this.whiteScore.text = score.toString();
        this.whiteMaterial.apply();
        this.rectangle.display();
        this.scene.translate(0, 0, 0.02);
        this.whiteScore.display();
        this.scene.defaultAppearance.apply();
        this.scene.popMatrix();
    }

    zScore(score) {
        this.scene.pushMatrix();
        this.scene.translate(0, -11.2, 0);
        if (score.toString().length == 1) this.greenScore.text = "0" + score.toString();
        else this.greenScore.text = score.toString();
        this.greenMaterial.apply();
        this.rectangle.display();
        this.scene.translate(0, 0, 0.02);
        this.greenScore.display();
        this.scene.defaultAppearance.apply();
        this.scene.popMatrix();
    }

    playerTurn(player) {
        this.scene.pushMatrix();
        this.play.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(2, 0, 0);
        switch(player.species) {
            case "z": this.greenMaterial.apply(); break;
            case "g": this.purpleMaterial.apply(); break;
            case "o": this.whiteMaterial.apply(); break;
        }
        this.cylinder.display();
        this.scene.defaultAppearance.apply();
        this.scene.popMatrix();
    }

    playerHasGreenSkullDisplay() {
        this.scene.pushMatrix();
        this.playQuestion.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.registerForPick(1, this.yes);
        this.scene.translate(-6, 0, 0);
        this.greenMaterial.apply();
        this.yes.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.registerForPick(2, this.no);
        this.scene.translate(6, 0, 0);
        this.redMaterial.apply();
        this.no.display();
        this.scene.popMatrix();
        this.scene.defaultAppearance.apply();

        this.scene.pushMatrix();
        this.scene.registerForPick(4, this.greenPiece);
        this.scene.translate(1.5, 0, 0);
        this.greenMaterial.apply();
        this.cylinder.display();
        this.scene.defaultAppearance.apply();
        this.scene.popMatrix();
    }

    wantPlayAgainDisplay() {
        this.scene.pushMatrix();
        this.scene.scale(0.75,0.75,0.75);
        this.wantToPlayAgain.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.registerForPick(1, this.yes);
        this.scene.translate(-6, 0, 0);
        this.greenMaterial.apply();
        this.yes.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.registerForPick(2, this.no);
        this.scene.translate(6, 0, 0);
        this.redMaterial.apply();
        this.no.display();
        this.scene.popMatrix();
        this.scene.defaultAppearance.apply();
    }

    toStart() {
        this.scene.pushMatrix();
        this.starting.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, -11.2, 0);
        this.scene.scale(0.8, 0.8, 0.8);
        this.pressStart.display();
        this.scene.popMatrix();
    }

    displayWinner(winner) {
        this.scene.pushMatrix();

        var len = winner.length;
        this.gameWinner.display();
        if (len == 1) this.scene.translate(2, 0, 0);
        else if (len == 2) this.scene.translate(1.5, 0, 0);
        else this.scene.translate(1, 0, 0);

        for (var i = 0; i < len; i++) {
            this.scene.translate(1, 0, 0);
            switch(winner[i]) {
                case "o":
                    this.whiteMaterial.apply(); 
                    break;

                case "g":
                    this.purpleMaterial.apply();
                    break;

                case "z":
                    this.greenMaterial.apply();
                    break;
            }
            this.cylinder.display();
        }

        this.scene.popMatrix();
    }

    botButtonDisplay() {
        this.scene.pushMatrix();
        this.scene.translate(7.5, -11.2, 0);
        this.greyMaterial.apply();
        this.scene.scale(0.8, 0.8, 0.8);
        this.scene.translate(0, 0, 0.02);
        this.nextButton.display();
        this.scene.translate(0.4,0,-0.01);
        this.nextRec.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.registerForPick(12345, this.cylinder);
        this.scene.translate(9.5, -11.2, 0);
        this.redMaterial.apply();
        this.scene.scale(0.8, 0.8, 0.8);
        this.cylinder.display();
        this.scene.popMatrix();
        this.scene.defaultAppearance.apply();
    }

    counterDisplay(count) {
        this.scene.pushMatrix();
        this.scene.translate(-7, -11.2, 0);
        if (count.length == 1) this.counter.text = "TIME:0" + count;
        else this.counter.text = "TIME:" + count;
        this.redMaterial.apply();
        this.scene.scale(0.8, 0.8, 0.8);
        this.counterRec.display();
        this.scene.translate(0, 0, 0.02);
        this.counter.display();
        this.scene.defaultAppearance.apply();
        this.scene.popMatrix();
    }
}