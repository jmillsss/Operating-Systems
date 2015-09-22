///<reference path="../globals.ts" />
///<reference path="deviceDriver.ts" />

/* ----------------------------------
   DeviceDriverKeyboard.ts

   Requires deviceDriver.ts

   The Kernel Keyboard Device Driver.
   ---------------------------------- */

module TSOS {

    // Extends DeviceDriver
    export class DeviceDriverKeyboard extends DeviceDriver {

        constructor() {
            // Override the base method pointers.
            super(this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
        }

        public krnKbdDriverEntry() {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        }

        public krnKbdDispatchKeyPress(params) {
            // Parse the params.    TODO: Check that the params are valid and osTrapError if not.
            var keyCode = params[0];
            var isShifted = params[1];
            _Kernel.krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
            var chr = "";
            // Check to see if we even want to deal with the key that was pressed.
            if (((keyCode >= 65) && (keyCode <= 90)) ||   // A..Z
                ((keyCode >= 97) && (keyCode <= 123)))  {  // a..z {
                // Determine the character we want to display.
                // Assume it's lowercase...
                chr = String.fromCharCode(keyCode + 32);
                // ... then check the shift key and re-adjust if necessary.
                if (isShifted) {
                    chr = String.fromCharCode(keyCode);
                }
                // TODO: Check for caps-lock and handle as shifted if so.
                _KernelInputQueue.enqueue(chr);
            } else if ((keyCode >= 48) && (keyCode <= 57)) {
                _KernelInputQueue.enqueue(enableSymbol(keyCode, isShifted));
            }
            else if  ((keyCode == 32)   ||   // space
                        (keyCode == 13)) {                       // enter
                chr = String.fromCharCode(keyCode);
                _KernelInputQueue.enqueue(chr);
            } else if (puncChar(keyCode)){
                _KernelInputQueue.enqueue(enablePuncChar(keyCode,isShifted));
            }


        function puncChar(ch){
        if ((ch >= 186 && ch <= 192) || (ch >= 219 && ch <= 222)){
            return true;
        }
        return false;
    }

        function enablePuncChar(keyCode, isShifted) {

            var lookupTable = {
                    '186' : ';',
                    '187' : '=',
                    '188' : ',',
                    '189' : '-',
                    '190' : '.',
                    '191' : '/',
                    '192' : '`',
                    '219' : '[',
                    '220' : '\\',
                    '221' : ']',
                    '222' : '\''
               },

                lookupTableShifted = {
                    '186' : ':',
                    '187' : '+',
                    '188' : '<',
                    '189' : '_',
                    '190' : '>',
                    '191' : '?',
                    '192' : '~',
                    '219' : '{',
                    '220' : '|',
                    '221' : '}',
                    '222' : '\"'
     };
             chr = lookupTable[keyCode];
            if (isShifted) {
                chr = lookupTableShifted[keyCode];
            }
                return chr;
}

            function enableSymbol(keyCode, isShifted) {
                var lookupTableShifted = {
                    '48': ')',
                    '49': '!',
                    '50': '@',
                    '51': '#',
                    '52': '$',
                    '53': '%',
                    '54': '^',
                    '55': '&',
                    '56': '*',
                    '57': '('
                };
                chr = String.fromCharCode(keyCode);
                if (isShifted) {
                    chr = lookupTableShifted[keyCode];
                }
                return chr;
            }
        }
    }
}
