/**
 * Created by jarettmiller on 12/13/15.
 */
///<reference path="../globals.ts" />
///<reference path="deviceDriver.ts" />

module TSOS{

export class FSDriver extends DeviceDriver{

        public trks=4;
        public sections=8;
        public blocks=8;
        public blkLength=64;
        public meta="";
        public freeSpace="";



    constructor() {

        super(this.krnHDDDriverEnt);
    }


    public krnHDDDriverEnt():void{
        this.status="loaded";
        this.init();

    }


    public init():void{
        for(var x=0; x<60; x++){
            this.freeSpace+="--";

        }
        this.meta="0000";

        for(var i=0;i<this.trks; i++){
            for(var j=0; j<this.sections; j++){
                for(var y=0; y<this.blocks;y++){



                var empty=this.meta.concat(this.freeSpace);
                sessionStorage.setItem(i.toString()+j.toString()+y.toString(),empty);

                }
            }
        }
    }

    public createFile(filename): boolean{
        return ;
    }


    public findMeta(t,s,b): String{
        return"";

    }

    public findEmptySpace(): String{
        return"";

    }


}




}