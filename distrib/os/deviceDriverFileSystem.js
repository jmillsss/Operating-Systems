/**
 * Created by jarettmiller on 12/13/15.
 */
///<reference path="../globals.ts" />
// /<reference path="../os/deviceDriver.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TSOS;
(function (TSOS) {
    var HDDD = (function (_super) {
        __extends(HDDD, _super);
        function HDDD() {
            _super.call(this, this.krnHDDDriverEnt);
            this.trks = 4;
            this.sections = 8;
            this.blocks = 8;
            this.blkLength = 64;
            this.meta = "";
            this.freeSpace = "";
        }
        HDDD.prototype.krnHDDDriverEnt = function () {
            this.status = "loaded";
            this.init();
        };
        HDDD.prototype.init = function () {
            for (var x = 0; x < 60; x++) {
                this.freeSpace += "--";
            }
            this.meta = "0000";
            for (var i = 0; i < this.trks; i++) {
                for (var j = 0; j < this.sections; j++) {
                    for (var y = 0; y < this.blocks; y++) {
                        var empty = this.meta.concat(this.freeSpace);
                        sessionStorage.setItem(i.toString() + j.toString() + y.toString(), empty);
                    }
                }
            }
        };
        HDDD.prototype.createFile = function (filename) {
            return;
        };
        HDDD.prototype.findMeta = function (t, s, b) {
            return "";
        };
        HDDD.prototype.findEmptySpace = function () {
            return "";
        };
        return HDDD;
    })(TSOS.DeviceDriver);
    TSOS.HDDD = HDDD;
})(TSOS || (TSOS = {}));
