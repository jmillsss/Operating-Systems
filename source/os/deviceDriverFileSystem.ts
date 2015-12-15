/**
 * Created by jarettmiller on 12/13/15.
 */
///<reference path="../globals.ts" />
///<reference path="../utils.ts" />
///<reference path="deviceDriver.ts" />
///<reference path="../host/control.ts" />


module TSOS{

export class FSDriver extends DeviceDriver{

    constructor() {

        super(this.krnHDDriverEnt, this.fileToDisk);

    }


    public krnHDDriverEnt():void{

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
    private occupyBlock(fileData): string{
        var occupy="";
        for(var x=0; x<(124-fileData.length); x++){
            occupy+="0";
        }
        return fileData.concat(occupy);
    }
    private occupyData(data): string{
        _Kernel.krnTrace("File Data Length: " + data.length);
        var occupy="";
        for (var x=0; x<(120-data.length); x++){
            occupy+="0"
        }
        return data.concat(occupy);
    }
    public createFile(filename): boolean{
        filename=Utils.hexFromString(filename);
        _Kernel.krnTrace("New File Name: " + filename);
        for(var x=0; x<this.sections;x++){
            for(var y=0; y<this.blocks; y++){
                var m = this.selectMeta(0,x,y);
                if(m.charAt(0)=="0"){
                    var i = this.findEmptySpace();
                    if(i!="unavailable"){
                        var file="1"+i.concat(filename);
                        file=this.occupyBlock(file);
                        sessionStorage.setItem("0"+x+""+y, file);
                    }

                    Control.editHDDTbl();
                    return true;
                }
            }
        }
        return false;
    }

    public readFile(file): String{
        file=this.occupyData(Utils.hexFromString(file));
        var interm;
        var mbr;
        var readFile="";
        var nextFile;
        for(var x=0; x<this.sections;x++){
            for (var y=0; y<this.blocks;y++){
                interm =this.selectData(0,x,y);
                if (interm==file){
                    mbr=this.selectMBR(0,x,y);
                    do{
                        readFile+=sessionStorage.getItem(mbr).substr(4);
                        nextFile=sessionStorage.getItem(mbr).substr(1,3);
                        mbr=nextFile;
                    }while(mbr!="000");


                    readFile=Utils.stringFromeHex(readFile);
                    _Kernel.krnTrace("Reading File: "+ readFile);
                    return readFile;
                    }
                }
            }
        }





    public selectMeta(t,s,b): String{
        var m=sessionStorage.getItem(t+""+s+""+b).substr(0,4);
        return m;
    }
    public selectData(t,s,b): String{
        var fileData=sessionStorage.getItem(t+""+s+""+b).substr(4);
        return fileData;
    }
    public selectMBR(t,s,b):String{
        var mbr=sessionStorage.getItem(t+""+s+""+b).substr(1,3);
        return mbr;
    }

    public findEmptySpace(): String{
        var mbr="000";
        for(var x=1; x<this.trks;x++){
            for (var y=0; y<this.sections;y++){
                for(var z=0; z<this.blocks;z++){
                    var m = this.selectMeta(x,y,z);
                    if(m.charAt(0)=="0"){
                        sessionStorage.setItem(x+""+y+""+z, "1"+mbr.concat(this.freeSpace));
                        return x+""+y+""+z;
                    }
                }
            }
        }

        return"unavailable";

    }

    public fileToDisk(params){
        var x = params[0];
        var y = params[1];
        var z =params[2];
        var fileData=params[3];
        switch(x) {
            case 0:
            _Kernel.krnTrace("FILE: "+ y + "IS BEING CREATED");
            if(_krnFSDriver.createFile(y)){
                _StdOut.putText("File:  " + y + " successfully created");
                _StdOut.advanceLine();

            }else{
                _StdOut.putText("Error Creating File: " + y);
                _StdOut.advanceLine();
            }
            break;
            case 1:
                _Kernel.krnTrace("READING FILE WITH NAME: " + y);
                var fileRead=_krnFSDriver.readFile(y);
                _StdOut.putText("File: "+ y);
                _StdOut.advanceLine();
                _StdOut.putText("Data: "+ fileRead);
            break;
            case 2:
                this.diskSwap(z,fileData,y);
                break;


        }
    }

    public writeToFile(file,writeData): boolean{
       // writeData=Utils.hexFromString(writeData);
        file=this.occupyData(Utils.hexFromString(file));
        var totalBlocks=Math.ceil(writeData.length/120);

        var interm;
        var mbr;
        var next=0;
        var write="";
        var followingBlock;
        var lim=0;
        for(var x=0; x<this.sections;x++) {
            for (var y = 0; y < this.blocks; y++) {
                interm = this.selectData(0, x, y);
                if (interm == file) {
                    mbr = this.selectMBR(0, x, y);
                    for (var z = 0; z < totalBlocks; z++) {
                        followingBlock = "000";
                        if (z != totalBlocks - 1) {
                            followingBlock = this.findEmptySpace();
                        }
                        while (next < writeData.length && lim < 120) {
                            write += writeData.charAt(next);
                            next++;
                            lim++
                        }
                        if(write.length<120-1){
                            write+=this.occupyData(write);
                        }
                        var newData = "1" + followingBlock.concat(write);
                        sessionStorage.setItem(mbr, newData);
                        write = "";
                        lim = 0;
                        mbr = followingBlock;
                    }
                    Control.editHDDTbl();
                    return true;
                }
            }
        }
        return false;
    }




    public deleteFile(file): boolean{
        file=this.occupyData(Utils.hexFromString(file));
        var interm;
        var mbr;
        var followingBlock;

        for(var x=0; x<this.sections; x++){
            for(var y=0;y<this.blocks; y++){
                interm=this.selectData(0,x,y);
                if (interm==file){
                    mbr=this.selectMBR(0,x,y);
                    sessionStorage.setItem("0"+x+""+y, "0000"+this.freeSpace);
                    do{
                        followingBlock=sessionStorage.getItem(mbr).substr(1,3);
                        //
                        sessionStorage.setItem(mbr, "0000"+this.freeSpace);
                        mbr = followingBlock;
                    }while(mbr!="000");
                    Control.editHDDTbl();
                    return true;
                }
            }
        }
        return false;
    }


    public listFiles():void{
        var file;
        for(var x=0; x<this.sections;x++){
            for(var y=0;y<this.blocks; y++){
                file=this.selectData(0,x,y);

                if(file!=this.freeSpace){
                    file=Utils.stringFromeHex(file);
                    _Kernel.krnTrace("File name: " + file);
                    _StdOut.putText(" "+file);
                    _StdOut.advanceLine();
                }
            }
        }
        _StdOut.advanceLine();
    }

    public diskSwitch(file,fileData,pcb):void{
        _Kernel.krnTrace(fileData.length);
        var totalBlocks=Math.ceil(fileData.length/60);
        var interm;
        var mbr;
        var next=0;
        var write="";
        var followingBlock;
        var lim=0;
        var fName;
        for(var x=0; x<this.sections;x++){
            for(var y=0;y<this.blocks;y++){
                interm=this.selectData(0,x,y);
                if(interm==file){
                    mbr=this.selectMBR(0,x,y);
                    fName="1"+mbr.concat(pcb.PiD);
                    sessionStorage.setItem("0"+x+""+y, fName)

                    for(var z=0;z<totalBlocks;z++){
                        followingBlock="000";
                        if(z!=totalBlocks-1){
                            followingBlock=this.selectMBR(parseInt(mbr.charAt(0)),parseInt(mbr.charAt(1)),parseInt(mbr.charAt(2)));
                            if(followingBlock=="000"){
                                followingBlock=this.findEmptySpace();
                            }
                        }
                        while(next<fileData.length && lim<60){
                            write+=fileData.charAt(next);
                            next++;
                            lim++;
                        }
                        sessionStorage.setItem(mbr,"1"+followingBlock.concat(write));
                        write="";
                        lim=0;
                        mbr=followingBlock;
                    }
                    Control.editHDDTbl();
                    return;
                }
            }
        }
    }


    public diskRun(fsprog):void{

        if(_ResList.getSize()>0){
            var swapPCB=_ResList.getObj(0);
            _Kernel.krnTrace("Replace Pid: "+ swapPCB.PiD);
            this.fsSwitch(fsprog, swapPCB);
            fsprog.base=swapPCB.base;
            fsprog.limit=swapPCB.limit;
            fsprog.locality=0;
            swapPCB.locality=1;
            _Kernel.krnTrace("Replaced Pid location: " + swapPCB.locality);

        }else{
            fsprog.base=0;
            fsprog.limit=255;
            fsprog.locality=0;
            this.getPCB(fsprog);
        }
    }
    public fsSwitch(fsprog, memprog):void{
        _Kernel.krnTrace("Pid in: "+fsprog.PiD+" Pid Out: "+memprog.PiD);

        var base=memprog.base;
        var limit=memprog.limit;
        var take="";
        var place = _krnFSDriver.readFile(fsprog.PiD);
        var atMem;
        var i=memprog.base;

        for(var x=base; x<limit;x++){
            take+=_Memory.mem[x];
        }

        _Kernel.krnTrace("Switch Into: " + place);
        _Kernel.krnTrace("Switch Out: "+ take);
        _krnFSDriver.diskSwitch(fsprog.PiD, take,memprog);
        for(var y=0;y<place.length; y++){
            atMem=place.slice(y, y+2);
            _Memory.mem[i]=atMem;
            y++;
            i++;
        }

    }

    public getPCB(pcb): void{
        var fsprog=_krnFSDriver.readFile(pcb.PiD);
        var i = pcb.base;
        var atMemory;
        _krnFSDriver.deleteFile(pcb.pid);
        for (var x=0; x<fsprog.length; i++){

            atMemory=fsprog.slice(x, x+2);
            _Memory.mem[i]=atMemory;
            x++;
            i++;
        }

    }

    public diskSwap(oldFile,fileData,newFile):void{
        this.deleteFile(oldFile);
        this.createFile(newFile);
        this.writeToFile(newFile,fileData);

        Control.editHDDTbl();
        return;
    }


}




}