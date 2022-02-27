class MyHexagon extends CGFobject {
    constructor(scene, x, y, side, id) {
        super(scene);
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.side = side;
        this.h = Math.sqrt(3)/2*this.side;
        this.initBuffers();
        this.id = id;
    }

    initBuffers() {

        this.vertices = [
            this.x-this.side,   this.y-this.h, 0, // 0 -> para usar apenas nas texCoords (para centrar os mini pontos)
            this.x-this.side/2, this.y-this.h, 0, // 1
            this.x+this.side/2, this.y-this.h, 0, // 2
            this.x+this.side,   this.y-this.h, 0, // 3 -> para usar apenas nas texCoords (para centrar os mini pontos)

            this.x-this.side,   this.y,           0, // 4
            this.x,             this.y,           0, // 5 -> centro do hexágono
            this.x+this.side,   this.y,           0, // 6

            this.x-this.side,   this.y+this.h, 0, // 7 -> para usar apenas nas texCoords (para centrar os mini pontos)
            this.x-this.side/2, this.y+this.h, 0, // 8
            this.x+this.side/2, this.y+this.h, 0, // 9
            this.x+this.side,   this.y+this.h, 0  // 10 -> para usar apenas nas texCoords (para centrar os mini pontos)
        ];

        this.indices = [
            1, 2, 5,
            2, 6, 5,
            6, 9, 5,
            9, 8, 5,
            8, 4, 5,
            4, 1, 5
        ];

        this.normals = [
            0, 0, 0,
            0, 0, 1,
            0, 0, 1,
            0, 0, 0,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 0,
            0, 0, 1,
            0, 0, 1,
            0, 0, 0,
        ]; // Coloquei as normais das coordenadas imaginárias a 0

        this.texCoords = [
            0, 0,
            1/3, 0,
            2/3, 0,
            1, 0,

            0, 0.5,
            0.5, 0.5,
            1, 0.5,

            0, 1,
            1/3, 1,
            2/3, 1,
            1, 1
        ];
       
        this.primitiveType=this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    display() {
        this.scene.pushMatrix();
        super.display();
        this.scene.popMatrix();
    }

    updateTexCoords(afs, aft) {}
}