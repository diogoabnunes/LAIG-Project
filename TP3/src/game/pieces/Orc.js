class Orc extends Piece {
    constructor(scene, id, cell, type) {
        super(scene,id,cell, type);
        this.material=this.scene.getMaterial("whiteMaterial");
    }
}