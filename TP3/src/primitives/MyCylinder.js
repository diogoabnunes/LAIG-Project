/**
 * MyCylinder
 * @constructor
 * @param scene - Reference to MyScene objec
 * @param height - height of cylinder
 * @param topRadius - top circle radius
 * @param bottomRadius - bottom circle radius
 * @param stacks - sections along height
 * @param slices - parts per section
 */
class MyCylinder extends CGFobject {
    constructor(scene, height, topRadius, bottomRadius, stacks, slices) {
		super(scene);
		this.height = height;
		this.topRadius = topRadius;
		this.bottomRadius = bottomRadius;
		this.stacks = stacks;
		this.slices = slices;
		
		this.side=new MyCylinderSide(scene,height,topRadius,bottomRadius,stacks,slices);
		this.bottomCircle= new MyCircle(scene,0,bottomRadius,slices);
		this.topCircle= new MyCircle(scene,height,topRadius,slices);	

    }
    display(){
		
		this.scene.pushMatrix();
		this.scene.rotate(Math.PI,0,1,0);
		this.bottomCircle.display();
		this.scene.popMatrix();		

		this.side.display();
		this.topCircle.display();
	}
	updateTexCoords(afs, aft) {
		this.side.updateTexCoords(afs, aft);
	}
}
