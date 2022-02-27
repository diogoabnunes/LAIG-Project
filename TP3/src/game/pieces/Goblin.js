class Goblin extends Piece {
    constructor(scene, id, cell, type) {
        super(scene,id,cell, type);
        this.material=this.scene.getMaterial("purpleMaterial");
    }
}