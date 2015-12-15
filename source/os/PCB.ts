///<reference path="../globals.ts" />
///<reference path="../host/control.ts" />


/**
 * Created by jarettmiller on 10/19/15.
 */

module TSOS{

    export class PCB{

        constructor(public PiD: number = 0,
                    public State: string = "",
                    public PC: number = 0,
                    public Acc: number = 0,
                    public Xreg: number = 0,
                    public Yreg: number = 0,
                    public Zflag: number = 0,
                    public base: number=0,
                    public limit: number=0,
                    public locality: number=0,
                    public priority: number=0
                    ) {

        }

        public init(base,limit,locality,priority):void {
            this.PiD = _OsShell.pid;
            this.State="new";
            this.PC=this.base;
            this.Acc=0;
            this.Xreg=0;
            this.Yreg=0;
            this.Zflag=0;
            this.base=base;
            this.limit=limit;
            this.locality=locality;
            this.priority=priority;

        }

//update function to visually display PCB info after program execution terminates
       /* public updatePCB():void{
            _CPU.thisPCB.State="Queued";
            _CPU.thisPCB.PC=_CPU.PC;
            _CPU.thisPCB.Acc=_CPU.Acc;
            _CPU.thisPCB.Xreg=_CPU.Xreg;
            _CPU.thisPCB.Yreg=_CPU.Yreg;
            _CPU.thisPCB.Zflag=_CPU.Zflag;
            _Scheduler.changeProcess();
        }*/


    }


}