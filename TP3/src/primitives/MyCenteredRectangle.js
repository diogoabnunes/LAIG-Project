/**
 * MyCenteredRectangle
 * @constructor
 * @param scene - Reference to MyScene object
 * @param x1 - x coordinate corner 1
 * @param y1 - y coordinate corner 1
 * @param x2 - x coordinate corner 2
 * @param y2 - y coordinate corner 2
 */
class MyCenteredRectangle extends CGFobject {
	constructor(scene, x, y, side, height) {
		super(scene);
		this.x = x;
		this.y = y;
		this.side = side;
		this.height = height;

		this.initBuffers();
	}
	
	initBuffers() {
		this.vertices = [
            this.x - this.side/2, this.y - this.height/2, 0,
            this.x + this.side/2, this.y - this.height/2, 0,
            this.x - this.side/2, this.y + this.height/2, 0,
            this.x + this.side/2, this.y + this.height/2, 0
		];

		//Counter-clockwise reference of vertices
		this.indices = [
			0, 1, 2,
			1, 3, 2
		];

		//Facing Z positive
		this.normals = [
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			0, 0, 1
		];
		
		/*
		Texture coords (s,t)
		+----------> s
        |
        |
		|
		v
        t
        */

		this.texCoords = [
			0, 1,
			1, 1,
			0, 0,
			1, 0
		]
		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}

	/**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the rectangle
	 * @param {Array} coords - Array of texture coordinates
	 */
	updateTexCoords(afs, aft) {
		
		var dx = Math.abs(this.x2 - this.x1);
		var dy = Math.abs(this.y2 - this.y1);
		
		this.texCoords = [
			0, dy/aft, // canto esquerdo em cima
			dx/afs, dy/aft, // canto direito em cima
			0, 0, // canto esquerdo em baixo
			dx/afs, 0 // canto direito em baixo
		]
		
		this.updateTexCoordsGLBuffers();
	}
}

