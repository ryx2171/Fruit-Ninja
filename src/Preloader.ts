import * as PIXI from 'pixi.js';


export default class Preload {

    public pixiapp:PIXI.Application;
    public callBack:Function;

    public constructor(app:PIXI.Application,callBackF:Function){
        this.callBack = callBackF;
        this.pixiapp = app;
        this.init();
    }

    private init(){
        
        this.pixiapp.loader.baseUrl = 'assets/img';

        this.pixiapp.loader
        .add('game_bg.jpg' ,        'game_bg.jpg')
        .add('fruits' ,             'fruits.json')

        ;//end of preload
        //this.pixiapp.loader.onProgress.add(this.showProgress,this.pixiapp);
        //this.pixiapp.loader.onError.add(this.onError,this.pixiapp);
        this.pixiapp.loader.onComplete.add(this.loadComplete,this);
        this.pixiapp.loader.load();
    }


    public loadImage(image:string){
        return this.pixiapp.loader.resources[image].texture; 
    }

    public loadSpritesheet(atlas:string){
        return this.pixiapp.loader.resources[atlas].spritesheet; 
     
    }

    private onError(e:Event){
        //console.log('error',e);
    }

    private showProgress(e:Event){
        //console.log('progress: ' , e.progress);
        //this.preloadbar.scale.set(e.progress*0.01,1);
        //this.preloadText.text = parseInt(e.progress) + '%';
    }

    private loadComplete(){

        this.callBack();
        console.log("complete");

        /*this.bg.on('pointerdown',this.onStartScene,this);
        this.bg.interactive = true;
        this.bg.buttonMode = true;
        this.touchtext.visible = true;

        this.preloadbarbg.visible = false;
        this.preloadbar.visible = false;
        this.preloadText.visible = false;*/
        
    }
}

