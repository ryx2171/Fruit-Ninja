import * as PIXI from 'pixi.js';
import {gsap} from 'gsap'
import { PixiAtlas } from './CustomPixi';
import { degToRad,generateRandom } from './Utils';





export class Fruits extends PIXI.Sprite{

   
    fruitTextures:string[] = 
    [
        "game_fruit_green",
        "game_fruit_yellow",
        "game_fruit_purple",
        "game_fruit_orange",
        "game_fruit_red",
        "game_fruit_blue"
    ];

    fruitTextureId:number;

    fruit:PixiAtlas;
    rightFruit:PixiAtlas;
    lefttFruit:PixiAtlas;
    //splash:PixiAtlas;
    _sheet:string
    _id:string;
    _currentTexture:string;
    _isHit:boolean = false;
    _obj_id:number;
   
    constructor(obj_id:number,sheet:string,_id:string=""){

        super();

        /*this.splash  = this.addChild( new PixiAtlas(sheet, _id + "_s" ) ) ;
        this.splash.anchor.set(0.5);
        this.splash.position.set(-20,0);*/

        this._sheet = sheet;
        this._id = _id;
        this._currentTexture = "";
        this._obj_id = obj_id;
        this.fruitTextureId = 0;

        this.fruit = this.addChild( new PixiAtlas( sheet, _id ) );
        this.fruit.anchor.set(0.5);
        this.fruit.position.set(20,0);
        
        this.rightFruit = this.addChild( new PixiAtlas(sheet, _id + "_r" ) );
        this.rightFruit.anchor.set(0.5);
        this.rightFruit.position.set(20,0);

        this.lefttFruit  = this.addChild( new PixiAtlas(sheet, _id + "_l" ) ) ;
        this.lefttFruit.anchor.set(0.5);
        this.lefttFruit.position.set(-20,0);

        this.interactiveChildren = true;

        this.on("pointerdown",()=>{
            console.log("pointerdown");
            this.popFruit();
        }).on("pointerover",()=>{
            console.log("pointerover");
            this.popFruit();
        })

        this.addListener("pointerenter",()=>{
            console.log("test12333");
        });

    }

    popFruit(){
        this.animateSlash();
        this.interactive = false;
        this._isHit = true;
    }

    init(){

        if(this._isHit == false){
            this.fruitTextureId =  generateRandom(6);
            this.updateFruitTexture( this.fruitTextures[this.fruitTextureId] );
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

    updateFruitTexture(_texture:string){
        this._currentTexture = _texture;
        this.fruit.changeTexture( this._currentTexture + "_w" );
    }

    updateSliceTexture(){
        this._currentTexture = this.fruit.texture.textureCacheIds[0].split("_w")[0]
        this.lefttFruit.changeTexture(  this._currentTexture  + "_l");
        this.rightFruit.changeTexture(  this._currentTexture + "_r");
    }

    triggerSlashEvent(){
        this.emit("slash",{id:this._obj_id});
    }


    animateSlash(){

        this.updateSliceTexture();

        this.triggerSlashEvent();

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