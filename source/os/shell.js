///<reference path="../globals.ts" />
///<reference path="../utils.ts" />
///<reference path="shellCommand.ts" />
///<reference path="userCommand.ts" />
///<reference path="../host/memory.ts"/>
///<reference path="../os/memManager.ts" />
///<reference path="../os/pcb.ts" />
///<reference path="../host/control.ts"/>
/* ------------
   Shell.ts

   The OS Shell - The "command line interface" (CLI) for the console.

    Note: While fun and learning are the primary goals of all enrichment center activities,
          serious injuries may occur when trying to write your own Operating System.
   ------------ */
// TODO: Write a base class / prototype for system services and let Shell inherit from it.
var TSOS;
(function (TSOS) {
    var Shell = (function () {
        function Shell() {
            // Properties
            this.promptStr = ">";
            this.commandList = [];
            this.curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
            this.apologies = "[sorry]";
            this.pid = 0;
        }
        Shell.prototype.init = function () {
            var sc;
            //
            // Load the command list.
            // ver
            sc = new TSOS.ShellCommand(this.shellVer, "ver", "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;
            // help
            sc = new TSOS.ShellCommand(this.shellHelp, "help", "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;
            // shutdown
            sc = new TSOS.ShellCommand(this.shellShutdown, "shutdown", "- Shuts down the virtual OS but leaves the underlying host / hardware simulation running.");
            this.commandList[this.commandList.length] = sc;
            // cls
            sc = new TSOS.ShellCommand(this.shellCls, "cls", "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;
            // man <topic>
            sc = new TSOS.ShellCommand(this.shellMan, "man", "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;
            // trace <on | off>
            sc = new TSOS.ShellCommand(this.shellTrace, "trace", "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;
            // rot13 <string>
            sc = new TSOS.ShellCommand(this.shellRot13, "rot13", "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;
            //  wherami
            sc = new TSOS.ShellCommand(this.wherami, "whereami", " - Shows wher you are.");
            this.commandList[this.commandList.length] = sc;
            // date& time
            sc = new TSOS.ShellCommand(this.date, "date", " - Shows the curent time and date.");
            this.commandList[this.commandList.length] = sc;
            // man <topic>
            sc = new TSOS.ShellCommand(this.triberaps, "triberaps", "<song> - Shows some Tribe song lyrics <song>.");
            this.commandList[this.commandList.length] = sc;
            // prompt <string>
            sc = new TSOS.ShellCommand(this.shellPrompt, "prompt", "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;
            //bsod
            sc = new TSOS.ShellCommand(this.shellError, "error", " - displays an error");
            this.commandList[this.commandList.length] = sc;
            //load
            sc = new TSOS.ShellCommand(this.shellLoad, "load", " - Loads from the user program input section");
            this.commandList[this.commandList.length] = sc;
            //status
            sc = new TSOS.ShellCommand(this.shellStatus, "status", " <string> - Allows user input for current status in Status Bar");
            this.commandList[this.commandList.length] = sc;
            //run
            sc = new TSOS.ShellCommand(this.clearMemory, "clearmem", "<string> Clears all existing memory");
            this.commandList[this.commandList.length] = sc;
            //run
            sc = new TSOS.ShellCommand(this.shellRun, "run", "<string> Allows user to run a program saved in memory");
            this.commandList[this.commandList.length] = sc;
            // ps  - list the running processes and their IDs
            // kill <id> - kills the specified process id.
            //
            // Display the initial prompt.
            this.putPrompt();
        };
        Shell.prototype.putPrompt = function () {
            _StdOut.putText(this.promptStr);
        };
        Shell.prototype.handleInput = function (buffer) {
            _Kernel.krnTrace("Shell Command~" + buffer);
            //
            // Parse the input...
            //
            var userCommand = this.parseInput(buffer);
            // ... and assign the command and args to local variables.
            var cmd = userCommand.command;
            var args = userCommand.args;
            //
            // Determine the command and execute it.
            //
            // TypeScript/JavaScript may not support associative arrays in all browsers so we have to iterate over the
            // command list in attempt to find a match.  TODO: Is there a better way? Probably. Someone work it out and tell me in class.
            var index = 0;
            var found = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                }
                else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args);
            }
            else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + TSOS.Utils.rot13(cmd) + "]") >= 0) {
                    this.execute(this.shellCurse);
                }
                else if (this.apologies.indexOf("[" + cmd + "]") >= 0) {
                    this.execute(this.shellApology);
                }
                else {
                    this.execute(this.shellInvalidCommand);
                }
            }
        };
        // Note: args is an option parameter, ergo the ? which allows TypeScript to understand that.
        Shell.prototype.execute = function (fn, args) {
            // We just got a command, so advance the line...
            _StdOut.advanceLine();
            // ... call the command function passing in the args with some über-cool functional programming ...
            fn(args);
            // Check to see if we need to advance the line again
            if (_StdOut.currentXPosition > 0) {
                _StdOut.advanceLine();
            }
            // ... and finally write the prompt again.
            this.putPrompt();
        };
        Shell.prototype.parseInput = function (buffer) {
            var retVal = new TSOS.UserCommand();
            // 1. Remove leading and trailing spaces.
            buffer = TSOS.Utils.trim(buffer);
            // 2. Lower-case it.
            buffer = buffer.toLowerCase();
            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");
            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift(); // Yes, you can do that to an array in JavaScript.  See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = TSOS.Utils.trim(cmd);
            // 4.2 Record it in the return value.
            retVal.command = cmd;
            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = TSOS.Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        };
        //
        // Shell Command Functions.  Kinda not part of Shell() class exactly, but
        // called from here, so kept here to avoid violating the law of least astonishment.
        //
        Shell.prototype.shellInvalidCommand = function () {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Unbelievable. You, [subject name here],");
                _StdOut.advanceLine();
                _StdOut.putText("must be the pride of [subject hometown here].");
            }
            else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        };
        Shell.prototype.shellCurse = function () {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        };
        Shell.prototype.shellApology = function () {
            if (_SarcasticMode) {
                _StdOut.putText("I think we can put our differences behind us.");
                _StdOut.advanceLine();
                _StdOut.putText("For science . . . You monster.");
                _SarcasticMode = false;
            }
            else {
                _StdOut.putText("For what?");
            }
        };
        Shell.prototype.shellVer = function (args) {
            _StdOut.putText(APP_NAME + " version " + APP_VERSION);
        };
        Shell.prototype.shellHelp = function (args) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
        };
        Shell.prototype.shellShutdown = function (args) {
            _StdOut.putText("Shutting down...");
            // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed.  If possible.  Not a high priority.  (Damn OCD!)
        };
        Shell.prototype.shellCls = function (args) {
            _StdOut.clearScreen();
            _StdOut.resetXY();
        };
        Shell.prototype.shellMan = function (args) {
            if (args.length > 0) {
                var topic = args[0];
                switch (topic) {
                    case "help":
                        _StdOut.putText("Help displays a list of (hopefully) valid commands.");
                        break;
                    case "ver":
                        _StdOut.putText("Ver displays the current running version of TSOS");
                        break;
                    case "shutdown":
                        _StdOut.putText("Shutdown shuts down the virtual Operating System");
                        break;
                    case "cls":
                        _StdOut.putText("cls is used to clear the host log screen and reset the cursor's position");
                        break;
                    case "rot13":
                        _StdOut.putText("Rot13 performs obfuscation on SPECIAL words");
                        break;
                    case "prompt":
                        _StdOut.putText("Prompt allows you to change the prompt from the default which is: >");
                        break;
                    case "date":
                        _StdOut.putText("date displays the current time and date");
                        break;
                    case "whereami":
                        _StdOut.putText("whereami shows where u at dawg");
                        break;
                    case "triberaps":
                        _StdOut.putText("triberaps show song lyrics for some songs (try 'jazz')");
                        break;
                    case "error":
                        _StdOut.putText("error throws an error, shuts down the OS, and shows ");
                        break;
                    case "load":
                        _StdOut.putText("load validates user code in the textbox. Only hex digits and spaces");
                        break;
                    case "status":
                        _StdOut.putText("status accepts a string and shows that string in the Status Bar under the Time & Date");
                        break;
                    // TODO: Make descriptive
                    // MANual page entries for the the rest of the shell commands here.
                    default:
                        _StdOut.putText("No manual entry for " + args[0] + ".");
                }
            }
            else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }
        };
        Shell.prototype.shellTrace = function (args) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, doofus.");
                        }
                        else {
                            _Trace = true;
                            _StdOut.putText("Trace ON");
                        }
                        break;
                    case "off":
                        _Trace = false;
                        _StdOut.putText("Trace OFF");
                        break;
                    default:
                        _StdOut.putText("Invalid arguement.  Usage: trace <on | off>.");
                }
            }
            else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        };
        Shell.prototype.shellRot13 = function (args) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + TSOS.Utils.rot13(args.join(' ')) + "'");
            }
            else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        };
        Shell.prototype.shellPrompt = function (args) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            }
            else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        };
        Shell.prototype.wherami = function (args) {
            _StdOut.putText("I am currently sitting in the library working on my Operating Systems Lab (also puling out my hair).");
        };
        Shell.prototype.date = function (agrs) {
            var theDate = new Date();
            var month = theDate.getUTCMonth() + 1;
            var date = month + "/" + theDate.getUTCDate() + "/" + theDate.getUTCFullYear() + " " + theDate.getHours() + ":" + theDate.getMinutes() + ":" + theDate.getSeconds();
            _StdOut.putText(date);
        };
        //tribe called quest lyrics func
        Shell.prototype.triberaps = function (args) {
            if (args.length > 0) {
                var song = args[0];
                switch (song) {
                    case "kickit":
                        _StdOut.putText("YES YOU CAN! Just as long as you wipe youre feet really good on the rythym rug");
                        break;
                    case "jazz":
                        _StdOut.putText("We got the jazz we got the jazz");
                        break;
                    case "electric":
                        _StdOut.putText("Honey, check it out, you got me mesmerized, with your black hair and fat-ass thighs");
                        break;
                    default:
                        _StdOut.putText("No song lyrics for " + args[0] + ".");
                }
            }
            else {
                _StdOut.putText("Usage: man <song>  Please supply a song.");
            }
        };
        //bsod
        Shell.prototype.shellError = function (args) {
            _DrawingContext.rect(0, 0, _Canvas.width, _Canvas.height);
            _DrawingContext.fillStyle = "#3090C7";
            _DrawingContext.fill();
            _Kernel.krnTrapError("BSOD");
        };
        //load
        Shell.prototype.shellLoad = function (args) {
            var prog = _UserProgIn.value;
            var accept = 0;
            //accept digits 1-9 & letters A-F
            for (var i = 0; i < prog.length; i++) {
                if (prog.charAt(i) == "0") {
                }
                else if (prog.charAt(i) == "1") {
                }
                else if (prog.charAt(i) == "2") {
                }
                else if (prog.charAt(i) == "3") {
                }
                else if (prog.charAt(i) == "4") {
                }
                else if (prog.charAt(i) == "5") {
                }
                else if (prog.charAt(i) == "6") {
                }
                else if (prog.charAt(i) == "7") {
                }
                else if (prog.charAt(i) == "8") {
                }
                else if (prog.charAt(i) == "9") {
                }
                else if (prog.charAt(i).toLocaleLowerCase() == "a") {
                }
                else if (prog.charAt(i).toLocaleLowerCase() == "b") {
                }
                else if (prog.charAt(i).toLocaleLowerCase() == "c") {
                }
                else if (prog.charAt(i).toLocaleLowerCase() == "d") {
                }
                else if (prog.charAt(i).toLocaleLowerCase() == "e") {
                }
                else if (prog.charAt(i).toLocaleLowerCase() == "f") {
                }
                else if (prog.charAt(i) == " ") {
                }
                else {
                    accept += 1;
                }
            }
            if (accept > 0 || prog == "") {
                _StdOut.putText("The entered code is invalid!");
            }
            else {
                _StdOut.putText("The entered code is valid!");
                _StdOut.advanceLine();
                //load the process in to memory
                prog = prog.replace(/\s+/g, '').toUpperCase();
                _Kernel.krnTrace("Program: " + prog);
                _MemoryManager.loadInputProg(prog);
            }
        };
        //status
        Shell.prototype.shellStatus = function (args) {
            var status = "";
            for (var i = 0; i < args.length; i++) {
                status += args[i] + " ";
            }
            _StatusBar.value += "\n" + "Status: " + status;
        };
        Shell.prototype.shellRun = function (args) {
            if (args == _PCB.PiD) {
                _CPU.isExecuting = true;
                _CPU.PC = 0;
            }
            else {
                _StdOut.putText("Please enter an existing P-id!");
            }
        };
        Shell.prototype.clearMemory = function (args) {
            for (var i = 0; i < 768; i++) {
                _Memory.mem[i] = "00";
            }
            TSOS.Control.editMemoryTbl();
        };
        return Shell;
    })();
    TSOS.Shell = Shell;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=shell.js.map