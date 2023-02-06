import * as PIXI from 'pixi.js';


type MouseObj = {
    x: number
    y: number  };

export class MouseTrail extends PIXI.Sprite{
    // Get the texture for rope.
     trailTexture = PIXI.Texture.from('../assets/img/trail2.png');
     historyX:number[] = [];
     historyY:number[] = [];
    // historySize determines how long the trail will be.
     historySize = 10;
    // ropeSize determines how smooth the trail will be.
     ropeSize:number = 50;
     points:PIXI.Point[] = [];
     mouseposition:MouseObj; 
     app;

    constructor(app:PIXI.Application){
        super();
        this.app = app;
        this.mouseposition = {x:0,y:0};
        this.createEffect();
    }


     createEffect(){

        // Create history array.
        for (let i = 0; i < this.historySize; i++) {
            this.historyX.push(0);
            this.historyY.push(0);
        }
        // Create rope points.
        for (let i = 0; i < this.ropeSize; i++) {
            this.points.push(new PIXI.Point(0, 0));
        }

        // Create the rope
        const rope:PIXI.SimpleRope = new PIXI.SimpleRope(this.trailTexture, this.points);

        // Set the blendmode
        rope.blendMode = PIXI.BLEND_MODES.COLOR_BURN;
        this.addChild(rope);

        this.app.stage.interactive = true;
        this.app.stage.hitArea = this.app.screen;
        this.app.stage.on('mousemove', (event:any) => {
            this.mouseposition = this.mouseposition || { x: 0, y: 0 };
            this.mouseposition.x = event.data.global.x;
            this.mouseposition.y = event.data.global.y;
        });

        // Listen for animate update
        this.app.ticker.add(() => {
            if (!this.mouseposition) return;

            // Update the mouse values to history
            this.historyX.pop();
            this.historyX.unshift(this.mouseposition.x);
            this.historyY.pop();
            this.historyY.unshift(this.mouseposition.y);
            // Update the points to correspond with history.
            for (let i = 0; i < this.ropeSize; i++) {
                const p = this.points[i];

                // Smooth the curve with cubic interpolation to prevent sharp edges.
                const ix = this.cubicInterpolation(this.historyX, i / this.ropeSize * this.historySize,null);
                const iy = this.cubicInterpolation(this.historyY, i / this.ropeSize * this.historySize,null);

                p.x = ix;
                p.y = iy;
             }
        });


    }

    clipInput(k:number, arr:number[]) {
        if (k < 0) k = 0;
        if (k > arr.length - 1) k = arr.length - 1;
        return arr[k];
    }

    getTangent(k:number, factor:number, array:number[]) {
        return factor * (this.clipInput(k + 1, array) - this.clipInput(k - 1, array)) / 2;
    }

    cubicInterpolation(array:number[], t:number, tangentFactor:number|null) {
        if (tangentFactor == null) tangentFactor = 1;

        const k = Math.floor(t);
        const m = [this.getTangent(k, tangentFactor, array), this.getTangent(k + 1, tangentFactor, array)];
        const p = [this.clipInput(k, array), this.clipInput(k + 1, array)];
        t -= k;
        const t2 = t * t;
        const t3 = t * t2;
        return (2 * t3 - 3 * t2 + 1) * p[0] + (t3 - 2 * t2 + t) * m[0] + (-2 * t3 + 3 * t2) * p[1] + (t3 - t2) * m[1];
    }




    


}