"use strict";
exports.__esModule = true;
exports.HotkeylessAHKServer = void 0;
var express = require("express");
var HotkeylessAHKServer = /** @class */ (function () {
    function HotkeylessAHKServer(serverPort) {
        var _this = this;
        this.serverPort = serverPort;
        // Setup server
        this.app = express();
        this.router = express.Router();
        this.pendingResult = null;
        this.list = "";
        /**
         * Handles the subscriber aka. redirecting ahk script
         */
        this.subscriberFunction = function (req, res) {
            _this.pendingResult = res;
            console.log("Received subscriber.");
        };
        /**
         * Handles the sender aka the caller e.g. a stream deck
         */
        this.sendFunction = function (req, res) {
            if (_this.pendingResult !== null) {
                var command = req.params.command;
                _this.pendingResult.send(command);
                _this.pendingResult = null;
                res.send("success");
                console.log("Send command: ".concat(command));
            }
            else {
                console.error("No subscribing process registered. Please call '/subscribe' first!");
                res.send("failure");
            }
        };
        this.setListFunction = function (req, res) {
            var list = req.params.list;
            // This is required due to the last comma added in the ahk code
            _this.list = list.substring(0, list.length - 1);
            res.send("success");
        };
        this.getListFunction = function (req, res) {
            res.send(_this.list);
        };
        /**
         * Stops the node process
         */
        this.killFunction = function (req, res) {
            console.log("Shutting down server...");
            process.exit(0);
        };
    }
    HotkeylessAHKServer.prototype.setup = function () {
        console.log("Starting server...");
        this.router.get("/subscribe", this.subscriberFunction);
        this.router.get("/send/:command", this.sendFunction);
        this.router.get("/kill", this.killFunction);
        this.router.get("/setList/:list", this.setListFunction);
        this.router.get("/list", this.getListFunction);
        // Start server
        this.app.use('/', this.router);
        this.app.listen(this.serverPort);
        console.log("Server running on port ".concat(this.serverPort, "."));
        console.log("Please use the '/subscribe' endpoint first!");
    };
    return HotkeylessAHKServer;
}());
exports.HotkeylessAHKServer = HotkeylessAHKServer;
