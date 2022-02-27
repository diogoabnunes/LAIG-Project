/**
 * Primitive and its corresponding properties
 */
class MyLeaf {
    constructor(scene, type, properties, reader, leafsNode) {
        this.scene = scene;
        this.type = type;
        this.properties = properties;  
        this.reader = reader;
        this.leafsNode = leafsNode;

        this.primitive = this.leafTreatment();
    }
    /**
     * Selection of the correct primitive depending on the type.
     */
    leafTreatment() {
        var leaf;
        switch(this.type) {
            case "triangle": {
                var x1 = this.properties[0];
                var y1 = this.properties[1];
                var x2 = this.properties[2];
                var y2 = this.properties[3];
                var x3 = this.properties[4];
                var y3 = this.properties[5];
                leaf = new MyTriangle(this.scene, x1, y1, x2, y2, x3, y3); 
                return leaf;           
            }
            case "triangleTwoSided": {
                var x1 = this.properties[0];
                var y1 = this.properties[1];
                var x2 = this.properties[2];
                var y2 = this.properties[3];
                var x3 = this.properties[4];
                var y3 = this.properties[5];
                leaf = new MyTriangleTwoSided(this.scene, x1, y1, x2, y2, x3, y3); 
                return leaf;           
            }
            case "rectangle": {
                var x1 = this.properties[0];
                var y1 = this.properties[1];
                var x2 = this.properties[2];
                var y2 = this.properties[3];
                leaf = new MyRectangle(this.scene, x1, y1, x2, y2);     
                return leaf;           
            }
            case "sphere": {
                var radius = this.reader.getFloat(this.leafsNode, 'radius');
                var slices = this.reader.getFloat(this.leafsNode, 'slices');
                var stacks = this.reader.getFloat(this.leafsNode, 'stacks');
                leaf = new MySphere(this.scene, radius, slices, stacks);
                return leaf;           
            }
            case "cylinder": {
                var height = this.reader.getFloat(this.leafsNode, 'height');
                var topRadius= this.reader.getFloat(this.leafsNode,'topRadius');
                var bottomRadius= this.reader.getFloat(this.leafsNode, 'bottomRadius');
                var stacks = this.reader.getFloat(this.leafsNode, 'stacks');
                var slices = this.reader.getFloat(this.leafsNode, 'slices');
                leaf = new MyCylinder(this.scene, height, topRadius, bottomRadius, stacks, slices);
                return leaf;           
            }
            case "torus": {
                var inner = this.reader.getFloat(this.leafsNode, 'inner');
                var outer = this.reader.getFloat(this.leafsNode, 'outer');
                var slices = this.reader.getFloat(this.leafsNode, 'slices');
                var loops = this.reader.getFloat(this.leafsNode, 'loops');
                leaf = new MyTorus(this.scene, inner, outer, slices, loops);
                return leaf;           
            }
        }
    }
    
    display() {
        this.primitive.display();
    }
}