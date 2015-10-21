///<reference path="../globals.ts" />
/**
 * Created by jarettmiller on 10/19/15.
 */
var TSOS;
(function (TSOS) {
    var PCB = (function () {
        function PCB(PiD, State, PC, Acc, Xreg, Yreg, Zflag) {
            if (PiD === void 0) { PiD = 0; }
            if (State === void 0) { State = ""; }
            if (PC === void 0) { PC = 0; }
            if (Acc === void 0) { Acc = 0; }
            if (Xreg === void 0) { Xreg = 0; }
            if (Yreg === void 0) { Yreg = 0; }
            if (Zflag === void 0) { Zflag = 0; }
            this.PiD = PiD;
            this.State = State;
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
        }
        PCB.prototype.init = function () {
            this.PiD = _OsShell.pid;
            this.State = "new";
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
        };
        return PCB;
    })();
    TSOS.PCB = PCB;
})(TSOS || (TSOS = {}));
