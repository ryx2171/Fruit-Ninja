//PixiJS 6.5.9

import * as PIXI from 'pixi.js';
import Preload from './Preloader';
import { PixiAtlas } from './components/CustomPixi';
import {gsap, Sine, Back, Strong} from "gsap";
import GameSettings from './GameSettings'; 
import { Fruits } from './components/Fruit';
import { generateRandom, degToRad, numberComma } from './components/Utils';
import { MouseTrail } from './components/MouseTrail';
import SoundFX from './assets/snd/SoundFX';


type scoreData = { val: number};

const cssstyle = require('./assets/css/style.css');
const gameSettings:GameSettings = new GameSettings();
const app:PIXI.Application = new PIXI.Application(gameSettings.game);
//var renderer = PIXI.autoDetectRenderer( {antialias: false, transparent: false, resolution: 1, view: app.view} );
const preload:Preload = new Preload(app,assetsLoadedComplete); 

//settings
let cw:number = 500;//window.innerWidth;
let ch:number = 888;//window.innerHeight;
let _speed:number = 1;
let fruitID:number = 0;
let maxFruit:number = 40;
let _spawnSpeed:number = 2;//shorter = faster
let gameScore:number = 0;
let maxTime:number = 60;
let currentTime:number = maxTime;

//objects
let sceneContainer:PIXI.Container;
let gameSceneBackground:PIXI.Sprite;
let gameIntroBackground:PIXI.Sprite;
let gameOverBackground:PIXI.Sprite;


let fruits:Fruits[] = [];
let splats:PixiAtlas[] = [];
let mouseFX:MouseTrail;
let labelSpriteContainer:PIXI.Sprite;
let scoreTotalText:PIXI.Text;
let timerText:PIXI.Text;

let SFX:SoundFX = new SoundFX();


let logoFruit:PixiAtlas;
let logoSlash:PixiAtlas;
let logoSplats:PixiAtlas;

let fruitDesignTop:PixiAtlas;
let fruitDesignBottom:PixiAtlas;
let playButton:PixiAtlas;

let instructionboard:PIXI.Sprite;


let finalScoreText:PIXI.Text;
let retryButton:PixiAtlas;

let gametextstyle:PIXI.TextStyle = new PIXI.TextStyle({
      fontFamily:"JAPANESE_2020",
      //fontWeight:"200",
      fontSize:20,
      stroke:"#663300",
      strokeThickness: 5,
      letterSpacing: 0.8,
      align:'center',
      fill: [
            "#ff9900",
            "#ffcc00"
      ],
});


function assetsLoadedComplete(){

      sceneContainer = app.stage.addChild( new PIXI.Container() );

      mouseFX = app.stage.addChild( new MouseTrail(app) );
      mouseFX.anchor.set(0)
      
      createIntroScene();
      createGameScene();
      createGameOverScene();

}

function createIntroScene(){

      gameIntroBackground = sceneContainer.addChild( new PIXI.Sprite(preload.loadImage('game_bg.jpg')) );
      gameIntroBackground.anchor.set(0.5);	  
      gameIntroBackground.position.set(cw *0.5,ch*0.5);
      //gameIntroBackground.scale.set(0.8);

      fruitDesignTop = gameIntroBackground.addChild(new PixiAtlas("sprites1","fruit_design"));
      fruitDesignTop.anchor.set(0.5);
      fruitDesignTop.scale.set(1,-1);
      fruitDesignTop.position.set(0,-444);
      fruitDesignTop.alpha = 0;

      fruitDesignBottom = gameIntroBackground.addChild(new PixiAtlas("sprites1","fruit_design"));
      fruitDesignBottom.anchor.set(0.5);
      fruitDesignBottom.position.set(0,444);
      fruitDesignBottom.alpha = 0;

      logoSplats = gameIntroBackground.addChild(new PixiAtlas("fruits","game_fruit_orange_s"));
      logoSplats.anchor.set(0.5);
      logoSplats.position.set(0,0);
      logoSplats.alpha = 0;

      logoFruit = gameIntroBackground.addChild(new PixiAtlas("logo","fruit_logo1"));
      logoFruit.anchor.set(0.5);
      logoFruit.position.set(0,0);
      logoFruit.alpha = 1;

      logoSlash = gameIntroBackground.addChild(new PixiAtlas("logo","slash"));
      logoSlash.anchor.set(0.5);
      logoSlash.position.set(0,60);
      logoSlash.alpha = 1;

      playButton = gameIntroBackground.addChild(new PixiAtlas("sprites1","play_btn"));
      playButton.anchor.set(0.5);
      playButton.scale.set(1);
      playButton.position.set(0,280);
      playButton.visible = false;
      playButton.interactive = true;
      playButton.buttonMode = true;

      playButton.on('pointerdown',()=>{
            //animateIntro();
            gameIntroBackground.visible = false;
            gameSceneBackground.visible = true;
            animateInstructions();
      })


      animateIntro();
}

