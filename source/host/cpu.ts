///<reference path="../globals.ts" />

/* ------------
     CPU.ts

     Requires global.ts.

     Routines for the host CPU simulation, NOT for the OS itself.
     In this manner, it's A LITTLE BIT like a hypervisor,
     in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
     that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
     TypeScript/JavaScript in both the host and client environments.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */

module TSOS {

    export class Cpu {

        constructor(public PC: number = 0,
                    public Acc: number = 0,
                    public Operation: string = "",
                    public Xreg: number = 0,
                    public Yreg: number = 0,
                    public Zflag: number = 0,
                    public isExecuting: boolean = false) {

        }

        public init(): void {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        }

        public cycle(): void {
            _Kernel.krnTrace('CPU cycle');


            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            this.execCycle();
            Control.initCPUTbl();
        }

            public execCycle(){
                var command;
                var marker;
                command = _UserProgIn.value;
                switch (command){
                    case "A9":
                        this.Operation = "A9";//load accumulator with a constant
                        this.PC++;
                      //  this.Acc =_Memory.mem[this.PC], 16; //***
                        this.PC++;
                        break;
                    case "AD":
                        this.Operation = "AD";//load the accuulator from memory

                        break;
                    case "8D":
                        this.Operation = "8D";//store the acc in memory
                        break;
                    case "6d":
                        this.Operation = "6D"; //
                        break;
                    case "A2":
                        this.Operation = "A2"; //
                        break;
                    case "AE":
                        this.Operation = "AE";
                        break;
                    case "A0":
                        this.Operation = "A0";
                        break;
                    case "AC":
                        this.Operation = "AC";
                        break;
                    case "EA":
                        this.Operation = "EA";
                        break;
                    case "00":
                        this.Operation = "00";
                        break;
                    case "EC":
                        this.Operation = "EC";
                        break;
                    case"D0":
                        this.Operation = "D0";
                        break;
                    case"EE":
                        this.Operation = "EE";
                        break;
                    case"FF":
                        this.Operation = "FF"
                        break;



        }

        }

        public accConst(num:string):number{
            var c = parseInt(num,16);
            return c;
        }

    }
}
/*lab 3 Questions

1. Explain the difference between internal and external fragmentation.


2. Given five(5) memory partitions of 100KB, 500KB, 200KB, 300KB, and 600KB (in that order),how would
optimal, first-fit, best-fit, and worst-fit algorithms place processes of 212KB, 417KB, 112KB, and
426KB (in that order)?

first-fit: 212KB  -- 500KB partition
           112KB  -- 200KB partition
           417KB  -- 600KB Partition
           426KB  -- Cannot be allocated in this example

Best-fit:  212KB  -- 300KB Partition
           112KB  -- 200KB partition
           417KB  -- 500KB Partition
           426KB  -- 600KB Partition

Worst-fit: 212KB  -- 600KB partition
           112KB  -- 300KB partition
           417KB  -- 500KB Partition
           426KB  -- Cannot be allocated in this example

 lab 4 Questions

1. What is the relationship between a guest operating system and a host operating system
  in a system like VMware? What factors need to be considered in choosing the host operating system?




 */