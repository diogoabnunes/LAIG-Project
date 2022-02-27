class KeyframeAnimation {
    constructor(id, scene) {    
        this.id = id;
        this.scene = scene;
        this.keyFrames = [];

        this.T = [0,0,0];
        this.R = [0,0,0];
        this.S = [1,1,1];

        this.activeState = false;
        this.deltaTime = 0;
        
        this.int = 0; // intervalo entre inicio programa e o 1 keyframe.instant
    }
    addKeyFrame(keyFrame) {
        this.keyFrames.push(keyFrame);
    }
    getActiveState(){
        return this.activeState;
    }
    update(t) {

        if (this.int < this.keyFrames.length) { // Ainda tem animations para fazer
            var finishIntTime = this.keyFrames[this.int].instant;

            var diff, tx, ty, tz, rx, ry, rz, sx, sy, sz; // Variáveis auxs para usar a seguir

            if (this.int > 0) { // Restantes Keyframes
                this.activeState = true;

                diff = finishIntTime - this.keyFrames[this.int -1].instant;

                this.T[0] = this.keyFrames[this.int-1].T[0];
                this.T[1] = this.keyFrames[this.int-1].T[1];
                this.T[2] = this.keyFrames[this.int-1].T[2];

                this.R[0] = this.keyFrames[this.int-1].R[0];
                this.R[1] = this.keyFrames[this.int-1].R[1];
                this.R[2] = this.keyFrames[this.int-1].R[2];

                this.S[0] = this.keyFrames[this.int-1].S[0];
                this.S[1] = this.keyFrames[this.int-1].S[1];
                this.S[2] = this.keyFrames[this.int-1].S[2];

                tx = this.keyFrames[this.int].T[0] - this.T[0];
                ty = this.keyFrames[this.int].T[1] - this.T[1];
                tz = this.keyFrames[this.int].T[2] - this.T[2];
              
                rx = this.keyFrames[this.int].R[0] - this.R[0];
                ry = this.keyFrames[this.int].R[1] - this.R[1];
                rz = this.keyFrames[this.int].R[2] - this.R[2];
            
                sx = this.keyFrames[this.int].S[0] - this.S[0];
                sy = this.keyFrames[this.int].S[1] - this.S[1];
                sz = this.keyFrames[this.int].S[2] - this.S[2];
            }

            if (t <= finishIntTime) { // Dentro do int atual

                this.deltaTime = (1 - (finishIntTime - t) / diff);

                this.T[0] += tx*this.deltaTime;
                this.T[1] += ty*this.deltaTime;
                this.T[2] += tz*this.deltaTime;

                this.R[0] += rx*this.deltaTime;
                this.R[1] += ry*this.deltaTime;
                this.R[2] += rz*this.deltaTime;

                this.S[0] += sx*this.deltaTime;
                this.S[1] += sy*this.deltaTime;
                this.S[2] += sz*this.deltaTime;
            }
            else {
                this.int++; // Passa para o int seguinte
                this.T[0] = this.keyFrames[this.int-1].T[0];
                this.T[1] = this.keyFrames[this.int-1].T[1];
                this.T[2] = this.keyFrames[this.int-1].T[2];

                this.R[0] = this.keyFrames[this.int-1].R[0];
                this.R[1] = this.keyFrames[this.int-1].R[1];
                this.R[2] = this.keyFrames[this.int-1].R[2];

                this.S[0] = this.keyFrames[this.int-1].S[0];
                this.S[1] = this.keyFrames[this.int-1].S[1];
                this.S[2] = this.keyFrames[this.int-1].S[2];
            }
        }
    }
    apply() {
        this.scene.translate(this.T[0],this.T[1],this.T[2]);
        this.scene.rotate(this.R[0] * DEGREE_TO_RAD, 1, 0, 0);
        this.scene.rotate(this.R[1] * DEGREE_TO_RAD, 0, 1, 0);
        this.scene.rotate(this.R[2] * DEGREE_TO_RAD, 0, 0, 1);
        this.scene.scale(this.S[0], this.S[1], this.S[2]);
    }
}