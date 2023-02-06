
export function generateRandom(_range:number,startAt:number=0):number{
    let rdm:number = Math.floor(Math.random()*_range);
    rdm += startAt;
    return rdm;
}

export function setFullscreen(_id:boolean){

      const docElmWithBrowsersFullScreenFunctions = document.documentElement as HTMLElement & {
        webkitRequestFullscreen(): Promise<void>;
      };

      const docWithBrowsersExitFunctions = document as Document & {
        webkitExitFullscreen(): Promise<void>;
      };
      
        if(_id == true){
            try {
                docElmWithBrowsersFullScreenFunctions.webkitRequestFullscreen();
              }
              catch(err) {
                //alert("error");
            }
        }else{
            try {
                docWithBrowsersExitFunctions.webkitExitFullscreen();
              }
              catch(err) {
                //alert("error");
            }
        }
}


export function degToRad(deg:number):number {
  return deg * (Math.PI / 180.0);
}
