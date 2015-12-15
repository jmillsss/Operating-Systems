///<reference path="../globals.ts" />
///<reference path="../host/control.ts" />
/**
 * Created by jarettmiller on 10/19/15.
 */
var TSOS;
(function (TSOS) {
    var PCB = (function () {
        function PCB(PiD, State, PC, Acc, Xreg, Yreg, Zflag, base, limit, locality) {
            if (PiD === void 0) { PiD = 0; }
            if (State === void 0) { State = ""; }
            if (PC === void 0) { PC = 0; }
            if (Acc === void 0) { Acc = 0; }
            if (Xreg === void 0) { Xreg = 0; }
            if (Yreg === void 0) { Yreg = 0; }
            if (Zflag === void 0) { Zflag = 0; }
            if (base === void 0) { base = 0; }
            if (limit === void 0) { limit = 0; }
            if (locality === void 0) { locality = 0; }
            this.PiD = PiD;
            this.State = State;
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.base = base;
            this.limit = limit;
            this.locality = locality;
        }
        PCB.prototype.init = function (base, limit, locality) {
            this.PiD = _OsShell.pid;
            this.State = "new";
            this.PC = this.base;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.base = base;
            this.limit = limit;
            this.locality = locality;
        };
        return PCB;
    })();
    TSOS.PCB = PCB;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=pcb.js.map