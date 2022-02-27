class Piece extends CGFobject {
    constructor(scene, id, cell, type) {
        super(scene);
        this.scene = scene;
        this.id=id;
        this.cell=cell;
        this.x = 0;
        this.y = 0;
        this.xCell = 0;
        this.yCell = 0;
        this.type = type;
        this.cylinder= new MyCylinder(scene, 0.25, 0.25, 0.25, 16, 16);
        this.mapCell();
        this.hasAnimation = 0;
    }
    changeCell(cell){
        this.cell=cell;
        this.oldXCell=this.xCell;
        this.oldYCell = this.yCell;
        this.mapCell();
    }
    mapCell() {
        if (this.cell > 1020) {
            
        }
        var cellStr = this.cell.toString();
        switch(cellStr[0]) {
            case '1': 
                if (cellStr[1] == 0) {
                    this.x = parseInt(cellStr[0] + cellStr[1]);
                    this.y = parseInt(cellStr.substring(2));
                }
                else {
                    this.x = parseInt(cellStr[0]);
                    this.y = parseInt(cellStr[1]);
                }
                break;
            default:
                this.x = parseInt(cellStr[0]);
                this.y = parseInt(cellStr[1]);
                break;
        }
        
        this.xCell = (this.x - 1) * 0.8;
        this.yCell = (this.y - 1) * Math.sqrt(3)/2*0.5 + 0.5*(this.y - 1) - (this.x - 1)*0.5;
    }

    moveAnimationEatedPiece(){
        var t = this.scene.getTime();

        this.hasAnimation = 1;
        this.initial= new Keyframe(t, [this.oldXCell,this.oldYCell,0], [0,0,0], [1,1,1]);
        this.up= new Keyframe(t+1,[this.oldXCell,this.oldYCell,1.5],[0,0,0],[1,1,1]);
        this.slide= new Keyframe(t+2,[this.xCell,this.yCell,1.5],[0,0,0],[1,1,1]);
        this.down= new Keyframe(t+3,[this.xCell,this.yCell,0],[0,0,0],[1,1,1]);

        this.anim = new KeyframeAnimation("id", this.scene);

        this.anim.addKeyFrame(this.initial);
        this.anim.addKeyFrame(this.up);
        this.anim.addKeyFrame(this.slide);
        this.anim.addKeyFrame(this.down);

        this.scene.animations.push(this.anim);
    }

    moveAnimationPiece() {
        var t = this.scene.getTime();

        this.hasAnimation = 1;
        this.initial= new Keyframe(t, [this.oldXCell,this.oldYCell,0], [0,0,0], [1,1,1]);
        this.up= new Keyframe(t+1,[this.oldXCell,this.oldYCell,0.75],[0,0,0],[1,1,1]);
        this.slide= new Keyframe(t+2,[this.xCell,this.yCell,0.75],[0,0,0],[1,1,1]);
        this.down= new Keyframe(t+3,[this.xCell,this.yCell,0],[0,0,0],[1,1,1]);

        this.anim = new KeyframeAnimation("id", this.scene);

        this.anim.addKeyFrame(this.initial);
        this.anim.addKeyFrame(this.up);
        this.anim.addKeyFrame(this.slide);
        this.anim.addKeyFrame(this.down);

        this.scene.animations.push(this.anim);
    }

    moveAnimationPieceMovie(first, t) {

        this.hasAnimation = 1;
        this.pre = new Keyframe(first, [this.oldXCell,this.oldYCell,0], [0,0,0], [1,1,1]);
        this.initial= new Keyframe(t, [this.oldXCell,this.oldYCell,0], [0,0,0], [1,1,1]);
        this.up= new Keyframe(t+1,[this.oldXCell,this.oldYCell,0.75],[0,0,0],[1,1,1]);
        this.slide= new Keyframe(t+2,[this.xCell,this.yCell,0.75],[0,0,0],[1,1,1]);
        this.down= new Keyframe(t+3,[this.xCell,this.yCell,0],[0,0,0],[1,1,1]);

        this.anim = new KeyframeAnimation("id", this.scene);

        this.anim.addKeyFrame(this.pre);
        this.anim.addKeyFrame(this.initial);
        this.anim.addKeyFrame(this.up);
        this.anim.addKeyFrame(this.slide);
        this.anim.addKeyFrame(this.down);

        this.scene.animations.push(this.anim);
    }

    moveAnimationEatedPieceMovie(first, t){

        this.hasAnimation = 1;
        this.pre = new Keyframe(first, [this.oldXCell,this.oldYCell,0], [0,0,0], [1,1,1]);
        this.initial= new Keyframe(t, [this.oldXCell,this.oldYCell,0], [0,0,0], [1,1,1]);
        this.up= new Keyframe(t+1,[this.oldXCell,this.oldYCell,1.5],[0,0,0],[1,1,1]);
        this.slide= new Keyframe(t+2,[this.xCell,this.yCell,1.5],[0,0,0],[1,1,1]);
        this.down= new Keyframe(t+3,[this.xCell,this.yCell,0],[0,0,0],[1,1,1]);

        this.anim = new KeyframeAnimation("id", this.scene);

        this.anim.addKeyFrame(this.pre);
        this.anim.addKeyFrame(this.initial);
        this.anim.addKeyFrame(this.up);
        this.anim.addKeyFrame(this.slide);
        this.anim.addKeyFrame(this.down);

        this.scene.animations.push(this.anim);
    }
    
    translatePiece(){
        this.scene.translate(this.xCell, this.yCell, 0);
    }

    display() {
        this.scene.translate(0, 4.5, 0);
        this.scene.rotate(-90 * DEGREE_TO_RAD, 0, 0, 1);
        if (this.hasAnimation == 0) this.translatePiece();
        else this.anim.apply();
        this.material.apply();
        this.cylinder.display();
    }
}

