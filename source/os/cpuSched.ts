/**
 * Created by jarettmiller on 11/7/15.
 */
///<reference path="../globals.ts" />
///<reference path="../host/control.ts" />



module TSOS {



    export class cpuSched{
        constructor(
            public quantum: number=6,
            public tab: number=0,
            public scheduler: string="rr"
        ){}


        public init(): void{

            var ready=_ReadyQ.dequeue();
            var exists=false;
            var x=0;
            var interm;
            var change;
            if(ready.locality==1){
                var prog=_krnFSDriver.readFile(ready.PiD);
                _krnFSDriver.deleteFile(ready.PiD);
                while(x<_ReadyQ.getSize()&&!exists){
                    interm=_ReadyQ.getObj(x);
                    if(interm.locality==0){
                        exists=true;
                    }
                }
                change=_ReadyQ.remove(interm.PiD);
                _MemoryManager.progSwap(change,prog);
                ready.base=change.base;
                ready.limit=change.limit;
                ready.locality=0;
                ready.PC=change.PC;
                change.base=0;
                change.limit=0;
                change.PC=0;
                change.locality=1;

                _ReadyQ.enqueue(change);
                if(this.scheduler=="Priority"){
                    _ReadyQ.sortQueue(0,_ReadyQ.getSize()-1);
                }

            }





            ready.State="Running";
            _CPU.thisPCB=ready;
            _CPU.PC=ready.base;


        }

        public changeProcess(): void {

            if (_ReadyQ.getSize() > 0) {
                if (_ReadyQ.getObj(0).locality == 1) {
                    _KernelInterruptQueue.enqueue(new Interrupt(SWAPPER_IRQ, 0));
                } else {

                var enqueue = _CPU.thisPCB;
                enqueue.state = "Waiting";

                var dequeue = _ReadyQ.dequeue();
                dequeue.state = "Running";

                _ReadyQ.enqueue(enqueue);

                _Kernel.krnTrace("Enqueued PID: " + enqueue.PiD + " Dequeued PID: " + dequeue.PiD);

                _CPU.PC = dequeue.PC;
                _CPU.Acc = dequeue.Acc;
                _CPU.Xreg = dequeue.Xreg;
                _CPU.Yreg = dequeue.Yreg;
                _CPU.Zflag = dequeue.Zflag;
                _CPU.thisPCB = dequeue;
                Control.runPCBTbl();
                Control.editHDDTbl();
                _CPU.isExecuting = true;


                    /*if (dequeue.locality == 1) {
                        dequeue.location = 0;
                        dequeue.base = enqueue.base;
                        dequeue.limit = enqueue.limit;
                        dequeue.PC = dequeue.base + dequeue.PC;

                        enqueue.PC = enqueue.PC - enqueue.base;
                        enqueue.base = 0;
                        enqueue.limit = 0;
                        enqueue.location = 1;

                        _krnFSDriver.fsSwitch(dequeue, enqueue);
                    }*/
            }
        }
        this.tab=0;
    }

        public swapProcess(): void{
            _krnFSDriver.delete(_CPU.thisPCB.PiD);
            var dequeue = _ReadyQ.dequeue();
            if(dequeue.locality==1){
                dequeue.base=0;
                dequeue.limit=255;
                var prog=_krnFSDriver.readFile(dequeue.PiD).substr(0,509);
                var i=dequeue.base;
                var atMemory;
                _krnFSDriver.delete(dequeue.PiD);
                for(var y=0;y<prog.length;y++){
                    atMemory=prog.slice(y,y+2);
                    _Memory.mem[i]=atMemory;
                    i++;
                    y++;
                }
            }

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


