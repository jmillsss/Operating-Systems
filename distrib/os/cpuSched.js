/**
 * Created by jarettmiller on 11/7/15.
 */
///<reference path="../globals.ts" />
///<reference path="../host/control.ts" />
var TSOS;
(function (TSOS) {
    var cpuSched = (function () {
        function cpuSched(quantum, tab, scheduler) {
            if (quantum === void 0) { quantum = 6; }
            if (tab === void 0) { tab = 0; }
            if (scheduler === void 0) { scheduler = "rr"; }
            this.quantum = quantum;
            this.tab = tab;
            this.scheduler = scheduler;
        }
        cpuSched.prototype.init = function () {
            var ready = _ReadyQ.dequeue();
            ready.State = "Running";
            _CPU.thisPCB = ready;
            _CPU.PC = ready.base;
        };
        cpuSched.prototype.changeProcess = function () {
            if (_ReadyQ.getSize() > 0) {
                var enqueue = _CPU.thisPCB;
                enqueue.state = "Waiting";
                var dequeue = _ReadyQ.dequeue();
                dequeue.state = "Running";
                if (dequeue.locality == 1) {
                    dequeue.location = 0;
                    dequeue.base = enqueue.base;
                    dequeue.limit = enqueue.limit;
                    dequeue.PC = dequeue.base + dequeue.PC;
                    enqueue.PC = enqueue.PC - enqueue.base;
                    enqueue.base = 0;
                    enqueue.limit = 0;
                    enqueue.location = 1;
                    _krnFSDriver.fsSwitch(dequeue, enqueue);
                }
                _ReadyQ.enqueue(enqueue);
                _Kernel.krnTrace("Enqueued PID: " + enqueue.PiD + " Dequeued PID: " + dequeue.PiD);
                _CPU.PC = dequeue.PC;
                _CPU.Acc = dequeue.Acc;
                _CPU.Xreg = dequeue.Xreg;
                _CPU.Yreg = dequeue.Yreg;
                _CPU.Zflag = dequeue.Zflag;
                _CPU.isExecuting = true;
                _CPU.thisPCB = dequeue;
                TSOS.Control.runPCBTbl();
                TSOS.Control.editHDDTbl();
            }
            this.tab = 0;
        };
        cpuSched.prototype.swapProcess = function () {
            var dequeue = _ReadyQ.dequeue();
            dequeue.state = "Running";
            _CPU.PC = dequeue.PC;
            _CPU.Acc = dequeue.Acc;
            _CPU.Xreg = dequeue.Xreg;
            _CPU.Yreg = dequeue.Yreg;
            _CPU.Zflag = dequeue.Zflag;
            _CPU.isExecuting = true;
            _CPU.thisPCB = dequeue;
            this.tab = 0;
            TSOS.Control.runPCBTbl();
        };
        return cpuSched;
    })();
    TSOS.cpuSched = cpuSched;
})(TSOS || (TSOS = {}));
