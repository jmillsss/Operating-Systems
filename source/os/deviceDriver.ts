/* ------------------------------
     DeviceDriver.ts

     The "base class" for all Device Drivers.
     ------------------------------ */

module TSOS {
    export class DeviceDriver {
        public version = '0.07';
        public status = 'unloaded';
        public preemptable = false;
        public trks=4;
        public sections=8;
        public blocks=8;
        public blkLength=64;
        public meta="";
        public freeSpace="";

        constructor(public driverEntry = null,
                    public isr = null) {
        }
    }
}
