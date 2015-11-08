/**
 * Created by jarettmiller on 11/7/15.
 */
///<reference path="../globals.ts" />
///<reference path="../host/control.ts" />



module TSOS {



    export class cpuSched{
        constructor(
            public quantum: number=6,
            public tab: number=0
        ){}


        public int(): void{

            var ready=_ReadyQ.dequeue();
            ready.State="Running";
            _CPU.thisPCB=ready;

        }

        public changeProcess(): void{

        if (_ReadyQ.getSize()>0){

            var enqueue = _CPU.thisPCB;
            enqueue.state="Enqueued";

            var dequeue = _ReadyQ.dequeue();
            dequeue.state="Running";
            _ReadyQ.enqueue(enqueue);

            _Kernel.krnTrace("Enqueued PID: " + enqueue.PiD + " Dequeued PID: " + dequeue.PiD);

            _CPU.PC = dequeue.PC;
            _CPU.Acc = dequeue.Acc;
            _CPU.Xreg = dequeue.Xreg;
            _CPU.Yreg = dequeue.Yreg;
            _CPU.Zflag = dequeue.Zflag;
            _CPU.isExecuting = true;
            _CPU.thisPCB = dequeue;
            Control.runPCBTbl();
        }
        this.tab=0;
    }

        public swapProcess(): void{
            var dequeue = _ReadyQ.dequeue();

            dequeue.state="Running";


            _CPU.PC = dequeue.PC;
            _CPU.Acc = dequeue.Acc;
            _CPU.Xreg = dequeue.Xreg;
            _CPU.Yreg = dequeue.Yreg;
            _CPU.Zflag = dequeue.Zflag;
            _CPU.isExecuting = true;
            _CPU.thisPCB = dequeue;
            this.tab=0;
            Control.runPCBTbl();
        }






    }
}


