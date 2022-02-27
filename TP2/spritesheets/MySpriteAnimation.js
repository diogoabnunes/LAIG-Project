class MySpriteAnimation { 
    constructor(spritesheet, duration, startCell, endCell) {
        this.spritesheet = spritesheet;
        this.duration = duration;
        this.startCell = startCell;
        this.endCell = endCell;

        this.scene = this.spritesheet.scene;

        this.currCell = startCell;
        this.support = new MyRectangle(this.spritesheet.scene, 0, 0, 2, 2);

        this.time = 0;
        this.state = 0;
        this.rate = duration/(endCell-startCell);
        this.lastFinalRateTime = 0;
    }
    update(t) {
        this.time = t - this.lastFinalRateTime;

        if (this.time > this.rate) {
            if (this.currCell == this.endCell) this.currCell = this.startCell;
            else this.currCell++;

            this.state++;
            this.lastFinalRateTime = this.rate * this.state;
        }
        this.spritesheet.activateCellP(this.currCell);
    }
    display() {
        this.scene.setActiveShaderSimple(this.spritesheet.shader);
        this.spritesheet.applyTexture();
        this.support.display();
        this.scene.defaultAppearance.apply();
        this.scene.setActiveShader(this.scene.defaultShader);         
    }
}