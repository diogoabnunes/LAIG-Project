/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface 
     */
    constructor(myinterface) {
        super();

        this.interface = myinterface;
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.sceneInited = false;
        this.sceneChanged = false;

        this.initCameras();
        this.lightsInterface = {};
        this.viewsID = [];
        this.selectedView = null;
        this.animations = [];

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);
        this.displayAxis = false;
        this.ti = null;

        this.scaleFactor = 1;

        this.loadingProgressObject=new MyRectangle(this, -1, -.1, 1, .1);
        this.loadingProgress=0;

        this.defaultAppearance = new CGFappearance(this);
        this.setUpdatePeriod(100);
        this.setPickEnabled(true);
    }

    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
        this.fixCamera = true;
    }
    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        var i = 0;
        // Lights index.

        // Reads the lights from the scene graph.
        for (var key in this.graph.lights) {
            if (i >= 8)
                break;              // Only eight lights allowed by WebCGF on default shaders.

            if (this.graph.lights.hasOwnProperty(key)) {
                var graphLight = this.graph.lights[key];

                this.lights[i].setPosition(...graphLight[1]);
                this.lights[i].setAmbient(...graphLight[2]);
                this.lights[i].setDiffuse(...graphLight[3]);
                this.lights[i].setSpecular(...graphLight[4]);

                this.lights[i].setVisible(true);
                if (graphLight[0])
                    this.lights[i].enable();
                else
                    this.lights[i].disable();

                this.lights[i].update();

                i++;
            }
        }
    }

    /** Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {
        this.axis = new CGFaxis(this, this.graph.referenceLength);

        this.gl.clearColor(...this.graph.background);

        this.setGlobalAmbientLight(...this.graph.ambient);

        this.initLights();
        this.currentScene = this.graph.filename.slice(0, -4);

        if(!this.sceneChanged){
            this.game = new Game(this);        

            this.updateCamera();
            this.interface.addSettings(this.graph.lights);
        }

        this.sceneInited = true;
    }

    changeScene(filename) {
        this.sceneChanged = true;
        this.sceneInited = false;
        let myGraph = new MySceneGraph(filename + '.xml', this);
    }

    /**
     * Updates the camera: sets the selected camera to active camera.
     */
    updateCamera() {
        this.camera = this.graph.views[this.selectedView];
        this.interface.setActiveCamera(this.camera);
    }

    /**
     * Updates the ligths: visible/not visible, enable/disable.
     */
    updateLights() {
        var i = 0;
        for (var key in this.lightsInterface) {
            if (this.lightsInterface.hasOwnProperty(key)) {
                if (this.lightsInterface[key]) {
                    this.lights[i].setVisible(true);
                    this.lights[i].enable();
                }
                else {
                    this.lights[i].setVisible(false);
                    this.lights[i].disable();
                }
                this.lights[i].update();
                i++;
            }
        }
    }

    update(time) {
        if (this.ti == null) this.ti = time;
        this.instant = (time - this.ti) / 1000; // seconds
        // transverse the entire scenegraph
        // and update component animations based on current time
        // updateAnimation(time)
        for (var i in this.animations) {
            this.animations[i].update(this.instant);
            if (this.animations[i].end == true && (this.animations[i] instanceof CameraAnimation)) {
                this.animations.splice(i, 1);
            }
        }
        for (var i in this.graph.spriteAnimations) {
            this.graph.spriteAnimations[i].update(this.instant);
        }
    }

    getTime() {
        return this.instant;
    }

    getMaterial(name) {
        for (var id in this.graph.materials) {
            if (id == name) return this.graph.materials[id];
        }
    }

    logPicking() {
		if (this.pickMode == false) {
			if (this.pickResults != null && this.pickResults.length > 0) {
				for (var i = 0; i < this.pickResults.length; i++) {
                    var obj = this.pickResults[i][0];
					if (obj) {
						var customId = this.pickResults[i][1];
                        //console.log("LOG: Picked object with pick id " + customId);
                        this.game.pickingHandler(customId);						
                    }
				}
                this.pickResults.splice(0, this.pickResults.length);
			}
		}
	}

    /**
     * Displays the scene.
     */
    display() {
        this.logPicking();
        this.clearPickRegistration();
        // ---- BEGIN Background, camera and axis setup

        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        this.pushMatrix();

        var sca = [this.scaleFactor, 0.0, 0.0, 0.0,
            0.0, this.scaleFactor, 0.0, 0.0,
            0.0, 0.0, this.scaleFactor, 0.0,
            0.0, 0.0, 0.0, 1.0];

        this.multMatrix(sca);

        if (this.sceneInited) {
            // Draw axis
            if (this.displayAxis) this.axis.display();

            this.updateLights();
 
            this.defaultAppearance.apply();

            // Displays the scene (MySceneGraph function).
            this.graph.displayScene();
            this.game.display();
        }
        else
        {
            // Show some "loading" visuals
            this.defaultAppearance.apply();

            this.rotate(-this.loadingProgress/10.0,0,0,1);
            
            this.loadingProgressObject.display();
            this.loadingProgress++;
        }

        this.popMatrix();
        // ---- END Background, camera and axis setup
    }
}