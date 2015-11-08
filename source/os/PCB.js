///<reference path="../globals.ts" />
///<reference path="../host/control.ts" />
/**
 * Created by jarettmiller on 10/19/15.
 */
var TSOS;
(function (TSOS) {
    var PCB = (function () {
        function PCB(PiD, State, PC, Acc, Xreg, Yreg, Zflag, base, limit) {
            if (PiD === void 0) { PiD = 0; }
            if (State === void 0) { State = ""; }
            if (PC === void 0) { PC = 0; }
            if (Acc === void 0) { Acc = 0; }
            if (Xreg === void 0) { Xreg = 0; }
            if (Yreg === void 0) { Yreg = 0; }
            if (Zflag === void 0) { Zflag = 0; }
            if (base === void 0) { base = 0; }
            if (limit === void 0) { limit = 0; }
            this.PiD = PiD;
            this.State = State;
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.base = base;
            this.limit = limit;
        }
        PCB.prototype.init = function (base, limit) {
            this.PiD = _OsShell.pid;
            this.State = "new";
            this.PC = this.base;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.base = base;
            this.limit = limit;
        };
        //update function to visually display PCB info after program execution terminates
        PCB.prototype.updatePCB = function () {
            _CPU.thisPCB.State = "Queued";
            _CPU.thisPCB.PC = _CPU.PC;
            _CPU.thisPCB.Acc = _CPU.Acc;
            _CPU.thisPCB.Xreg = _CPU.Xreg;
            _CPU.thisPCB.Yreg = _CPU.Yreg;
            _CPU.thisPCB.Zflag = _CPU.Zflag;
            TSOS.Control.runPCBTbl();
        };
        return PCB;
    })();
    TSOS.PCB = PCB;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=pcb.js.map