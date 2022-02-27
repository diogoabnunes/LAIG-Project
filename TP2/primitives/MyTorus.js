/**
 * @constructor
 * @param scene - Reference to MyScene objec
 * @param inner - inner radius
 * @param outer - outer radius
 * @param slices - sections around the inner radius
 * @param loops - sections around the outer radius 
 */
class MyTorus extends CGFobject {  
    constructor(scene, inner, outer, slices, loops ) {
		super(scene);
		this.inner = inner;
        this.outer = outer;
        this.slices = slices;
        this.loops = loops;

        this.initBuffers();
    }
    initBuffers(){
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = []; 

        var v=0;
        var u=0;
        var incL=2*Math.PI/this.loops;
        var incS=2*Math.PI/this.slices;

        var x,y,z,i0,i1,i2,i3,nx,ny,nz;

        for(var i = 0; i <=this.loops; i++){
			for(var j = 0; j <= this.slices; j++){ 
                v=incL*j;
                u=incS*i;

                x=(this.outer+this.inner*Math.cos(v))*Math.cos(u);
                y=(this.outer+this.inner*Math.cos(v))*Math.sin(u);
                z=this.inner*Math.sin(v);

                this.vertices.push(x,y,z);

                if(i != this.loops && j != this.slices){
                    i0=j*(this.slices + 1) + i;
                    i1=j*(this.slices + 1) + i + 1;
                    i2=j*(this.slices + 1) + i + this.slices + 1;
                    i3=j*(this.slices + 1) + i + this.slices + 2

                    this.indices.push(i1,i0,i2);
                    this.indices.push(i2,i3,i1);        
                }

                nx=Math.cos(u)*Math.cos(v);
                ny=Math.sin(u)*Math.cos(v);
                nz=Math.sin(v);
                this.normals.push(nx,ny,nz);
                
				this.texCoords.push(j/this.slices, 1-i/this.loops);
            }
           
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
    }
    updateTexCoords(afs, aft) {
		this.updateTexCoordsGLBuffers();
    }
}