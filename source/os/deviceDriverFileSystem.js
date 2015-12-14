/**
 * Created by jarettmiller on 12/13/15.
 */
///<reference path="../globals.ts" />
///<reference path="../utils.ts" />
///<reference path="deviceDriver.ts" />
///<reference path="../host/control.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TSOS;
(function (TSOS) {
    var FSDriver = (function (_super) {
        __extends(FSDriver, _super);
        function FSDriver() {
            _super.call(this, this.krnHDDriverEnt, this.fileToDisk);
        }
        FSDriver.prototype.krnHDDriverEnt = function () {
            this.status = "loaded";
            this.init();
        };
        FSDriver.prototype.init = function () {
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
        FSDriver.prototype.occupyBlock = function (fileData) {
            var occupy = "";
            for (var x = 0; x < (124 - fileData.length); x++) {
                occupy += "0";
            }
            return fileData.concat(occupy);
        };
        FSDriver.prototype.occupyData = function (data) {
            _Kernel.krnTrace("File Data Length: " + data.length);
            var occupy = "";
            for (var x = 0; x < (120 - data.length); x++) {
                occupy += "0";
            }
            return data.concat(occupy);
        };
        FSDriver.prototype.createFile = function (filename) {
            filename = TSOS.Utils.hexFromString(filename);
            _Kernel.krnTrace("New File Name: " + filename);
            for (var x = 0; x < this.sections; x++) {
                for (var y = 0; y < this.blocks; y++) {
                    var m = this.selectMeta(0, x, y);
                    if (m.charAt(0) == "0") {
                        var i = this.findEmptySpace();
                        if (i != "unavailable") {
                            var file = "1" + i.concat(filename);
                            file = this.occupyBlock(file);
                            sessionStorage.setItem("0" + x + "" + y, file);
                        }
                        TSOS.Control.editHDDTbl();
                        return true;
                    }
                }
            }
            return false;
        };
        FSDriver.prototype.readFile = function (file) {
            file = this.occupyData(TSOS.Utils.hexFromString(file));
            var interm;
            var mbr;
            var readFile = "";
            var nextFile;
            for (var x = 0; x < this.sections; x++) {
                for (var y = 0; y < this.blocks; y++) {
                    interm = this.selectData(0, x, y);
                    if (interm == file) {
                        mbr = this.selectMBR(0, x, y);
                        do {
                            readFile += sessionStorage.getItem(mbr).substr(4);
                            nextFile = sessionStorage.getItem(mbr).substr(1, 3);
                            mbr = nextFile;
                        } while (mbr != "000");
                        readFile = TSOS.Utils.stringFromeHex(readFile);
                        _Kernel.krnTrace("Reading File: " + readFile);
                        return readFile;
                    }
                }
            }
        };
        FSDriver.prototype.selectMeta = function (t, s, b) {
            var m = sessionStorage.getItem(t + "" + s + "" + b).substr(0, 4);
            return m;
        };
        FSDriver.prototype.selectData = function (t, s, b) {
            var fileData = sessionStorage.getItem(t + "" + s + "" + b).substr(4);
            return fileData;
        };
        FSDriver.prototype.selectMBR = function (t, s, b) {
            var mbr = sessionStorage.getItem(t + "" + s + "" + b).substr(1, 3);
            return mbr;
        };
        FSDriver.prototype.findEmptySpace = function () {
            var mbr = "000";
            for (var x = 1; x < this.trks; x++) {
                for (var y = 0; y < this.sections; y++) {
                    for (var z = 0; z < this.blocks; z++) {
                        var m = this.selectMeta(x, y, z);
                        if (m.charAt(0) == "0") {
                            sessionStorage.setItem(x + "" + y + "" + z, "1" + mbr.concat(this.freeSpace));
                            return x + "" + y + "" + z;
                        }
                    }
                }
            }
            return "unavailable";
        };
        FSDriver.prototype.fileToDisk = function (params) {
            var x = params[0];
            var y = params[1];
            var z;
            switch (x) {
                case 0:
                    _Kernel.krnTrace("FILE: " + y + "IS BEING CREATED");
                    if (_krnFSDriver.createFile(y)) {
                        _StdOut.putText("File:  " + y + " successfully created");
                        _StdOut.advanceLine();
                    }
                    else {
                        _StdOut.putText("Error Creating File: " + y);
                        _StdOut.advanceLine();
                    }
                    break;
                case 1:
                    _Kernel.krnTrace("READING FILE WITH NAME: " + y);
                    var fileRead = _krnFSDriver.readFile(y);
                    _StdOut.putText("File: " + y);
                    _StdOut.advanceLine();
                    _StdOut.putText(fileRead);
            }
        };
        FSDriver.prototype.deleteFile = function (file) {
            file = this.occupyData(TSOS.Utils.hexFromString(file));
            var interm;
            var mbr;
            var followingBlock;
            for (var x = 0; x < this.sections; x++) {
                for (var y = 0; y < this.blocks; y++) {
                    interm = this.selectData(0, x, y);
                    if (interm == file) {
                        mbr = this.selectMBR(0, x, y);
                        sessionStorage.setItem("0" + x + "" + y, "0000" + this.freeSpace);
                        do {
                            followingBlock = sessionStorage.getItem(mbr).substr(1, 3);
                            //
                            sessionStorage.setItem(mbr, "0000" + this.freeSpace);
                            mbr = followingBlock;
                        } while (mbr != "000");
                        TSOS.Control.editHDDTbl();
                        return true;
                    }
                }
            }
            return false;
        };
        FSDriver.prototype.listFiles = function () {
            var file;
            for (var x = 0; x < this.sections; x++) {
                for (var y = 0; y < this.blocks; y++) {
                    file = this.selectData(0, x, y);
                    if (file != this.freeSpace) {
                        file = TSOS.Utils.stringFromeHex(file);
                        _Kernel.krnTrace("File name: " + file);
                        _StdOut.putText(" " + file);
                        _StdOut.advanceLine();
                    }
                }
            }
            _StdOut.advanceLine();
        };
        return FSDriver;
    })(TSOS.DeviceDriver);
    TSOS.FSDriver = FSDriver;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=deviceDriverFileSystem.js.map