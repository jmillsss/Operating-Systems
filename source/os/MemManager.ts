///<reference path="../globals.ts" />
///<reference path="../host/control.ts" />
///<reference path="../os/shell.ts"/>

/**
 * Created by jarettmiller on 10/19/15.
 */


module TSOS{


    export class MemManager{


        constructor(public memBlock: number=0,
                    public blockBases=[0,256,512],
                    public blockLimits=[256,512,768]){}

     public loadInputProg(prog:string):void{

        var insertToMem;
         var memIndex=this.blockBases[this.memBlock];

         if (this.memBlock<3){


             for (var i = 0; i < prog.length; i++) {

                 insertToMem = prog.slice(i, i + 2);

                 _Memory.mem[memIndex] = insertToMem;
                 _Kernel.krnTrace("Program: " + prog + "Inserted memory at: " + memIndex);
                 i++;
                 memIndex++;
             }
             var base=this.blockBases[this.memBlock];
             var limit=this.blockLimits[this.memBlock];

             _PCB = new PCB();
             _PCB.init(base,limit);
             _ResList[_ResList.length]=_PCB;
             _StdOut.putText("Progam Loaded To memory, Pid = " +  _ResList[this.memBlock].pid + "Base: " + _ResList[this.memBlock].base + " Limit: " + _ResList[this.memBlock].limit);
             _OsShell.pid++;
             _TotalPCBs++;
             Control.editMemoryTbl();
             this.memBlock++;
             for(var i=0; i<_ResList.length; i++){
                 _Kernel.krnTrace("Resident List: " + _ResList[i].pid)
             }

        }else{
             _StdOut.putText("Program failed to load in to memory");}
     }}}





