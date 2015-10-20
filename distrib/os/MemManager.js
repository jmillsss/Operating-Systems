/**
 * Created by jarettmiller on 10/19/15.
 */
var TSOS;
(function (TSOS) {
    var MemManager = (function () {
        function MemManager() {
        }
        MemManager.prototype.loadInputProg = function (prog) {
            /* var insertToMem;
             var memIndex=0;
            for(var i =0; 1<prog.length; i++){
    
                insertToMem=prog.slice(i, i+2);
    
                _Memory.mem[memIndex] = insertToMem;
                i++;
                memIndex++;
            }
             _PCB = new PCB();
             _PCB.init();
             _StdOut.putText("Progam Loaded To memory, Pid = "  );
             Control.editMemoryTbl();
    
    */
        };
        return MemManager;
    })();
    TSOS.MemManager = MemManager;
})(TSOS || (TSOS = {}));
