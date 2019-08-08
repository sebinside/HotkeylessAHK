"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var HotkeylessAHKServer = /** @class */ (function () {
    function HotkeylessAHKServer(serverPort) {
        var _this = this;
        this.serverPort = serverPort;
        // Setup server
        this.app = express();
        this.router = express.Router();
        this.pendingResult = null;
        /**
         * Handles the subscriber aka. redirecting ahk script
         */
        this.subscriberFunction = function (req, res) {
            if (_this.pendingResult !== null) {
                console.error("Already subscribed an AHK script with '/subscribe'. Please check your processes!");
                res.send("");
            }
            else {
                _this.pendingResult = res;
                console.log("Received subscriber.");
            }
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
                console.log("Send command: " + command);
            }
            else {
                console.error("No subscribing process registered. Please call '/subscribe' first!");
                res.send("failure");
            }
        };
    }
    HotkeylessAHKServer.prototype.setup = function () {
        console.log("Starting server...");
        this.router.get("/subscribe", this.subscriberFunction);
        this.router.get("/send/:command", this.sendFunction);
        // Start server
        this.app.use('/', this.router);
        this.app.listen(this.serverPort);
        console.log("Server running on port " + this.serverPort + ".");
        console.log("Please use the '/subscribe' endpoint first!");
    };
    return HotkeylessAHKServer;
}());
exports.HotkeylessAHKServer = HotkeylessAHKServer;
