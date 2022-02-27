class MyPatch extends CGFobject { // Possa representar superfícies de grau 1, 2, 3 ou superior, nas duas direções U e V (graus diferentes nas 2 direções é possível)
    constructor(scene, nPointsU, nPointsV, nPartsU, nPartsV, controlPoints) {
        super(scene);
        this.scene = scene;
        this.nPointsU = nPointsU;
        this.nPointsV = nPointsV;
        this.nPartsU = nPartsU;
        this.nPartsV = nPartsV;
        this.controlPoints = controlPoints;

        this.makeSurface();
    }

    makeSurface() {

        this.degree1 = this.nPointsU - 1;
        this.degree2 = this.nPointsV - 1;

        this.controlvertexes = [];

        var i=0;
        for (var u = 0; u < this.nPointsU; u++) {
            var Un = [];
            for (var v = 0; v < this.nPointsV; v++) {
                var p = [];
                p.push(this.controlPoints[i][0],this.controlPoints[i][1],this.controlPoints[i][2]);
                p.push(1); // weight é sempre 1
                Un.push(p);
                i++;
            }
            this.controlvertexes.push(Un);
        }
        this.nurbsSurface = new CGFnurbsSurface(this.degree1, this.degree2, this.controlvertexes);

        this.obj = new CGFnurbsObject(this.scene, this.nPartsU, this.nPartsV, this.nurbsSurface);
    }

    display() {
        this.obj.display();
    }

    updateTexCoords(afs, aft) { }
}