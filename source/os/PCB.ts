///<reference path="../globals.ts" />


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
                    public Zflag: number = 0
                    ) {

        }

        public init():void {
            this.PiD = _OsShell.pid;
            this.State="new";
            this.PC=0;
            this.Acc=0
            this.Xreg=0;
            this.Yreg=0;
            this.Zflag=0;
        }

//update function to visually display PCB info after program execution terminates
        public updatePCB():void{
            this.State="Complete";
            this.PC=_CPU.PC;
            this.Acc=_CPU.Acc;
            this.Xreg=_CPU.Xreg;
            this.Yreg=_CPU.Yreg;
            this.Zflag=_CPU.Zflag;
            Control.runPCBTbl();
        }


    }


}