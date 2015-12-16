///<reference path="../globals.ts" />
///<reference path="../host/control.ts" />
///<reference path="../os/shell.ts"/>
/**
 * Created by jarettmiller on 10/19/15.
 */
var TSOS;
(function (TSOS) {
    var MemManager = (function () {
        function MemManager(memBlock, blockBases, blockLimits) {
            if (memBlock === void 0) { memBlock = 0; }
            if (blockBases === void 0) { blockBases = [0, 256, 512]; }
            if (blockLimits === void 0) { blockLimits = [256, 512, 768]; }
            this.memBlock = memBlock;
            this.blockBases = blockBases;
            this.blockLimits = blockLimits;
        }
        MemManager.prototype.loadInputProg = function (prog, priority) {
            var insertToMem;
            var memIndex = this.blockBases[this.memBlock];
            if (this.memBlock < 3 && prog.length / 2 <= 256) {
                for (var i = 0; i < prog.length; i++) {
                    insertToMem = prog.slice(i, i + 2);
                    _Memory.mem[memIndex] = insertToMem;
                    _Kernel.krnTrace("Program: " + prog + "Inserted memory at: " + memIndex);
                    i++;
                    memIndex++;
                }
                var base = this.blockBases[this.memBlock];
                var limit = this.blockLimits[this.memBlock];
                _PCB = new TSOS.PCB();
                _PCB.init(base, limit, 0, priority);
                _ResList[_ResList.length] = _PCB;
                _StdOut.putText("Progam Loaded To memory, Pid = " + _ResList[this.memBlock].PiD + ", Base: " + _ResList[this.memBlock].base + ", Limit: " + _ResList[this.memBlock].limit + ", Priority: " + _PCB.priority);
                _OsShell.pid++;
                //_TotalPCBs++;
                TSOS.Control.editMemoryTbl();
                this.memBlock++;
                for (var i = 0; i < _ResList.length; i++) {
                    _Kernel.krnTrace("Resident List: " + _ResList[i].PiD);
                }
            }
            else if (prog.length / 2 <= 256) {
                base = 0;
                limit = 0;
                _PCB = new TSOS.PCB();
                _PCB.init(base, limit, 1, priority);
                _ResList[_ResList.length] = _PCB;
                var file = _PCB.PiD;
                _krnFSDriver.createFile(file);
                _krnFSDriver.writeToFile(file, prog);
                _StdOut.putText("New PCB located in: Disk" /*+_PCB.locality*/);
                _StdOut.advanceLine();
                _StdOut.putText("pID: " + _PCB.PiD + ", Base: " + _PCB.base + ", Limit: " + _PCB.limit + ", Priority: " + _PCB.priority);
                _OsShell.pid++;
                _PCB = null;
            }
            else {
                _StdOut.putText("Program failed to load in to memory");
            }
        };
        MemManager.prototype.swap = function (pcb) {
            var thisProg = "";
            var b = pcb.base;
            var l = pcb.limit;
            for (var x = b; x < l; x++) {
                thisProg += _Memory.mem[x];
            }
            var newPCB = _ReadyQ.dequeue();
            newPCB.base = pcb.base;
            newPCB.limit = pcb.limit;
            newPCB.PC = newPCB.base + newPCB.PC;
            newPCB.locality = 0;
            newPCB.status = "Running";
            pcb.PC = pcb.PC - pcb.base;
            pcb.base = 0;
            pcb.limit = 0;
            pcb.locality = 1;
            pcb.status = "Waiting";
            var nextProg = _krnFSDriver.readFile(newPCB.PiD).substr(0, 509);
            var atMemory;
            var i = newPCB.base;
            for (var y = 0; y < nextProg.length; y++) {
                atMemory = nextProg.slice(y, y + 2);
                _Memory.mem[i];
                i++;
                y++;
            }
            _krnFSDriver.diskSwap(newPCB.PiD, thisProg, pcb.PiD);
            _ReadyQ.enqueue(pcb);
            _CPU.PC = newPCB.PC;
            _CPU.Acc = newPCB.Acc;
            _CPU.Xreg = newPCB.Xreg;
            _CPU.Yreg = newPCB.Yreg;
            _CPU.Zflag = newPCB.Zflag;
            _CPU.thisPCB = newPCB;
            //update tbls
            TSOS.Control.runPCBTbl();
            TSOS.Control.editHDDTbl();
        };
        MemManager.prototype.progSwap = function (oldpcb, prog) {
            var i = oldpcb.base;
            var atMemory;
            var toHD = "";
            for (var x = oldpcb.base; x < oldpcb.limit; x++) {
                toHD += _Memory.mem[i];
                i++;
            }
            i = oldpcb.base;
            for (var y = 0; y < prog.length; y++) {
                atMemory = prog.slice(y, y + 2);
                _Memory.mem[i] = atMemory;
                y++;
                i++;
            }
            _krnFSDriver.createFile(oldpcb.PiD);
            _krnFSDriver.writeToFile(oldpcb.PiD, toHD);
        };
        return MemManager;
    })();
    TSOS.MemManager = MemManager;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memManager.js.map