/**
 * MyTriangle
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyTriangleTwoSided extends CGFobject {
    constructor(scene, x1, y1, x2, y2, x3, y3) {
        super(scene);
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.x3 = x3;
        this.y3 = y3;

        this.initBuffers();
    }
    initBuffers() {
        this.vertices = [
            this.x1, this.y1, 0,
            this.x2, this.y2, 0,
            this.x3, this.y3, 0
        ];

        //Counter-clockwise reference of vertices
        this.indices = [
            0, 1, 2,
            0, 2, 1 // two-sided
        ];

        this.normals = [
            0,0,1,
            0,0,1,
            0,0,1,
            0,0,-1,
            0,0,-1
        ];

        this.texCoords=[
            0, 0,
            1, 0,
            1, 1
        ];

        //The defined indices (and corresponding vertices)
        //will be read in groups of three to draw triangles
        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    }
    updateTexCoords(afs, aft) {
     
        var a=Math.sqrt(Math.pow(this.x2-this.x1,2)+Math.pow(this.y2-this.y1,2));
        var b=Math.sqrt(Math.pow(this.x3-this.x2,2)+Math.pow(this.y3-this.y2,2));
        var c=Math.sqrt(Math.pow(this.x1-this.x3,2)+Math.pow(this.y1-this.y3,2));

        var cos=(Math.pow(a,2)-Math.pow(b,2)+Math.pow(c,2))/(2*a*c);
        var sin=Math.sqrt(1-Math.pow(cos,2));


        this.texCoords=[
            0, 0,
            a/afs,0,    
            (c*cos)/afs, -(c*sin)/aft
        ];

		this.updateTexCoordsGLBuffers();
    }
}