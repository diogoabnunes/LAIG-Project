class MyPlane extends CGFobject { // Plano de dimensões 1x1 unidades, assente em XZ, centrado na origem e face visível a apontar para +Y
    constructor(scene, nPartsU, nPartsV) {
        super(scene);
        this.scene = scene;
        this.nPartsU = nPartsU;
        this.nPartsV = nPartsV;

        this.makeSurface();
    }

    makeSurface() {
        this.controlvertexes = [
            [   // U = 0
                [-0.5, 0, 0.5, 1], // V = 0
                [-0.5, 0, -0.5, 1]  // V = 1
            ],
            [   // U = 1
                [0.5, 0, 0.5, 1], // V = 0
                [0.5, 0, -0.5, 1]  // V = 1
            ]
        ];

        this.nurbsSurface = new CGFnurbsSurface(1, 1, this.controlvertexes);

        this.obj = new CGFnurbsObject(this.scene, this.nPartsU, this.nPartsV, this.nurbsSurface);
    }
    
    display() {
        this.obj.display();
    }

    updateTexCoords(afs, aft) { }
}