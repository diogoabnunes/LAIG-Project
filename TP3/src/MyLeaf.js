/**
 * Primitive and its corresponding properties
 */
class MyLeaf {
    constructor(scene, primitive) {
        this.scene = scene;
        this.primitive =primitive;
    }
   
    display() {
        this.primitive.display();
    }
}