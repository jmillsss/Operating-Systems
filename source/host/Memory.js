///<reference path="../globals.ts" />
/**
 * Created by jarettmiller on 10/19/15.
 */
var TSOS;
(function (TSOS) {
    var Memory = (function () {
        function Memory(mem, base, limit) {
            if (mem === void 0) { mem = [768]; }
            if (base === void 0) { base = 0; }
            if (limit === void 0) { limit = 768; }
            this.mem = mem;
            this.base = base;
            this.limit = limit;
        }
        Memory.prototype.init = function () {
            this.mem[786];
            this.base = 0;
            this.limit = 768;
        };
        return Memory;
    })();
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memory.js.map