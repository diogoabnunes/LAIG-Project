class Player extends CGFobject {
    constructor(scene, species, pos) {
        super(scene);
        this.scene = scene;
        this.species=species;

        this.score = 0;
        this.type="player";
        this.position = pos;
    }
    getScore(){
        return this.score;
    }
    updateScore(score){
        this.score=score;
    }
    setBotType(){
        this.type="bot";
    }
    changeType(type){
        this.type=type;
    }
    resetType(){
        this.type="player"
    }
}