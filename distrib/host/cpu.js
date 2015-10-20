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
var TSOS;
(function (TSOS) {
    var Cpu = (function () {
        function Cpu(PC, Acc, Operation, Xreg, Yreg, Zflag, isExecuting) {
            if (PC === void 0) { PC = 0; }
            if (Acc === void 0) { Acc = 0; }
            if (Operation === void 0) { Operation = "op"; }
            if (Xreg === void 0) { Xreg = 0; }
            if (Yreg === void 0) { Yreg = 0; }
            if (Zflag === void 0) { Zflag = 0; }
            if (isExecuting === void 0) { isExecuting = false; }
            this.PC = PC;
            this.Acc = Acc;
            this.Operation = Operation;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.isExecuting = isExecuting;
        }
        Cpu.prototype.init = function () {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        };
        Cpu.prototype.cycle = function () {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            var command;
            var marker;
            while (this.isExecuting) {
                command = _Memory.mem[this.PC];
                switch (command) {
                    case "A9":
                        this.Operation = "A9";
                        this.PC++;
                        this.Acc = _Memory.mem[this.PC], 16;
                        this.PC++;
                        break;
                    case "AD":
                        break;
                    case "8D":
                        break;
                    case "6d":
                        break;
                    case "A2":
                        break;
                    case "AE":
                        break;
                    case "A0":
                        break;
                    case "AC":
                        break;
                    case "EA":
                        break;
                    case "00":
                        break;
                    case "EC":
                        break;
                    case "D0":
                        break;
                    case "EE":
                        break;
                    case "FF":
                        break;
                }
            }
        };
        Cpu.prototype.accConst = function (num) {
            var c = parseInt(num, 16);
            return c;
        };
        return Cpu;
    })();
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
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
