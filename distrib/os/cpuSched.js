/**
 * Created by jarettmiller on 11/7/15.
 */
///<reference path="../globals.ts" />
var TSOS;
(function (TSOS) {
    var cpuSched = (function () {
        function cpuSched(quantum, tab) {
            if (quantum === void 0) { quantum = 6; }
            if (tab === void 0) { tab = 0; }
            this.quantum = quantum;
            this.tab = tab;
        }
        return cpuSched;
    })();
    TSOS.cpuSched = cpuSched;
})(TSOS || (TSOS = {}));
