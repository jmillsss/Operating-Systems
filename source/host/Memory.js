/**
 * Created by jarettmiller on 10/19/15.
 */
var TSOS;
(function (TSOS) {
    var Memory = (function () {
        function Memory(mem) {
            if (mem === void 0) { mem = [256]; }
            this.mem = mem;
        }
        Memory.prototype.init = function () {
            this.mem = [256];
        };
        return Memory;
    })();
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memory.js.map