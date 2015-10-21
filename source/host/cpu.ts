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
            if (this.isExecuting == true) {
                var command;
                command = _Memory.mem[this.PC] ;
                switch (command) {
                    case "00":
                        this.Operation = "00"; // Break or sys call
                        //end running program
                        this.isExecuting = false;
                        _PCB.updatePCB();
                        break;
                    case "A9":
                        this.Operation = "A9";//load accumulator with a constant
                        this.PC++;
                        this.Acc = parseInt(_Memory.mem[this.PC],16);
                        this.PC++;
                        break;
                    case "AD":
                        this.Operation = "AD";//load the accuulator from memory

                        break;
                    case "8D":
                        this.Operation = "8D";//store the acc in memory

                        break;
                    case "6d":
                        this.Operation = "6D"; //Add with carry
                        break;
                    case "A2":
                        this.Operation = "A2"; //load X Register with constant
                        break;
                    case "AE":
                        this.Operation = "AE";//load X register from memory
                        this.PC++;
                        this.Xreg = parseInt(_Memory.mem[this.PC],16);
                        this.PC++;
                        break;
                    case "A0":
                        this.Operation = "A0"; //Load Y register with constant
                        this.PC++;
                        this.Yreg=parseInt(_Memory.mem[this.PC],16);
                        this.PC++;
                        break;
                    case "AC":
                        this.Operation = "AC"; //Load Y register from memory
                        break;
                    case "EA":
                        this.Operation = "EA"; //no operation
                        break;
                    case "EC":
                        this.Operation = "EC"; //Compare a byte in memory to the x Register (if equal, sets ZFlag)
                        break;
                    case"D0":
                        this.Operation = "D0"; // Branch n bytes if Z flag = 0
                        break;
                    case"EE":
                        this.Operation = "EE"; // Increment value of a byte
                        break;
                    case"FF":
                        this.Operation = "FF" //System call: print integer to X Register which is stored in the Y register OR print the 00 terminated string stored at the address to the Y Reg
                        break;
                }
                Control.initCPUTbl();
                Control.editMemoryTbl();
                //tets Program: A9 A2 A0 A9 A2 A0 A9 A2 A0 00
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