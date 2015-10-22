///<reference path="../globals.ts" />
///<reference path="../os/canvastext.ts" />
///<reference path="../os/memManager.ts"/>
///<referece path="../host/memory.ts"/>
///<reference path="../os/pcb.ts"/>
/* ------------
     Control.ts

     Requires globals.ts.

     Routines for the hardware simulation, NOT for our client OS itself.
     These are static because we are never going to instantiate them, because they represent the hardware.
     In this manner, it's A LITTLE BIT like a hypervisor, in that the Document environment inside a browser
     is the "bare metal" (so to speak) for which we write code that hosts our client OS.
     But that analogy only goes so far, and the lines are blurred, because we are using TypeScript/JavaScript
     in both the host and client environments.

     This (and other host/simulation scripts) is the only place that we should see "web" code, such as
     DOM manipulation and event handling, and so on.  (Index.html is -- obviously -- the only place for markup.)

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */

//
// Control Services
//
module TSOS {

    export class Control {

        public static hostInit(): void {
            // This is called from index.html's onLoad event via the onDocumentLoad function pointer.

            // Get a global reference to the canvas.  TODO: Should we move this stuff into a Display Device Driver?
            _Canvas = <HTMLCanvasElement>document.getElementById('display');



            _StatusBar = document.getElementById('taskBarDisplay');
            var theDate = new Date();
            var month = theDate.getUTCMonth() + 1;
            var date = month + "/" + theDate.getUTCDate() + "/" + theDate.getUTCFullYear() + " " + theDate.getHours() + ":" + theDate.getMinutes() + ":" + theDate.getSeconds();
            _StatusBar.value = "Current Date & Time: " + date;

            //get html tables
            _UserProgIn= <HTMLTextAreaElement>document.getElementById('taProgramInput');
            _MemoryTbl = <HTMLTableElement>document.getElementById('memoryTable');
            _CPUTbl = <HTMLTableElement>document.getElementById('cpuTbl');
            _PCBTbl= <HTMLTableElement>document.getElementById('pcbTbl');
            //call initialize for mem table

            this.initMemoryTbl();
            // Get a global reference to the drawing context.
            _DrawingContext = _Canvas.getContext("2d");

            // Enable the added-in canvas text functions (see canvastext.ts for provenance and details).
            CanvasTextFunctions.enable(_DrawingContext);   // Text functionality is now built in to the HTML5 canvas. But this is old-school, and fun, so we'll keep it.

            // Clear the log text box.
            // Use the TypeScript cast to HTMLInputElement
            (<HTMLInputElement> document.getElementById("taHostLog")).value="";

            // Set focus on the start button.
            // Use the TypeScript cast to HTMLInputElement
            (<HTMLInputElement> document.getElementById("btnStartOS")).focus();

            // Check for our testing and enrichment core, which
            // may be referenced here (from index.html) as function Glados().
            if (typeof Glados === "function") {
                // function Glados() is here, so instantiate Her into
                // the global (and properly capitalized) _GLaDOS variable.
                _GLaDOS = new Glados();
                _GLaDOS.init();
            }
        }

        //set default values in memory table
        public static initMemoryTbl():void{
            for(var i = 0; i < 256/8; ++i) {
                var row = _MemoryTbl.insertRow(i);
                for(var x = 0; x < 9; ++x) {
                    var cell = row.insertCell(x);
                    if (x == 0) {
                        var def = (i * 8).toString(16).toLocaleUpperCase();
                        cell.innerHTML = "0x0" + def;
                    } else {
                        cell.innerHTML = "00";
                    }
                }
            }
        }
        //edit the table to update program input when new programs are loaded
        //still need to handle running the op codes from memory
        public static editMemoryTbl():void{
            var memSlot = 0;
            var rowI;
            var columnI;
            for(var i=0; i<256/8; ++i){
                 rowI = i;
                for(var x=0; x<9; ++x){
                    columnI = x;
                    if (columnI==0){
                        var def = (i*8).toString(16).toLocaleUpperCase();
                        _MemoryTbl.rows[rowI].cells[columnI].innerHTML = "0x0" + def;
                    }else{
                        if(_Memory.mem[memSlot]==null) {
                            _MemoryTbl.rows[rowI].cells[columnI].innerHTML = "00";
                            memSlot++;}
                        else{
                            _MemoryTbl.rows[rowI].cells[columnI].innerHTML = _Memory.mem[memSlot];
                            memSlot++;
                            }
                        }
                    }
                }
            }




