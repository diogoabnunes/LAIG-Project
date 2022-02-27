class MySpriteText extends CGFobject {
    constructor(scene, text, texture) {
        super(scene);
        this.scene = scene;
        this.text = text;
        this.textLength=this.text.length;
        this.texture = texture;
        this.spritesheet=new MySpriteSheet(this.scene,"",this.texture,16,16);
        this.rectangle= new MyRectangle(this.scene,0,0,1,1);
    }

    getCharacterPosition(character) {
        return character.charCodeAt(0);
    }

    display() {
        this.scene.pushMatrix();
        this.scene.setActiveShaderSimple(this.spritesheet.shader);

        this.scene.translate(-0.5*(this.textLength-1) - 1.5, -0.5, 0);

        for(var i=0; i<this.textLength; i++){
            var c = this.text.charAt(i);
            var p=this.getCharacterPosition(c);

            this.spritesheet.activateCellP(p);
            this.spritesheet.applyTexture();
            this.scene.translate(1,0,0);
            this.rectangle.display();
        }
        
        this.scene.defaultAppearance.apply();
        this.scene.setActiveShader(this.scene.defaultShader);
        this.scene.popMatrix();
    }

}