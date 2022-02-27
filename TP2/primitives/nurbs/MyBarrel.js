class MyBarrel extends CGFobject { // Sup. cilíndrica sem tampas: raio nas extremidades igual; base do barril na origem, eixo principal ZZ.
    constructor(scene, base, middle, height, slices, stacks) {
        super(scene);
        this.scene = scene;
        this.base = base;
        this.middle = middle;
        this.height = height;
        this.slices = slices;
        this.stacks = stacks;

        this.createBarrel();
    }
    createBarrel() {
        this.p1 = this.createHalfBarrel();
        this.p2 = this.p1;
    }
    createHalfBarrel() {
        //Calcular 1 metade
        let h=(4/3)*this.base;
        let H=(4/3)*(this.middle - this.base);

        this.controlPoints=[
            //P4
            [this.base, 0, 0], //Q1
            [this.base+H, 0, this.height/3], //Q2
            [this.base+H, 0, 2*this.height/3],  //Q4
            [this.base, 0, this.height], //Q4

            //P3
            [this.base, h, 0], //Q1
            [this.base+H, h+H, this.height/3], //Q2 
            [this.base+H, h+H, 2*this.height/3], //Q3
            [this.base, h, this.height], //Q4

            //P2
            [-this.base, h, 0], //Q1
            [-this.base-H, h+H, this.height/3], //Q2
            [-this.base-H, h+H, 2*this.height/3], //Q3
            [-this.base, h, this.height], //Q4

            //P1 x= - base
            [-this.base, 0, 0], //Q1
            [-this.base-H, 0, this.height/3], //Q2
            [-this.base-H, 0, 2*this.height/3], //Q3
            [-this.base, 0, this.height] //Q4            
        ]

        return new MyPatch(this.scene,4,4,this.slices,this.stacks,this.controlPoints); 
    }
    display() {
        this.p1.display();
        this.scene.rotate(180*DEGREE_TO_RAD, 0, 0, 1);
        this.p2.display();
    }   

    updateTexCoords(afs, aft) { }
}