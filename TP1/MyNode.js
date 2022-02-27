/**
 *  Node with corresponding properties and descendants.
 */
class MyNode {
    constructor(graph, nodeID,scene) {
        this.scene=scene;
        this.graph = graph;
        this.id = nodeID;
        this.materialID = null;
        this.textureID = null;
        this.transformations = [];
        this.descendantNodes = [];
        this.leafs = [];
        this.afs=1;
        this.aft=1;
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
    
    /**
     * Check if width and height are power of 2.
     * @param {*} x Image width
     * @param {*} y Image height
     */
    powerOfTwo(x,y) {
        var isX=Math.log2(x) % 1 === 0;
        var isY=Math.log2(y) % 1 === 0;
        return isX && isY;
    }
    
    display(nodes, materialStack,materials, textureStack, textures){
        this.scene.pushMatrix();       

        //material
        if(materialStack.isEmpty() && materials[this.materialID] == null){
            var materialDefault = new CGFappearance(this.scene);
            materialDefault.setShininess(1);
            materialDefault.setAmbient(1.0, 1.0, 1.0, 1.0);
            materialDefault.setDiffuse(1.0, 1.0, 1.0, 1.0);
            materialDefault.setSpecular(1.0, 1.0, 1.0, 1.0);
            materialDefault.setEmission(1.0, 1.0, 1.0, 1.0);

            materialStack.push(materialDefault);
        }
        else if (materials[this.materialID] != null) {
            materialStack.push(materials[this.materialID]);
        }        
        else {
            var lastMaterial = materialStack.peek();
            materialStack.push(lastMaterial);
        }

        //textures
        if (textures[this.textureID] != null && textures[this.textureID] != "clear"){
            //when node has its own texture
            textureStack.push(textures[this.textureID]);
        }
        else if (textures[this.textureID] == null && !textureStack.isEmpty()) {
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
            descendNode.display(nodes,materialStack,materials,textureStack,textures);
        }

        materialStack.pop();
        textureStack.pop();
    
        this.scene.popMatrix();
    }
}
