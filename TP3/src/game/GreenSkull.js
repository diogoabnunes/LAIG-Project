class GreenSkull extends CGFobject {
    constructor(scene,player) {
        super(scene);
        this.green=this.scene.getMaterial("greenMaterial");
        this.player=player;
        this.greenSkull = new MyRectangle(this.scene, -2, -2, 2, 2);
        this.greenSkullTexture = new CGFtexture(this.scene, "./scenes/images/greenSkull.jpg");
    }
    updatePlayer(player){
        this.player=player;
    }
    getPlayer(){
        return this.player;
    }

    display(){
        this.scene.pushMatrix();
        switch(this.getPlayer().species) {
            case "g": this.scene.translate(-4, 3.5, -0.01); break;
            case "o": this.scene.translate(4, 3.5, -0.01); break;
        }
        this.greenSkullTexture.bind();
        this.greenSkull.display();
        this.scene.popMatrix();
    }
}
