///<reference path="../globals.ts" />
///<reference path="../host/control.ts" />

/**
 * Created by jarettmiller on 10/19/15.
 */


module TSOS{


    export class MemManager{


        constructor(){}

     public loadInputProg(prog:string):void{

        var insertToMem;
         var memIndex=0;
        for(var i =0; i < prog.length; i++){

            insertToMem=prog.slice(i, i+2);

            _Memory.mem[memIndex] = insertToMem;
            _Kernel.krnTrace("Program: " + prog + "Inserted memory at: " + memIndex);
            i++;
            memIndex++;
        }
         _PCB = new PCB();
         _PCB.init();
         _StdOut.putText("Progam Loaded To memory, Pid = " + _PCB.PiD );
         _OsShell.pid++;
         Control.editMemoryTbl();

     }}}





