import * as PIXI from 'pixi.js';
import Preload from './Preloader';
import { PixiAtlas } from './assets/components/CustomPixi';
import {gsap, Sine, Elastic, Power1} from "gsap";
import GameSettings from './GameSettings'; 
import { Fruits } from './assets/components/Fruit';
import { generateRandom, degToRad } from './assets/components/Utils';
import { MouseTrail } from './assets/components/MouseTrail';

const cssstyle = require('./assets/css/style.css');
const gameSettings:GameSettings = new GameSettings();
const app:PIXI.Application = new PIXI.Application(gameSettings.game);
//var renderer = PIXI.autoDetectRenderer( {antialias: false, transparent: false, resolution: 1, view: app.view} );
const preload:Preload = new Preload(app,assetsLoadedComplete); 

let cw:number = window.innerWidth;
let ch:number = window.innerHeight;
let _speed:number = 1;
let fruitID:number = 0;
let maxFruit:number = 40;
let _spawnSpeed:number = 1;

let background:PIXI.Sprite;
let fruits:Fruits[] = [];
let splats:PixiAtlas[] = [];

let mouseFX:MouseTrail;

function assetsLoadedComplete(){
        createMenu();
}

function createMenu():void{

      background = new PIXI.Sprite(preload.loadImage('game_bg.jpg'));
      app.stage.addChild(background);
      background.anchor.set(0.5);	  
      background.position.set(cw *0.5,ch*0.5);
      background.scale.set(0.8);

      let i:number = 0;
      //let frt:Fruits;

      for( i = 0 ; i < maxFruit; i++){
            splats[i] = background.addChild(new PixiAtlas("fruits","game_fruit_orange_s"));
            splats[i].anchor.set(0.5);
            splats[i].position.set(0,0);
            splats[i].alpha = 0;
      }

      for( i = 0; i < maxFruit; i++){
            fruits[i] = background.addChild( new Fruits(i,"fruits") );
            fruits[i].anchor.set(0.5);
            fruits[i].position.set(0,900);
            fruits[i].interactive = true;
            fruits[i].buttonMode = true;
            fruits[i].on("slash",(e)=>{
                  onSlice(e.id);
            })
      }

      
      
      mouseFX = app.stage.addChild( new MouseTrail(app) );
      mouseFX.anchor.set(0)
      
      gameStart();

      onResize();
}

function onSlice(id:number){

      //splats[id].rotation = degToRad(generateRandom(180));
      splats[id].changeTexture(fruits[id]._currentTexture + "_s");
      splats[id].alpha = 0;
      splats[id].scale.set(0.25)
      splats[id].position.set(fruits[id].position.x,fruits[id].position.y-100);

      gsap.to( splats[id],0.5,{alpha:1,repeat:1,yoyo:true,repeatDelay:0.5,ease:Sine.easeOut});
      gsap.to( splats[id].scale,0.4,{x:1,y:1,ease:Sine.easeOut});
}



function gameStart(){
      fruitLauncher();
}

function fruitLauncher(){
      throwFruit( fruits[fruitID] );
      gsap.delayedCall(_spawnSpeed,()=>{
            
            if(fruitID >= maxFruit){
                  fruitID = 0;
            }
            fruitLauncher();
      });
}


function throwFruit(fruit:Fruits){
      fruitID += 1;
      fruit.init();
     
      fruit.y = 900;
      fruit.x = 0;
      fruit.rotation = degToRad(0);

      gsap.to(fruit,_speed,{y:-generateRandom(100,100),repeat:1,yoyo:true})
      gsap.to(fruit,_speed*2,{x: generateRandom(150,0),rotation: 2});//degToRad(180)})

}

function initPixi():void{     
      console.log('pixijs5.3.12-ts-dev started!');
      //PIXI.settings.PRECISION_FRAGMENT = 'highp';
      PIXI.settings.PRECISION_FRAGMENT;
      PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
      
      let gameCanvasContainer = document.getElementById('gamecanvas');
          gameCanvasContainer?.appendChild(app.view);
}

window.addEventListener("load", (event) => {
      initPixi();
});

window.addEventListener('resize', onResize);
function onResize(): void {
     console.log("size",{height:app.renderer.height,width:app.renderer.width});
     cw = window.innerWidth;
     ch = window.innerHeight
     app.renderer.resize(cw, ch);
     background.position.set(cw *0.5, ch*0.5);
     //background.scale.set(cw/500);
}

//export preloader assets
export const Assets = preload;