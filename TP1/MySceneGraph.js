const DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var INITIALS_INDEX = 0;
var VIEWS_INDEX = 1;
var ILLUMINATION_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var NODES_INDEX = 6;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * Constructor for MySceneGraph class.
     * Initializes necessary variables and starts the XML file reading process.
     * @param {string} filename - File that defines the 3D scene
     * @param {XMLScene} scene
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.nodes = [];

        this.idRoot = null; // The id of the root element.

        this.materialStack = new Stack();
        this.textureStack = new Stack();


        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */
        this.reader.open('scenes/' + filename, this);
    }

    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }

    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "lsf")
            return "root tag <lsf> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        var error;

        // Processes each node, verifying errors.

        // <initials>
        var index;
        if ((index = nodeNames.indexOf("initials")) == -1)
            return "tag <initials> missing";
        else {
            if (index != INITIALS_INDEX)
                this.onXMLMinorError("tag <initials> out of order " + index);

            //Parse initials block
            if ((error = this.parseInitials(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseViews(nodes[index])) != null)
                return error;
        }

        // <illumination>
        if ((index = nodeNames.indexOf("illumination")) == -1)
            return "tag <illumination> missing";
        else {
            if (index != ILLUMINATION_INDEX)
                this.onXMLMinorError("tag <illumination> out of order");

            //Parse illumination block
            if ((error = this.parseIllumination(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }
        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <nodes>
        if ((index = nodeNames.indexOf("nodes")) == -1)
            return "tag <nodes> missing";
        else {
            if (index != NODES_INDEX)
                this.onXMLMinorError("tag <nodes> out of order");

            //Parse nodes block
            if ((error = this.parseNodes(nodes[index])) != null)
                return error;
        }
        this.log("all parsed");
    }

    /**
     * Parses the <initials> block. 
     * @param {initials block element} initialsNode
     */
    parseInitials(initialsNode) {
        var children = initialsNode.children;
        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var rootIndex = nodeNames.indexOf("root");
        var referenceIndex = nodeNames.indexOf("reference");

        // Get root of the scene.
        if(rootIndex == -1)
            return "No root id defined for scene.";

        var rootNode = children[rootIndex];
        var id = this.reader.getString(rootNode, 'id');
        if (id == null)
            return "No root id defined for scene.";

        this.idRoot = id;

        // Get axis length        
        if(referenceIndex == -1)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        var refNode = children[referenceIndex];
        var axis_length = this.reader.getFloat(refNode, 'length');
        if (axis_length == null)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        this.referenceLength = axis_length || 1;

        this.log("Parsed initials");

        return null;
    }

    /**
     * Parses the <views> block.
     * @param {view block element} viewsNode
     */
    parseViews(viewsNode) {
        var children = viewsNode.children;
        this.views = [];
        var grandChildren = [];
        var onePerspective = 0;
        var oneOrthogonal = 0;
        
        var nodeNames = [];
        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);


        this.defaultView = this.reader.getString(viewsNode, 'default');
        if (this.defaultView == null) return "no default view defined";
        this.scene.selectedView = this.defaultView;
        

        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName == "perspective") {
                var id = this.reader.getString(children[i], 'id');
                if (id == null) return "no ID defined for perspective view";
                if (this.views[id] != null) return "ID must be unique";

                var near = this.reader.getFloat(children[i], 'near');
                if (isNaN(near)) return "near value is NaN or is not positive";
                var far = this.reader.getFloat(children[i], 'far');
                if (isNaN(far)) return "far value is NaN or is not positive";
                var angle = this.reader.getFloat(children[i], 'angle');
                if (isNaN(angle)) return "angle value is NaN";

                grandChildren = children[i].children;
                var nodeNames2 = [];
                for (var x = 0; x < grandChildren.length; x++) {
                    nodeNames2.push(grandChildren[x].nodeName);
                }
                var fromIndex = nodeNames2.indexOf("from");
                var toIndex = nodeNames2.indexOf("to");

                var fromX = this.reader.getFloat(grandChildren[fromIndex], 'x');
                if (fromX == null || isNaN(fromX)) { return "x is null or NaN"} 
                var fromY = this.reader.getFloat(grandChildren[fromIndex], 'y');
                if (fromY == null || isNaN(fromY)) { return "y is null or NaN"} 
                var fromZ = this.reader.getFloat(grandChildren[fromIndex], 'z');
                if (fromZ == null || isNaN(fromZ)) { return "z is null or NaN"} 
                var toX = this.reader.getFloat(grandChildren[toIndex], 'x');
                if (toX == null || isNaN(toX)) { return "x is null or NaN"} 
                var toY = this.reader.getFloat(grandChildren[toIndex], 'y');
                if (toY == null || isNaN(toY)) { return "y is null or NaN"} 
                var toZ = this.reader.getFloat(grandChildren[toIndex], 'z');
                if (toZ == null || isNaN(toZ)) { return "z is null or NaN"}

                this.views[id] = new CGFcamera(angle * DEGREE_TO_RAD, near, far, 
                                    [fromX, fromY, fromZ], [toX, toY, toZ]);
                onePerspective = 1;
            }

            else if (children[i].nodeName == "ortho") {
                var id = this.reader.getString(children[i], 'id');
                if (id == null) return "no ID defined for perspective view";
                if (this.views[id] != null) return "ID must be unique";

                var near = this.reader.getFloat(children[i], 'near');
                if (isNaN(near)) return "near value is NaN or is not positive";
                var far = this.reader.getFloat(children[i], 'far');
                if (isNaN(far)) return "far value is NaN or is not positive";
                var left = this.reader.getFloat(children[i], 'left');
                if (isNaN(left)) return "left value is NaN";
                var right = this.reader.getFloat(children[i], 'right');
                if (isNaN(right)) return "right value is NaN";
                var top = this.reader.getFloat(children[i], 'top');
                if (isNaN(top)) return "top value is NaN";
                var bottom = this.reader.getFloat(children[i], 'bottom');
                if (isNaN(bottom)) return "bottom value is NaN";

                grandChildren = children[i].children;
                var nodeNames2 = [];
                for (var x = 0; x < grandChildren.length; x++) {
                    nodeNames2.push(grandChildren[x].nodeName);
                }
                var fromIndex = nodeNames2.indexOf("from");
                var toIndex = nodeNames2.indexOf("to");
                var upIndex = nodeNames2.indexOf("up");

                var fromX = this.reader.getFloat(grandChildren[fromIndex], 'x');
                if (fromX == null || isNaN(fromX)) { return "x is null or NaN"} 
                var fromY = this.reader.getFloat(grandChildren[fromIndex], 'y');
                if (fromY == null || isNaN(fromY)) { return "y is null or NaN"} 
                var fromZ = this.reader.getFloat(grandChildren[fromIndex], 'z');
                if (fromZ == null || isNaN(fromZ)) { return "z is null or NaN"} 
                var toX = this.reader.getFloat(grandChildren[toIndex], 'x');
                if (toX == null || isNaN(toX)) { return "x is null or NaN"} 
                var toY = this.reader.getFloat(grandChildren[toIndex], 'y');
                if (toY == null || isNaN(toY)) { return "y is null or NaN"} 
                var toZ = this.reader.getFloat(grandChildren[toIndex], 'z');
                if (toZ == null || isNaN(toZ)) { return "z is null or NaN"} 

                if (upIndex == -1) { // up (optional: default 0,1,0)
                    var upX = 0;
                    var upY = 1;
                    var upZ = 0;
                }
                else {
                    var upX = this.reader.getFloat(grandChildren[upIndex], 'x');
                    if (upX == null || isNaN(upX)) { return "x is null or NaN"} 
                    var upY = this.reader.getFloat(grandChildren[upIndex], 'y');
                    if (upY == null || isNaN(upY)) { return "y is null or NaN"} 
                    var upZ = this.reader.getFloat(grandChildren[upIndex], 'z');
                    if (upZ == null || isNaN(upZ)) { return "z is null or NaN"} 
                }
                this.views[id] = new CGFcameraOrtho(left, right, bottom, top, near, far, 
                                    [fromX, fromY, fromZ], [toX, toY, toZ], [upX, upY, upZ]);
                oneOrthogonal = 1;
            }
            this.scene.viewsID.push(id);

        }
        if (onePerspective == 0 || oneOrthogonal == 0) {
            this.onXMLError("At least 1 of each type os views must be declared...");
        }
        this.log("Parsed views")
        return null;
    }

    /**
     * Parses the <illumination> node.
     * @param {illumination block element} illuminationsNode
     */
    parseIllumination(illuminationsNode) {

        var children = illuminationsNode.children;

        this.ambient = [];
        this.background = [];

        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var ambientIndex = nodeNames.indexOf("ambient");
        var backgroundIndex = nodeNames.indexOf("background");

        var color = this.parseColor(children[ambientIndex], "ambient");
        if (!Array.isArray(color))
            return color;
        else
            this.ambient = color;

        color = this.parseColor(children[backgroundIndex], "background");
        if (!Array.isArray(color))
            return color;
        else
            this.background = color;

        this.log("Parsed Illumination");

        return null;
    }

    /**
     * Parses the <light> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {
        var children = lightsNode.children;

        this.lights = [];
        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {

            // Storing light information
            var global = [];
            var attributeNames = [];
            var attributeTypes = [];

            //Check type of light
            if (children[i].nodeName != "light") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            else {
                attributeNames.push(...["enable", "position", "ambient", "diffuse", "specular"]);
                attributeTypes.push(...["boolean","position", "color", "color", "color"]);
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            grandChildren = children[i].children;
            // Specifications for the current light.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            for (var j = 0; j < attributeNames.length; j++) {
                var attributeIndex = nodeNames.indexOf(attributeNames[j]);

                if (attributeIndex != -1) {
                    if (attributeTypes[j] == "boolean")
                        var aux = this.parseBoolean(grandChildren[attributeIndex], "value", "enabled attribute for light of ID" + lightId);
                    else if (attributeTypes[j] == "position")
                        var aux = this.parseCoordinates4D(grandChildren[attributeIndex], "light position for ID" + lightId);
                    else
                        var aux = this.parseColor(grandChildren[attributeIndex], attributeNames[j] + " illumination for ID" + lightId);

                    if (typeof aux === 'string')
                        return aux;

                    global.push(aux);
                }
                else
                    return "light " + attributeNames[i] + " undefined for ID = " + lightId;
            }
            this.lights[lightId] = global;
            numLights++;
        }

        if (numLights == 0)
            return "at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed lights");
        return null;
    }

    /**
     * Parses the <textures> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {

        this.textures = [];
        var allTextures = texturesNode.children;

        for (var i = 0; i < allTextures.length; i++) {

            if (allTextures[i].nodeName == "texture") {

                var textureID = this.reader.getString(allTextures[i], 'id');
                if (textureID == null) return "texture ID null";
                if (this.textures[textureID] != null) return "texture ID not unique";

                var path = this.reader.getString(allTextures[i], 'path');
                if (path == null) return "texture path null";

                var texture = new CGFtexture(this.scene, path);
                this.textures[textureID] = texture;
            }
            else {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
            }
        }

        this.log("Parsed textures")
        return null;
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        var children = materialsNode.children;

        this.materials = [];

        var grandChildren = [];

        // Any number of materials.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "material") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current material.
            var materialID = this.reader.getString(children[i], 'id');
            if (materialID == null)
                return "no ID defined for material";

            // Checks for repeated IDs.
            if (this.materials[materialID] != null)
                return "ID must be unique for each light (conflict: ID = " + materialID + ")";

            var nodeNames = [];
            grandChildren = children[i].children;
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            var shininessIndex = nodeNames.indexOf("shininess");
            var shininess = this.reader.getFloat(grandChildren[shininessIndex], 'value');
            if (shininess < 0 || isNaN(shininess)) return "shininess not positive or NaN";

            var ambientIndex = nodeNames.indexOf("ambient");
            var ambR = this.reader.getFloat(grandChildren[ambientIndex], 'r');
            if (ambR < 0 || isNaN(ambR)) return "ambient value R not positive or Nan";
            var ambG = this.reader.getFloat(grandChildren[ambientIndex], 'g');
            if (ambG < 0 || isNaN(ambG)) return "ambient value G not positive or Nan";
            var ambB = this.reader.getFloat(grandChildren[ambientIndex], 'b');
            if (ambB < 0 || isNaN(ambB)) return "ambient value B not positive or Nan";
            var ambA = this.reader.getFloat(grandChildren[ambientIndex], 'a');
            if (ambA < 0 || isNaN(ambA)) return "ambient value A not positive or Nan";

            var diffuseIndex = nodeNames.indexOf("diffuse");
            var difR = this.reader.getFloat(grandChildren[diffuseIndex], 'r');
            if (difR < 0 || isNaN(difR)) return "diffuse value R not positive or Nan";
            var difG = this.reader.getFloat(grandChildren[diffuseIndex], 'g');
            if (difG < 0 || isNaN(difG)) return "diffuse value G not positive or Nan";
            var difB = this.reader.getFloat(grandChildren[diffuseIndex], 'b');
            if (difB < 0 || isNaN(difB)) return "diffuse value B not positive or Nan";
            var difA = this.reader.getFloat(grandChildren[diffuseIndex], 'a');
            if (difA < 0 || isNaN(difA)) return "diffuse value A not positive or Nan";

            var specularIndex = nodeNames.indexOf("specular");
            var speR = this.reader.getFloat(grandChildren[specularIndex], 'r');
            if (speR < 0 || isNaN(speR)) return "specular value R not positive or Nan";
            var speG = this.reader.getFloat(grandChildren[specularIndex], 'g');
            if (speG < 0 || isNaN(speG)) return "specular value G not positive or Nan";
            var speB = this.reader.getFloat(grandChildren[specularIndex], 'b');
            if (speB < 0 || isNaN(speB)) return "specular value B not positive or Nan";
            var speA = this.reader.getFloat(grandChildren[specularIndex], 'a');
            if (speA < 0 || isNaN(speA)) return "specular value A not positive or Nan";

            var emissiveIndex = nodeNames.indexOf("emissive");
            var emiR = this.reader.getFloat(grandChildren[emissiveIndex], 'r');
            if (emiR < 0 || isNaN(emiR)) return "emissive value R not positive or Nan";
            var emiG = this.reader.getFloat(grandChildren[emissiveIndex], 'g');
            if (emiG < 0 || isNaN(emiG)) return "emissive value G not positive or Nan";
            var emiB = this.reader.getFloat(grandChildren[emissiveIndex], 'b');
            if (emiB < 0 || isNaN(emiB)) return "emissive value B not positive or Nan";
            var emiA = this.reader.getFloat(grandChildren[emissiveIndex], 'a');
            if (emiA < 0 || isNaN(emiA)) return "emissive value A not positive or Nan";

            var material = new CGFappearance(this.scene);
            material.setShininess(shininess);
            material.setAmbient(ambR, ambG, ambB, ambA);
            material.setDiffuse(difR, difG, difB, difA);
            material.setSpecular(speR, speG, speB, speA);
            material.setEmission(emiR, emiG, emiB, emiA);

            this.materials[materialID] = material;
        }

        this.log("Parsed materials");
        return null;
    }

    /**
     * Parses the <transformations> node.
     * @param {transformations block element} transformation
     */
    parseTransformation(transformation) {

        var type = transformation.nodeName; // translation, rotation or scale

        if (type == "translation") {
            var x = this.reader.getFloat(transformation, 'x');
            if (isNaN(x)) return "x is NaN";
            var y = this.reader.getFloat(transformation, 'y');
            if (isNaN(y)) return "y is NaN";
            var z = this.reader.getFloat(transformation, 'z');
            if (isNaN(z)) return "z is NaN";

            return [type, x, y, z];
        }
        else if (type == "rotation") {
            var axis = this.reader.getString(transformation, 'axis');
            var angle = this.reader.getFloat(transformation, 'angle');
            if (isNaN(angle)) return "angle is NaN";

            return [type, axis, angle];
        }
        else if (type == "scale") {
            var sx = this.reader.getFloat(transformation, 'sx');
            if (isNaN(sx)) return "sx is NaN";
            var sy = this.reader.getFloat(transformation, 'sy');
            if (isNaN(sy)) return "sy is NaN";
            var sz = this.reader.getFloat(transformation, 'sz');
            if (isNaN(sz)) return "sz is NaN";

            return [type, sx, sy, sz];
        }
        else return "no transformation type allowed";
    }

    /**
   * Parses the <nodes> block.
   * @param {nodes block element} nodesNode
   */
  parseNodes(nodesNode) {
        var children = nodesNode.children;

        // Any number of nodes.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "node") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current node.
            var nodeID = this.reader.getString(children[i], 'id');
            if (nodeID == null) return "no ID defined for nodeID";

            // Checks for repeated IDs.
            if (this.nodes[nodeID] != null)
                return "ID must be unique for each node (conflict: ID = " + nodeID + ")";

            this.nodes[nodeID] = new MyNode(this, nodeID,this.scene);

            var nodeElements = children[i].children;
            var nodeNames = [];
            for (var j = 0; j < nodeElements.length; j++)
                nodeNames.push(nodeElements[j].nodeName);
        
            // Material
            var materialIndex = nodeNames.indexOf("material");
            if (materialIndex == -1) return "no material index";
            var materialID = this.reader.getString(nodeElements[materialIndex], 'id');
            if (materialID == null) return "no material specified"; 
            if (materialID != "null" && this.materials[materialID] == null)
                return "no material with that ID";

            this.nodes[nodeID].materialID = materialID;
            
            // Texture
            var textureIndex = nodeNames.indexOf("texture");
            if (textureIndex == -1) return "no texture index";
            var textureID = this.reader.getString(nodeElements[textureIndex], 'id');
            if (textureID == null) return "no texture specified";
            else if (textureID == "clear") this.textures[textureID] = "clear";
            else if (textureID != "null" && this.textures[textureID] == null)
                return "no texture with that ID";

            this.nodes[nodeID].textureID = textureID;

            if (textureID != "clear"){
                var amplification = nodeElements[textureIndex].children;
                var amplificationNode = amplification[0];

                if (amplification[0] == null) {
                    this.nodes[nodeID].afs = 1;
                    this.nodes[nodeID].aft = 1;
                    this.onXMLMinorError("afs and aft not defined for this texture");
                }
            
                else {
                    var afs = this.reader.getFloat(amplificationNode, 'afs');
                    var aft = this.reader.getFloat(amplificationNode, 'aft');

                    this.nodes[nodeID].afs = afs;
                    this.nodes[nodeID].aft = aft;
                }
                
            }

            // Transformations
            var transformationsIndex = nodeNames.indexOf("transformations");
            if (transformationsIndex == -1) this.onXMLMinorError("no transformations index");
            else {  
                var transformations = nodeElements[transformationsIndex].children;
                
                for (var x = 0; x < transformations.length; x++) {
                    var transformationsToNode = this.parseTransformation(transformations[x]);
                    this.nodes[nodeID].addTransformation(transformationsToNode);
                }
            }

            // Descendants
            var descendantsIndex = nodeNames.indexOf("descendants");
            if (nodeElements[descendantsIndex]) {
                var descendantElements = nodeElements[descendantsIndex].children;

                for (var x = 0; x < descendantElements.length; x++) {
                    if (descendantElements[x].nodeName == "noderef") {
                        this.nodes[nodeID].addDescendantNode(descendantElements[x].id);
                    }
                    else if (descendantElements[x].nodeName == "leaf") {
                        var [type,properties] = this.parseLeafs(descendantElements[x]);
                        this.nodes[nodeID].addLeaf(new MyLeaf(this.scene,type,properties,this.reader,descendantElements[x]));
                    }
                }
            }        
        }
        this.idToNode(this.nodes);
        this.log("Parsed nodes");
    }

    //coloca os nós-filhos correspondente de cada nó
    idToNode(nodes){
        for(var i=0; i<nodes.length;i++){
            for(var j=0; j<nodes[i].descendants.length; j++){
                for(var k=0;k<nodes.length;k++){
                    if(nodes[i].descendants[j]==nodes[k].id){
                        nodes[i].addDescendantNode(nodes[k]);
                    }
                }
            }
        }
    }

    /**
     * Parses the <leaf> node.
     * @param {leaf block element} leafsNode
     */
    parseLeafs(leafsNode) {
        var type;
        var properties = [];   
        if (this.reader.getString(leafsNode, 'type') == "triangle") {
            var x1 = this.reader.getFloat(leafsNode, 'x1');
            if (x1 == null || isNaN(x1)) return "x1 is null or NaN";
            var y1 = this.reader.getFloat(leafsNode, 'y1');
            if (x1 == null || isNaN(x1)) return "y1 is null or NaN";
            var x2 = this.reader.getFloat(leafsNode, 'x2');
            if (x1 == null || isNaN(x1)) return "x2 is null or NaN";
            var y2 = this.reader.getFloat(leafsNode, 'y2');
            if (x1 == null || isNaN(x1)) return "y2 is null or NaN";
            var x3 = this.reader.getFloat(leafsNode, 'x3');
            if (x1 == null || isNaN(x1)) return "x3 is null or NaN";
            var y3 = this.reader.getFloat(leafsNode, 'y3');
            if (x1 == null || isNaN(x1)) return "y3 is null or NaN";
            
            type="triangle";
            properties.push(x1,y1,x2,y2,x3,y3);
        }

        else if (this.reader.getString(leafsNode, 'type') == "triangleTwoSided") {
            var x1 = this.reader.getFloat(leafsNode, 'x1');
            if (x1 == null || isNaN(x1)) return "x1 is null or NaN";
            var y1 = this.reader.getFloat(leafsNode, 'y1');
            if (x1 == null || isNaN(x1)) return "y1 is null or NaN";
            var x2 = this.reader.getFloat(leafsNode, 'x2');
            if (x1 == null || isNaN(x1)) return "x2 is null or NaN";
            var y2 = this.reader.getFloat(leafsNode, 'y2');
            if (x1 == null || isNaN(x1)) return "y2 is null or NaN";
            var x3 = this.reader.getFloat(leafsNode, 'x3');
            if (x1 == null || isNaN(x1)) return "x3 is null or NaN";
            var y3 = this.reader.getFloat(leafsNode, 'y3');
            if (x1 == null || isNaN(x1)) return "y3 is null or NaN";
            
            type="triangleTwoSided";
            properties.push(x1,y1,x2,y2,x3,y3);
        }

        else if (this.reader.getString(leafsNode, 'type') == "rectangle") {
            var x1 = this.reader.getFloat(leafsNode, 'x1');
            if (x1 == null || isNaN(x1)) return "x1 is null or NaN";
            var y1 = this.reader.getFloat(leafsNode, 'y1');
            if (x1 == null || isNaN(x1)) return "y1 is null or NaN";
            var x2 = this.reader.getFloat(leafsNode, 'x2');
            if (x1 == null || isNaN(x1)) return "x2 is null or NaN";
            var y2 = this.reader.getFloat(leafsNode, 'y2');
            if (x1 == null || isNaN(x1)) return "y2 is null or NaN";
            
            type="rectangle";
            properties.push(x1,y1,x2,y2);
        }

        else if (this.reader.getString(leafsNode, 'type') == "sphere") {
            var radius = this.reader.getFloat(leafsNode, 'radius');
            if (radius == null || isNaN(radius)) return "radius is null or NaN";
            var slices = this.reader.getFloat(leafsNode, 'slices');
            if (slices == null || isNaN(slices)) return "slices is null or NaN";
            var stacks = this.reader.getFloat(leafsNode, 'stacks');
            if (stacks == null || isNaN(stacks)) return "stacks is null or NaN";
            
            type="sphere";
            properties.push(radius,slices,stacks);
        }

        else if (this.reader.getString(leafsNode, 'type') == "cylinder") {
            var height = this.reader.getFloat(leafsNode, 'height');
            if (height == null || isNaN(height)) return "height is null or NaN";
            var topRadius= this.reader.getFloat(leafsNode,'topRadius');
            if (topRadius == null || isNaN(topRadius)) return "topRadius is null or NaN";
            var bottomRadius= this.reader.getFloat(leafsNode, 'bottomRadius');
            if (bottomRadius == null || isNaN(bottomRadius)) return "bottomRadius is null or NaN";
            var stacks = this.reader.getFloat(leafsNode, 'stacks');
            if (stacks == null || isNaN(stacks)) return "stacks is null or NaN";          
            var slices = this.reader.getFloat(leafsNode, 'slices');
            if (slices == null || isNaN(slices)) return "slices is null or NaN";
            
            type="cylinder";
            properties.push(height,topRadius,bottomRadius,stacks,slices);
        }

        else if (this.reader.getString(leafsNode, 'type') == "torus") {
            var inner = this.reader.getFloat(leafsNode, 'inner');
            if (inner == null || isNaN(inner)) return "inner is null or NaN";
            var outer = this.reader.getFloat(leafsNode, 'outer');
            if (outer == null || isNaN(outer)) return "outer is null or NaN";
            var slices = this.reader.getFloat(leafsNode, 'slices');
            if (slices == null || isNaN(slices)) return "slices is null or NaN";
            var loops = this.reader.getFloat(leafsNode, 'loops');
            if (loops == null || isNaN(loops)) return "loops is null or NaN";
            
            type="torus";
            properties.push(inner,outer,slices,loops);
        }
        return [type,properties];
    }

    parseBoolean(node, name, messageError){
        var boolVal = this.reader.getBoolean(node, name);
        if (!(boolVal != null && !isNaN(boolVal) && (boolVal == true || boolVal == false))) {
            this.onXMLMinorError("unable to parse value component " + messageError + "; assuming 'value = 1'");
            return true;
        }
        return boolVal;
    }
    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates3D(node, messageError) {
        var position = [];

        // x
        var x = this.reader.getFloat(node, 'x');
        if (!(x != null && !isNaN(x)))
            return "unable to parse x-coordinate of the " + messageError;

        // y
        var y = this.reader.getFloat(node, 'y');
        if (!(y != null && !isNaN(y)))
            return "unable to parse y-coordinate of the " + messageError;

        // z
        var z = this.reader.getFloat(node, 'z');
        if (!(z != null && !isNaN(z)))
            return "unable to parse z-coordinate of the " + messageError;

        position.push(...[x, y, z]);

        return position;
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates4D(node, messageError) {
        var position = [];

        //Get x, y, z
        position = this.parseCoordinates3D(node, messageError);

        if (!Array.isArray(position))
            return position;


        // w
        var w = this.reader.getFloat(node, 'w');
        if (!(w != null && !isNaN(w)))
            return "unable to parse w-coordinate of the " + messageError;

        position.push(w);

        return position;
    }

    /**
     * Parse the color components from a node
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseColor(node, messageError) {
        var color = [];

        // R
        var r = this.reader.getFloat(node, 'r');
        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
            return "unable to parse R component of the " + messageError;

        // G
        var g = this.reader.getFloat(node, 'g');
        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
            return "unable to parse G component of the " + messageError;

        // B
        var b = this.reader.getFloat(node, 'b');
        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
            return "unable to parse B component of the " + messageError;

        // A
        var a = this.reader.getFloat(node, 'a');
        if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
            return "unable to parse A component of the " + messageError;

        color.push(...[r, g, b, a]);

        return color;
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {
        var thisNode = this.nodes[this.idRoot];
        thisNode.display(this.nodes,this.materialStack,this.materials,this.textureStack,this.textures);
    }
 
}