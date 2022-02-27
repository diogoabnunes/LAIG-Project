class MyZigZag extends CGFobject {
    constructor(scene) {
        super(scene);
        this.scene = scene;

        this.rectangle = new MyCenteredRectangle(this.scene, 0, 0, 0.5625, 0.1);
    }

    display() {
        const DEGREE_TO_RAD = Math.PI / 180;

        for (var i = 0; i < 10; i++) {
            this.scene.pushMatrix();

            this.p1 = this.rectangle;
            this.scene.translate(i*0.937, 0, 0);
            this.scene.rotate(30* DEGREE_TO_RAD, 0, 0, 1);
            this.p1.display();

            this.scene.popMatrix();
            this.scene.pushMatrix();

            this.p2 = this.rectangle;
            this.scene.translate(i*0.937 + 0.468, 0, 0);
            this.scene.rotate(-30 * DEGREE_TO_RAD, 0, 0, 1);
            this.p2.display();

            this.scene.popMatrix();
        }
    }
}