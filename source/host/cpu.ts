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
            //call execute CPU cycle
            if (this.isExecuting) {
                this.execCpuCycle();
                //update tables while program is executing
                Control.initCPUTbl();
                Control.editMemoryTbl();

            }
        }

            public execCpuCycle():void{
            //switch case for each opcode

                var command;

                command = _Memory.mem[this.PC] ;
                switch (command) {
                    case "00":
                        case "0":
                        this.Operation = "00"; // Break or sys call
                        //end running program
                            _Kernel.krnTrace("Program Pid: " + _PCB.PiD + " has terminated");
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
                        this.Operation = "AD";//load the accumulator from memory
                        var i = this.atMemory();
                        this.Acc=parseInt(_Memory.mem[i], 16);
                        this.PC++;
                        break;
                    case "8D":
                        this.Operation = "8D";//store the acc in memory   //test prog: A9 03 8D 41 00 A9 01 8D 40 00 AC 40 00 A2 01 FF EE 40 00 AE 40 00 EC 41 00 D0 EF A9 44 8D 42 00 A9 4F 8D 43 00 A9 4E 8D 44 00 A9 45 8D 45 00 A9 00 8D 46 00 A2 02 A0 42 FF 00
                        var i = this.atMemory();
                        _Memory.mem[i]=this.Acc.toString(16);
                        this.PC++;
                        break;
                    case "6D":
                        this.Operation = "6D"; //Add with carry
                        var i = this.atMemory();
                        var x = parseInt(_Memory.mem[i], 16);
                        var y = this.Acc;
                        var acc = x + y;
                        this.Acc=acc;
                        this.PC++;
                        break;
                    case "A2":
                        this.Operation = "A2"; //load X Register with constant
                        this.PC++;
                        this.Xreg=parseInt(_Memory.mem[this.PC],16);
                        this.PC++;
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
                        var i = _Memory.atMemory();
                        this.Yreg=parseInt(_Memory.mem[i], 16);
                        this.PC++;
                        break;
                    case "EA":
                        this.Operation = "EA"; //no operation
                        this.PC++;
                        break;
                    case "EC":
                        this.Operation = "EC"; //Compare a byte in memory to the x Register (if equal, sets ZFlag)
                        var i = _Memory.atMemory();
                        var j = parseInt(_Memory.mem[i], 16);
                        var xReg = this.Xreg;
                        if(j==xReg){
                            this.Zflag=1;
                        }else{
                            this.Zflag=0;
                        }
                        this.PC++;
                        break;
                    case"D0":
                        this.Operation = "D0"; // Branch n bytes if Z flag = 0
                        break;
                    case"EE":
                        this.Operation = "EE"; // Increment value of a byte
                        break;
                    case"FF":
                        this.Operation = "FF"; //System call: print integer to X Register which is stored in the Y register OR print the 00 terminated string stored at the address to the Y Reg
                        break;
                    default:
                        this.isExecuting=false;
                        _StdOut.putText("Invalid operation:" + _Memory.mem[this.PC] );
                    }
            }



        public atMemory():number{
            var memSlot;
            this.PC++;
            var m1 = _Memory.mem[this.PC];
            this.PC++;
            var m2 = _Memory.mem[this.PC];
            var memAdd= m2.concat(m1);
            memSlot=parseInt(memAdd,16);
            return memSlot;
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