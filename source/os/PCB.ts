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
            this.PiD=0;
            this.State="";
            this.PC=0;
            this.Acc=0
            this.Xreg=0;
            this.Yreg=0;
            this.Zflag=0;
        }


    }


}