function animateIntro(){

      logoSlash.scale.set(2);
      logoFruit.scale.set(2);
      logoFruit.alpha = 0;
      logoSlash.alpha = 0;
      logoSplats.alpha = 0;
      logoSlash.y = -600;
      playButton.visible = false;
      logoFruit.changeTexture("fruit_logo1");

      fruitDesignTop.y = -600;
      fruitDesignBottom.y = 600;

      fruitDesignTop.alpha = 1;
      fruitDesignBottom.alpha = 1;

      gsap.to(fruitDesignTop,1,{y:-444,ease:Back.easeOut});
      gsap.to(fruitDesignBottom,1,{y:444,ease:Back.easeOut,delay:0.5});

      gsap.to(logoFruit.scale,1,{x:1,y:1,ease:Strong.easeOut,delay:1});
      gsap.to(logoFruit,1,{alpha:1,ease:Strong.easeOut,delay:1});

      gsap.to(logoSlash.scale,0.5,{x:1,y:1,ease:Strong.easeOut,delay:2});
      gsap.to(logoSlash,0.5,{y:60,alpha:1,ease:Strong.easeIn,delay:2});

      gsap.to(logoSplats.scale,0.5,{x:1,y:1,ease:Strong.easeOut,delay:2.25});
      gsap.to(logoSplats,0.5,{y:0,alpha:1,ease:Strong.easeIn,delay:2.25});

      gsap.to(logoFruit.scale,0.15,{x:1.2,y:1.2,repeat:1,yoyo:true,delay:1.5});

      gsap.delayedCall(2.5,()=>{
            logoFruit.changeTexture("fruit_logo2");
      })

      gsap.delayedCall(3,()=>{
            playButton.visible = true;
            gsap.to(playButton.scale,0.15,{x:1.2,y:1.2,repeat:11,yoyo:true});
      })
}

function animateInstructions(){
      resetValue();

      instructionboard.visible = true;
      instructionboard.alpha = 0;
      instructionboard.scale.set(3);

      gsap.to(instructionboard.scale,1,{x:1,y:1,ease:Back.easeOut});
      gsap.to(instructionboard,1,{alpha:1,ease:Back.easeOut});

      gsap.delayedCall(4,()=>{
            instructionboard.visible = false;
            gameStart();
      })

}

function createGameScene():void{

      gameSceneBackground = sceneContainer.addChild( new PIXI.Sprite(preload.loadImage('game_bg.jpg')) );
      gameSceneBackground.anchor.set(0.5);	  
      gameSceneBackground.position.set(cw *0.5,ch*0.5);
      //gameSceneBackground.scale.set(0.8);
      gameSceneBackground.visible = false;

      instructionboard = gameSceneBackground.addChild( new PIXI.Sprite(preload.loadImage('board.png')) );
      instructionboard.anchor.set(0.5);	  
      instructionboard.position.set(0,0);

      labelSpriteContainer = gameSceneBackground.addChild( new PIXI.Sprite()  );
      labelSpriteContainer.anchor.set(0.5)
      labelSpriteContainer.position.set(0,-400);

      scoreTotalText = labelSpriteContainer.addChild( new PIXI.Text("🍋"+ gameScore,gametextstyle));
      scoreTotalText.anchor.set(0.5)
      scoreTotalText.position.set(-200,0);

      timerText = labelSpriteContainer.addChild( new PIXI.Text("🕒"+ currentTime,gametextstyle));
      timerText.anchor.set(0.5)
      timerText.position.set(175,0);


      let i:number = 0;

      for( i = 0 ; i < maxFruit; i++){
            splats[i] = gameSceneBackground.addChild(new PixiAtlas("fruits","game_fruit_orange_s"));
            splats[i].anchor.set(0.5);
            splats[i].position.set(0,0);
            splats[i].alpha = 0;
            //splats[i].blendMode = PIXI.BLEND_MODES.SCREEN;
      }

      for( i = 0; i < maxFruit; i++){
            fruits[i] = gameSceneBackground.addChild( new Fruits(i,"fruits") );
            fruits[i].anchor.set(0.5);
            fruits[i].position.set(0,900);
            fruits[i].interactive = true;
            fruits[i].buttonMode = true;
            fruits[i].on("slash",(e)=>{
                  onSlice(e.id);
            })
      }
}


