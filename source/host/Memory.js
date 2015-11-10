///<reference path="../globals.ts" />
/**
 * Created by jarettmiller on 10/19/15.
 */
var TSOS;
(function (TSOS) {
    var Memory = (function () {
        function Memory(mem, memBase, memLimit) {
            if (mem === void 0) { mem = [768]; }
            if (memBase === void 0) { memBase = 0; }
            if (memLimit === void 0) { memLimit = 768; }
            this.mem = mem;
            this.memBase = memBase;
            this.memLimit = memLimit;
        }
        Memory.prototype.init = function () {
            this.mem[768];
            this.memBase = 0;
            this.memLimit = 768;
        };
        return Memory;
    })();
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memory.js.map