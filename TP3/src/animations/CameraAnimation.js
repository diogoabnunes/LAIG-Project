class CameraAnimation {
    constructor(id, scene, fromOriginX, fromDestinyX) {    
        this.id = id;
        this.scene = scene;
        this.keyFrames = [];

        this.time = 0;
        this.near = 0.1;
        this.far = 500;
        this.angle = 30;
        this.fromOriginX = fromOriginX;
        this.fromDestinyX = fromDestinyX;
        this.from = [0, 12, 18];
        this.dur = 1.5;
        this.to = [10, 3, 10];

        this.end = false;
    }
    update(t) {
        if (this.time == 0) this.time = t;
        this.s = t - this.time;
        if (this.s <= this.dur) {
            this.from[0] = this.fromOriginX + this.s * (this.fromDestinyX - this.fromOriginX)/this.dur;
            var camera = new CGFcamera(this.angle * DEGREE_TO_RAD, this.near, this.far, this.from, this.to);
            this.scene.interface.setActiveCamera(camera);
            this.scene.camera = camera;
        }
        else {
            this.end = true;
        }
    }
}