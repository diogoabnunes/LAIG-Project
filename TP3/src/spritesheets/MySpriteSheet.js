class MySpriteSheet {
    constructor(scene, id, texture, m, n) {
        this.scene = scene;
        this.id = id;
        this.texture = texture;
        this.sizeM = m;
        this.sizeN = n;

        this.shader = new CGFshader(this.scene.gl,'spritesheets/sprite.vert','spritesheets/sprite.frag');
    }

    activateCellP(p) {
       	/*Texture coords (s,t)=(m,n)
		+----------> s=m
        | 0 1 2 3
        | 4 5 6 7
		| 8 9 10 11
        | 12 13 14 15
        t=n*/
        
        var m = p % this.sizeM;
        var n = parseInt(p / this.sizeM);

        this.activateCellMN(m,n);
    }

    activateCellMN(m, n) {
        this.shader.setUniformsValues({
            m: m,
            n: n,
            M: this.sizeM,
            N: this.sizeN
        });
    }
    applyTexture(){
        this.texture.bind();
    }
}