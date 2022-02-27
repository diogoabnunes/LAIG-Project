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
        this.initKeys();

        this.gui.add(this.scene, 'scaleFactor', 0.1, 5).name("Scale Factor");
        //this.gui.add(this.scene, 'displayAxis').name("Display Axis");

        return true;
    }

    addSettings(lights) {
        var scene = this.scene;
        this.gui.add(this.scene, 'fixCamera').name("Fix Camera").onChange(function(value) { scene.fixCamera = value; } )
        this.gui.add(this.scene, 'currentScene', ["wood", "light", "dark"]).name("Scene Theme").onChange(function(value) { scene.changeScene(value); });
        this.gui.add(this.scene, 'selectedView', this.scene.viewsID).name('Camera').onChange(this.scene.updateCamera.bind(this.scene));
        var folder = this.gui.addFolder("Lights");

        for (var key in lights) {
            if (lights.hasOwnProperty(key)) {
                this.scene.lightsInterface[key] = lights[key][0];
                folder.add(this.scene.lightsInterface, key);
            }
        }

        var ingame = this.gui.addFolder("Game");
        ingame.open();
        ingame.add(this.scene.game, "currentMode", this.scene.game.mode).name("Mode");
        ingame.add(this.scene.game, "currentLevel", this.scene.game.level).name("Level");
        let start = { add: () => this.scene.game.start() };
        ingame.add(start, 'add').name("START");
        let undo = { add: () => this.scene.game.undo() };
        ingame.add(undo, 'add').name("UNDO");
        let quit = { add: () => this.scene.game.quit() };
        ingame.add(quit, 'add').name("QUIT");
        let movie = { add: () => this.scene.game.movie() };
        ingame.add(movie, 'add').name("MOVIE");

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