           //populate the cpu table from values stored in the cpu
        public static initCPUTbl():void{

            _CPUTbl.rows[1].cells[0].innerHTML=_CPU.PC;
            _CPUTbl.rows[1].cells[1].innerHTML=_CPU.Acc;
            _CPUTbl.rows[1].cells[2].innerHTML=_CPU.Operation;
            _CPUTbl.rows[1].cells[3].innerHTML=_CPU.Xreg;
            _CPUTbl.rows[1].cells[4].innerHTML=_CPU.Yreg;
            _CPUTbl.rows[1].cells[5].innerHTML=_CPU.Zflag;

        }

        //populate & edit the values in the pcb table while programs run
        public static runPCBTbl():void{
            _PCBTbl.rows[1].cells[0].innerHTML=_PCB.PiD;
            _PCBTbl.rows[1].cells[1].innerHTML=_PCB.State;
            _PCBTbl.rows[1].cells[2].innerHTML=_PCB.PC;
            _PCBTbl.rows[1].cells[3].innerHTML=_PCB.Acc;
            _PCBTbl.rows[1].cells[4].innerHTML=_PCB.Xreg;
            _PCBTbl.rows[1].cells[5].innerHTML=_PCB.Yreg;
            _PCBTbl.rows[1].cells[6].innerHTML=_PCB.Zflag;

        }



        public static hostLog(msg: string, source: string = "?"): void {
            // Note the OS CLOCK.
            var clock: number = _OSclock;
            // Note the REAL clock in milliseconds since January 1, 1970.
            var now: number = new Date().getTime();
            // Build the log string.
            var str: string = "({ clock:" + clock + ", source:" + source + ", msg:" + msg + ", now:" + now  + " })"  + "\n";
            // Update the log console.
            var taLog = <HTMLInputElement> document.getElementById("taHostLog");
            taLog.value = str + taLog.value;
            // TODO in the future: Optionally update a log database or some streaming service.
        }


        //
        // Host Events
        //
        public static hostBtnStartOS_click(btn): void {

            // Disable the (passed-in) start button...
            btn.disabled = true;
            // .. enable the Halt and Reset buttons ...
            (<HTMLButtonElement>document.getElementById("btnHaltOS")).disabled = false;
            (<HTMLButtonElement>document.getElementById("btnReset")).disabled = false;
            // .. set focus on the OS console display ...
            document.getElementById("display").focus();
            // ... Create and initialize the CPU (because it's part of the hardware)  ...
            _CPU = new Cpu();  // Note: We could simulate multi-core systems by instantiating more than one instance of the CPU here.
            _CPU.init();////      There's more to do, like dealing with scheduling and such, but this would be a start. Pretty cool
           //initiate the CPU visually on OS start
            this.initCPUTbl();
            // ... then set the host clock pulse ...
            _hardwareClockID = setInterval(Devices.hostClockPulse, CPU_CLOCK_INTERVAL);
            // .. and call the OS Kernel Bootstrap routine.
            _Kernel = new Kernel();
            _Kernel.krnBootstrap();  // _GLaDOS.afterStartup() will get called in there, if configured.



            _Memory = new Memory();
            _Memory.init();
            _MemoryManager = new MemManager();
        }



        public static hostBtnHaltOS_click(btn): void {
            Control.hostLog("Emergency halt", "host");
            Control.hostLog("Attempting Kernel shutdown.", "host");
            // Call the OS shutdown routine.
            _Kernel.krnShutdown();
            // Stop the interval that's simulating our clock pulse.
            clearInterval(_hardwareClockID);
            // TODO: Is there anything else we need to do here?
        }

        public static hostBtnReset_click(btn): void {
            // The easiest and most thorough way to do this is to reload (not refresh) the document.
            location.reload(true);
            // That boolean parameter is the 'forceget' flag. When it is true it causes the page to always
            // be reloaded from the server. If it is false or not specified the browser may reload the
            // page from its cache, which is not what we want.
        }
    }
}
