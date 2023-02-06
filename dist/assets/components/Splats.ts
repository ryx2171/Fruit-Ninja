import * as PIXI from 'pixi.js';
import {gsap} from 'gsap'
import { PixiAtlas } from './CustomPixi';
import { degToRad,generateRandom } from './Utils';



export class Fruits extends PIXI.Sprite{

   
    fruitTextures:string[] = 
    [
        "game_fruit_orange",
        "game_fruit_red",
        "game_fruit_green",
        "game_fruit_purple",
        "game_fruit_yellow",
        "game_fruit_blue"
    ]

    fruit:PixiAtlas;
    rightFruit:PixiAtlas;
    lefttFruit:PixiAtlas;
    //splash:PixiAtlas;
    _sheet:string
    _id:string;
    _currentTexture:string;
    _isHit:boolean = false;
   
    constructor(sheet:string,_id:string=""){

        super();

        /*this.splash  = this.addChild( new PixiAtlas(sheet, _id + "_s" ) ) ;
        this.splash.anchor.set(0.5);
        this.splash.position.set(-20,0);*/

        this._sheet = sheet;
        this._id = _id;
        this._currentTexture = "";

        this.fruit = this.addChild( new PixiAtlas( sheet, _id ) );
        this.fruit.anchor.set(0.5);
        this.fruit.position.set(20,0);
        
        this.rightFruit = this.addChild( new PixiAtlas(sheet, _id + "_r" ) );
        this.rightFruit.anchor.set(0.5);
        this.rightFruit.position.set(20,0);

        this.lefttFruit  = this.addChild( new PixiAtlas(sheet, _id + "_l" ) ) ;
        this.lefttFruit.anchor.set(0.5);
        this.lefttFruit.position.set(-20,0);

        
        this.on("pointerdown",()=>{
            this.animateSlash();
            this.interactive = false;
            this._isHit = true;
        })

        this.on("pointerover",()=>{
            this.animateSlash();
            this.interactive = false;
            this._isHit = true;
        })
    }

   

    init(){

        if(this._isHit == false){
            this.updateTexture(generateRandom(6));
        }
        
        this.interactive = true;
        this.fruit.visible = true;
        this.rightFruit.visible = false;
        this.lefttFruit.visible = false;
        //this.splash.visible = false;

        this.fruit.rotation = 0;
        //this.splash.rotation = 0;
        this.rightFruit.rotation = 0;
        this.lefttFruit.rotation = 0;

        this.rightFruit.position.set(20,0);
        this.lefttFruit.position.set(-20,0);

    }

    updateTexture(_id:number){

        this._currentTexture = this.fruitTextures[_id]
        this.fruit.changeTexture( this._currentTexture + "_w" );
        this.lefttFruit.changeTexture(this._currentTexture + "_l");
        this.rightFruit.changeTexture(this._currentTexture + "_r");
    
        console.log("_id",_id,this.fruitTextures[_id])
        //this.splash.changeTexture(fruitTexture[_id] + "_s");
    }

    animateSlash(){

        gsap.killTweensOf(this.lefttFruit);
        gsap.killTweensOf(this.rightFruit);
        //gsap.killTweensOf(this.splash);
        //gsap.killTweensOf(this.splash.scale);

        this.fruit.visible = false;
        //this.splash.visible = true;
        this.rightFruit.visible = true;
        this.lefttFruit.visible = true;

        //this.splash.alpha = 0;
        //this.splash.scale.set(0.25);

        this.rightFruit.rotation = 0;
        this.lefttFruit.rotation = 0;

        if(this._currentTexture == "game_fruit_yellow"){
            this.rightFruit.position.set(0,30);
            this.lefttFruit.position.set(0,-30);
            gsap.to(this.lefttFruit,generateRandom(5,9)*0.1,{y:-50,rotation:-degToRad(generateRandom(60,300))});
            gsap.to(this.rightFruit,generateRandom(5,9)*0.1,{y:50,rotation:degToRad(generateRandom(-60,300))});
        }else{
            this.rightFruit.position.set(25,0);
            this.lefttFruit.position.set(-25,0);
            gsap.to(this.lefttFruit,generateRandom(5,9)*0.1,{x:-75,rotation:-degToRad(generateRandom(60,300))});
            gsap.to(this.rightFruit,generateRandom(5,9)*0.1,{x:75,rotation:degToRad(generateRandom(60,300))});
        }
        

        gsap.delayedCall(2,()=>{
            this._isHit = false;
        })

    }


}