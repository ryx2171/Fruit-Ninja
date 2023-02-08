import * as PIXI from 'pixi.js'
import {Assets} from '../index'

//-------------------------------------------------------------
export class PixiAtlas extends PIXI.AnimatedSprite{

	public atlas:any

	constructor(sheet:string,_id:string = ""){

			let atlas:any

			if(_id==undefined){
				atlas = Assets.loadSpritesheet(sheet)?.animations[sheet];
			}else{
				atlas = Assets.loadSpritesheet(sheet)?.animations["img"];
			}

			super(atlas);

			this.anchor.set(0.5);	
			this.animationSpeed = 1;
			this.loop = false;
			this.atlas = atlas;
			this.init(_id);
	}

	init(_id:string){
			if(_id != ""){
				this.changeTexture(_id)
			}
	}

	public changeTexture(_id:string){

		this.atlas.forEach( (base:PIXI.BaseRenderTexture,atlas_id:number)=>
			{
				let str:string = _id + "0000"; 
				let arr:string[] = [str];
				let obj_txtr:string[] = base.textureCacheIds;
				if( JSON.stringify(obj_txtr) === JSON.stringify(arr) ){
					this.gotoAndStop(atlas_id);
					return;
				}
			}
		)
	}
}
