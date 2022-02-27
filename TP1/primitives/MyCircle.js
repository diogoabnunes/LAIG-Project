/**
 * MyCylinder
 * @constructor
 * @param scene - Reference to MyScene objec
 * @param z - z of cylinder
 * @param radius - circle radius
 * @param slices - parts per section
 */
class MyCircle extends CGFobject {
    constructor(scene, z, radius, slices) {
		super(scene);
		this.z = z;
		this.radius = radius;
        this.slices = slices;

		this.initBuffers();
    }

    initBuffers(){
		this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        var incrementAng=(2*Math.PI)/this.slices;
        var ang=0;
		for (var i = 0; i < this.slices; i++) {
            this.vertices.push(this.radius*Math.cos(ang),this.radius*Math.sin(ang),this.z);
           
            if(i==this.slices-1)
                this.indices.push(this.slices-1,i,0);
            else
                this.indices.push(this.slices-1,i,i+1);
            

            this.normals.push(0, 0, 1);
            
            ang+=incrementAng;
        }
		this.vertices.push(0,0,this.z);

        this.primitiveType=this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}
