import * as PIXI from 'pixi.js';
import {Howler,Howl} from 'howler'

//AUTHOR: RICKY GUEVARRA

//My custom class for Howler Js
//I made this to control sound easier


enum STATUS {
    "NORMAL",
    "MUTED"
}

interface IDictionary {
    [index: string]: number;
}

export default class SoundFX {

    BGM_VOLUME:number;
    SFX_VOLUME:number;
    SOUND_STATUS:STATUS;
    howls_id = {} as IDictionary;
    howls:Howl[] = [];
    
    constructor() {

        //console.log("BGM_VOLUME",this.BGM_VOLUME);

        this.BGM_VOLUME = 0.05;

        this.SFX_VOLUME = 1;

        this.SOUND_STATUS = STATUS.NORMAL;

        this.initSounds();
    }

    //init sounds should be customized and load data from JSON file
    //still work in progress for this class;

    initSounds() {

        let dir:string = "assets/snd/";
        let ext:string = ".m4a"
        
        let sound_list:[string,boolean,number][] = [

            //title/loop/volume
            ["sfx-bgm-1", true, this.BGM_VOLUME],
            ["sfx-cut-1", false, this.SFX_VOLUME],
            ["sfx-cut-2", false, this.SFX_VOLUME],
            ["sfx-sword", false, this.SFX_VOLUME],
            ["sfx-intro-japan", false, this.SFX_VOLUME],
      
        ];

        let i:number = 0;
        let len:number = sound_list.length;

        for (i = 0; i < len; i++) {
            this.howls_id[ sound_list[i][0] ] = i;
            this.howls[i] = new Howl({
                src: [dir + sound_list[i][0] + ext],
                loop: sound_list[i][1],
                volume: sound_list[i][2]
            }) 
        }

    }

    play(snd_id:string) {
        this.howls[this.howls_id[snd_id]].play();
    }

    stopAll(){
        let i:number=0;
        for(i=0; i < this.howls.length; i++){
            this.howls[i].stop();
        }
    }

    stop(snd_id:string) {
        this.howls[this.howls_id[snd_id]].stop();
    }

    mute() {
        Howler.volume(0);
    }

    toggleAudio(_id:boolean, _idle:boolean) {
        if (_id == false) {
            Howler.mute(true);
            if (_idle == false) {
                this.SOUND_STATUS = STATUS.MUTED;
            }
        } else
        if (_id == true) {
            Howler.mute(false)
            if (_idle == false) {
                this.SOUND_STATUS = STATUS.NORMAL;
            }
        }
    }


    fadeOutPlay(snd_id:string, _delay:number, _duration:number) {

        let self = this;

        this.play(snd_id);

        this.howls[this.howls_id[snd_id]].volume(1);

        let obj = {
            volume: 1
        };

        gsap.to(obj, _duration, {
            volume: 0,
            delay: _delay,
            onUpdate: function() {
                this.howls[this.howls_id[snd_id]].volume(obj.volume);
            },
            onComplete: function() {
                self.stop(snd_id);
                this.howls[this.howls_id[snd_id]].volume(1);
            }
        });
    }


}