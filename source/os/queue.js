/* ------------
   Queue.ts

   A simple Queue, which is really just a dressed-up JavaScript Array.
   See the Javascript Array documentation at
   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
   Look at the push and shift methods, as they are the least obvious here.

   ------------ */
var TSOS;
(function (TSOS) {
    var Queue = (function () {
        function Queue(q) {
            if (q === void 0) { q = new Array(); }
            this.q = q;
        }
        Queue.prototype.getSize = function () {
            return this.q.length;
        };
        Queue.prototype.isEmpty = function () {
            return (this.q.length == 0);
        };
        Queue.prototype.enqueue = function (element) {
            this.q.push(element);
        };
        Queue.prototype.dequeue = function () {
            var retVal = null;
            if (this.q.length > 0) {
                retVal = this.q.shift();
            }
            return retVal;
        };
        Queue.prototype.toString = function () {
            var retVal = "";
            for (var i in this.q) {
                retVal += "[" + this.q[i] + "] ";
            }
            return retVal;
        };
        Queue.prototype.getIndex = function (index) {
            var i = this.q[index];
            return i;
        };
        Queue.prototype.switchQueue = function (array, X, Y) {
            var i = array[Y];
            array[Y] = array[X];
            array[X] = i;
        };
        Queue.prototype.removeQueue = function (pid) {
            var el;
            for (var x = 0; x < this.getSize(); x++) {
                if (this.q[x].PiD = pid) {
                    this.switchQueue(this.q, 0, x);
                    el = this.dequeue();
                }
            }
            return el;
        };
        Queue.prototype.formatPart = function (left, right) {
            var mid = this.q[Math.floor((right + left) / 2)].priority;
            var x = left;
            var y = right;
            while (x <= y) {
                while (this.q[x].priority < mid) {
                    x++;
                }
                while (this.q[y].priority > mid) {
                    y--;
                }
                if (x <= y) {
                    this.switchQueue(this.q, x, y);
                    x++;
                    y--;
                }
            }
            return x;
        };
        Queue.prototype.sortQueue = function (left, right) {
            var i;
            if (this.q.length > 1) {
                i = this.formatPart(left, right);
                if (left < i - 1) {
                    this.sortQueue(left, i - 1);
                }
                if (i < right) {
                    this.sortQueue(i, right);
                }
            }
            return this.q;
        };
        return Queue;
    })();
    TSOS.Queue = Queue;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=queue.js.map