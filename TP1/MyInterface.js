/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);

        this.gui = new dat.GUI();

        this.gui.add(this.scene, 'scaleFactor', 0.1, 5).name("Scale Factor");
        this.gui.add(this.scene, 'displayAxis').name("Display Axis");

        this.initKeys();

        return true;
    }

    addLights(lights) {
        var folder = this.gui.addFolder("Lights");

        for (var key in lights) {
            if (lights.hasOwnProperty(key)) {
                this.scene.lightsInterface[key] = lights[key][0];
                folder.add(this.scene.lightsInterface, key);
            }
        }
    }
    
    addCameras() {
        this.gui.add(this.scene, 'selectedView', this.scene.viewsID).name('Camera').onChange(this.scene.updateCamera.bind(this.scene));
    }

    initKeys() {
        this.scene.gui=this;
        this.processKeyboard=function(){};
        this.activeKeys={};
    }

    processKeyDown(event) {
        this.activeKeys[event.code]=true;
    };

    processKeyUp(event) {
        this.activeKeys[event.code]=false;
    };

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }
}