function createGameOverScene(){
      gameOverBackground = sceneContainer.addChild( new PIXI.Sprite(preload.loadImage('game_bg2.png')) );
      gameOverBackground.anchor.set(0.5);	  
      gameOverBackground.position.set(cw *0.5,ch*0.5);
      //gameOverBackground.scale.set(0.8);
      gameOverBackground.visible = false;

      finalScoreText = gameOverBackground.addChild( new PIXI.Text("🍋"+ gameScore,gametextstyle));
      finalScoreText.anchor.set(0.5);
      finalScoreText.style.fontSize = 40;
      finalScoreText.position.set(0,-50);
      finalScoreText.scale.set(2);

      retryButton = gameOverBackground.addChild(new PixiAtlas("sprites1","retry_btn"));
      retryButton.anchor.set(0.5);
      retryButton.scale.set(1);
      retryButton.position.set(0,200);
      retryButton.interactive = true;
      retryButton.buttonMode = true;
      
      retryButton.on("pointerdown",()=>{
            tryAgain();
      })
}



function updateFinalScore(){
      let num:scoreData= {val:0};
      gsap.to(num,2,{val:gameScore,
            onUpdate:()=>{
                  finalScoreText.text = "🍋"+ numberComma(Math.ceil(num.val));
            },onComplete:()=>{
                  retryButton.scale.set(1);
                  gsap.to(retryButton.scale,0.2,{x:1.1,y:1.1,repeat:3,yoyo:true});
            }
      });
}


function resetValue(){
      _spawnSpeed = 2;
      currentTime = maxTime;
      timerText.text = "🕒"+ currentTime;
      gameScore = 0;
      updateScore(gameScore);
}

function startTimer(){

      gsap.to(instructionboard,1,{
            repeat:maxTime,
            onRepeat:()=>{
                  currentTime -= 1;
                  timerText.text = "🕒" + currentTime;
                  if(currentTime<20){
                        _spawnSpeed = 0.5;
                  }else
                  if(currentTime<45){
                        _spawnSpeed = 1;
                  }
            },onComplete:()=>{
                  timesUpGameOver();
            }
      })
}

function timesUpGameOver(){
      SFX.stop("sfx-bgm-1"); 
      gameSceneBackground.visible = false;
      gameOverBackground.visible = true;
      updateFinalScore();
}

function onSlice(id:number){

      SFX.play("sfx-sword");

      //random slash
      generateRandom(2) == 1 ?   SFX.play("sfx-cut-1") : SFX.play("sfx-cut-2") ;
      
      splats[id].changeTexture(fruits[id]._currentTexture + "_s");
      splats[id].alpha = 0;
      splats[id].scale.set(0.25)
      splats[id].position.set(fruits[id].position.x,fruits[id].position.y-20);

      gsap.to( splats[id],0.5,{alpha:1,repeat:1,yoyo:true,repeatDelay:0.5,ease:Sine.easeOut});
      gsap.to( splats[id].scale,0.4,{x:1,y:1,ease:Sine.easeOut});

      let score:number = (fruits[id].fruitTextureId+1) * 5;
      console.log("id",id,score);
      updateScore(score);
}

function updateScore(score:number){
      gameScore += ( score);
      scoreTotalText.text = "🍋"+ numberComma(gameScore);
}


function gameStart(){
      SFX.play("sfx-bgm-1"); 
      startTimer();
      fruitLauncher();
}

function tryAgain(){
      gameOverBackground.visible = false;
      gameIntroBackground.visible = true;
      animateIntro();
}

function fruitLauncher(){
      if(currentTime <= 0){
            //end game;
      }else{
            throwFruit( fruits[fruitID] );
            gsap.delayedCall(_spawnSpeed,()=>{
                  
                  if(fruitID >= maxFruit){
                        fruitID = 0;
                  }
                  fruitLauncher();
            });
      }
};

function throwFruit(fruit:Fruits){

      let dir:number = generateRandom(2)-1;
      fruitID += 1;
      fruit.init();
      fruit.y = 900;
      fruit.x = -generateRandom(300) * dir;
      fruit.rotation = degToRad(0);

      gsap.to(fruit,_speed,{y:-generateRandom(400,100),repeat:1,yoyo:true})
      gsap.to(fruit,_speed*2,{x: fruit.x + (generateRandom(300,0)*dir),rotation: 2});//degToRad(180)})
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

/*window.addEventListener('resize', onResize);
function onResize(): void {
     console.log("size",{height:app.renderer.height,width:app.renderer.width});
     cw = window.innerWidth;
     ch = window.innerHeight
     app.renderer.resize(cw, ch);
     gameSceneBackground.position.set(cw *0.5, ch*0.5);
     //gameSceneBackground.scale.set(cw/500);
}*/

//export preloader assets
export const Assets = preload;