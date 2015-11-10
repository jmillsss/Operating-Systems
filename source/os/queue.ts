/* ------------
   Queue.ts

   A simple Queue, which is really just a dressed-up JavaScript Array.
   See the Javascript Array documentation at
   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
   Look at the push and shift methods, as they are the least obvious here.

   ------------ */

module TSOS {
    export class Queue {
        constructor(public q = new Array()) {
        }

        public getSize() {
            return this.q.length;
        }

        public isEmpty(){
            return (this.q.length == 0);
        }

        public enqueue(element) {
            this.q.push(element);
        }

        public dequeue() {
            var retVal = null;
            if (this.q.length > 0) {
                retVal = this.q.shift();
            }
            return retVal;
        }

        public toString() {
            var retVal = "";
            for (var i in this.q) {
                retVal += "[" + this.q[i] + "] ";
            }
            return retVal;
        }
        public getIndex(index){
            var i = this.q[index];
            return i;
        }

        public switchQueue(array, X, Y){
            var i = array[Y];
            array[Y]=array[X];
            array[X]=i;

        }
        public removeQueue(pid){
            for (var x=0; x<this.getSize(); x++){
                if(this.q[x].PiD=pid){
                    this.switchQueue(this.q,0,x)
                    this.dequeue();
                }
            }

        }

    }
}
