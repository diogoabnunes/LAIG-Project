/**
 *  Node with corresponding properties and descendants.
 */
class MyNode {
    constructor(nodeID,scene) {
        this.scene=scene;
        this.id = nodeID;
        this.materialID = null;
        this.textureID = null;
        this.transformations = [];
        this.descendantNodes = [];
        this.leafs = [];
        this.afs=1;
        this.aft=1;
        this.animation=null;
        this.activeAnimation=false;
        this.spriteAnim=null;
    }
    addDescendantNode(node){
        this.descendantNodes.push(node);
    }
    addLeaf(leaf){
        this.leafs.push(leaf);
    }
    addTransformation(transformation){
        this.transformations.push(transformation);
    }
    addAnimation(animation){
        this.animation=animation;
    }
    
    display(nodes, materialStack, textureStack){
        this.scene.pushMatrix();       

        //material
        if(materialStack.isEmpty() && this.material == null){
            var materialDefault = new CGFappearance(this.scene);
            materialDefault.setShininess(1);
            materialDefault.setAmbient(1.0, 1.0, 1.0, 1.0);
            materialDefault.setDiffuse(1.0, 1.0, 1.0, 1.0);
            materialDefault.setSpecular(1.0, 1.0, 1.0, 1.0);
            materialDefault.setEmission(1.0, 1.0, 1.0, 1.0);

            materialStack.push(materialDefault);
        }
        else if (this.material != null) {
            materialStack.push(this.material);
        }        
        else {
            var lastMaterial = materialStack.peek();
            materialStack.push(lastMaterial);
        }

        //textures
        if (this.texture != null && this.texture != "clear"){
            //when node has its own texture
            textureStack.push(this.texture);
        }
        else if (this.texture == null && !textureStack.isEmpty()) {
            //when textureStack is not empty and node inherits the texture from parent node
            var lastTexture = textureStack.peek();
            textureStack.push(lastTexture);
        }
        else {
            //when the texture is "clear", or, null and with an empty stack
            textureStack.push("clear");
        }

        //transformation
        for (var i=0; i < this.transformations.length; i++){
            var transformation = this.transformations[i];
            var type = transformation[0];

            if (type == "translation") {
                var x = transformation[1];
                var y = transformation[2];
                var z = transformation[3];
                this.scene.translate(x,y,z);
            }
            
            else if (type == "rotation") {
                const DEGREE_TO_RAD = Math.PI / 180;
                var axis = transformation[1];
                var angle = transformation[2];
                if (axis == "x") this.scene.rotate(angle * DEGREE_TO_RAD, 1, 0, 0);
                else if (axis == "y") this.scene.rotate(angle * DEGREE_TO_RAD, 0, 1, 0);
                else if (axis == "z") this.scene.rotate(angle * DEGREE_TO_RAD, 0, 0, 1);
            }
                  
            else if (type == "scale") {
                var sx = transformation[1];
                var sy = transformation[2];
                var sz = transformation[3];
                this.scene.scale(sx, sy, sz);
            }
        }

        if(this.animation!=null){
            if(this.animation.getActiveState()){   
                this.animation.apply();
                this.activeAnimation=true;
            }
        }
        else this.activeAnimation=true;

        if(this.activeAnimation){
            //display of primitives with corresponding material and texture
            for (var j = 0; j < this.leafs.length; j++){
                var thisNodeMaterial = materialStack.peek();

                var thisNodeTexture = textureStack.peek();
                if (thisNodeTexture != "clear") {
                    this.leafs[j].primitive.updateTexCoords(this.afs, this.aft);
                    thisNodeMaterial.setTexture(thisNodeTexture);
                    thisNodeMaterial.setTextureWrap('REPEAT','REPEAT');
                }      
                else {
                    thisNodeMaterial.setTexture(null);
                }

                thisNodeMaterial.apply();

                this.leafs[j].display();
            }

        
            //display descendants
            for (var i = 0; i < this.descendantNodes.length; i++) {
                var descendNode= nodes[this.descendantNodes[i]];
                descendNode.display(nodes,materialStack,textureStack);
            }
        
        
            materialStack.pop();
            textureStack.pop(); 
        }
        this.scene.popMatrix();
    }
}
