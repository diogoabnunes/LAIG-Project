/**
 * MyCylinderSide
 * @constructor
 * @param scene - Reference to MyScene objec
 * @param height - height of cylinder
 * @param topRadius - top circle radius
 * @param bottomRadius - bottom circle radius
 * @param stacks - sections along height
 * @param slices - parts per section
 */
class MyCylinderSide extends CGFobject {
    constructor(scene, height, topRadius, bottomRadius, stacks, slices) {
		super(scene);
		this.height = height;
		this.topRadius = topRadius;
		this.bottomRadius = bottomRadius;
		this.stacks = stacks;
        this.slices = slices;

		this.initBuffers();
    }
    initBuffers(){
		this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

		
		var incrementRadius=(this.topRadius - this.bottomRadius)/this.stacks;
		var angAlpha=(2*Math.PI)/this.slices;
		var radius1=this.bottomRadius;
		var radius2=this.bottomRadius+incrementRadius;
	
		var incrementHeight=this.height/this.stacks;
		var h2=incrementHeight;

		var h1=0;

		//Lado do cilindro		 
		for(var i = 0; i <this.stacks; i++){;
			var k=(this.slices * 2 + 2) * i;
			var ang=0;
			for(var j = 0; j < this.slices; j++){

				this.vertices.push(radius1*Math.cos(ang),radius1*Math.sin(ang),h1);
				this.vertices.push(radius2*Math.cos(ang),radius2*Math.sin(ang),h2);

				this.indices.push(k+2, k+1, k);
				this.indices.push(k+1,k+2,k+3);
				
				this.normals.push(Math.cos(ang), Math.sin(ang),0);
            	this.normals.push(Math.cos(ang), Math.sin(ang),0);
				
				this.texCoords.push(j/this.slices, i/this.stacks);
				this.texCoords.push(j/this.slices, (i+1)/this.stacks);

				ang+=angAlpha;
				k+=2;
			}

			this.vertices.push(radius1,0,h1);
			this.vertices.push(radius2,0,h2); 

			this.normals.push(Math.cos(ang), Math.sin(ang),0);
			this.normals.push(Math.cos(ang), Math.sin(ang),0);
			
			this.texCoords.push(1, i/this.stacks);
			this.texCoords.push(1, (i+1)/this.stacks);

			h1=h2;
			h2+=incrementHeight;

			radius1=radius2;
			radius2=(i+2)*incrementRadius+ this.bottomRadius;
		}


        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();        
	}
	updateTexCoords(afs, aft) {
		this.updateTexCoordsGLBuffers();
	}
}