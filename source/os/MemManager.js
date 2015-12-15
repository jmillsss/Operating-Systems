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
            if (this.memBlock < 3) {
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
                _TotalPCBs++;
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
                _ResList.enqueue(_PCB);
                var file = _PCB.PiD;
                _krnFSDriver.createFile(file);
                _krnFSDriver.writeToFile(file, prog);
                _StdOut.putText("New PCB located in: " + _PCB.locality);
                _StdOut.advanceLine();
                _StdOut.putText("pID: " + _PCB.PiD + ", Base: " + _PCB.base + ", Limit: " + _PCB.limit + ", Priority: " + _PCB.priority);
                _OsShell.pid++;
                _PCB = null;
            }
            else {
                _StdOut.putText("Program failed to load in to memory");
            }
        };
        return MemManager;
    })();
    TSOS.MemManager = MemManager;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memManager.js.map