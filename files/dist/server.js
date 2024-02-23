"use strict";
const express = require("express");

class HotkeylessAHKServer {
    constructor(serverPort) {
        this.serverPort = serverPort;
        this.app = express();
        this.router = express.Router();
        this.pendingResult = null;
        this.list = "";
    }

    subscribe = (req, res) => {
        this.pendingResult = res;
        console.log("Received subscriber.");
    };

    send = (req, res) => {
        if (this.pendingResult !== null) {
            const fullCommand = req.originalUrl.substring(6);
            this.pendingResult.send(fullCommand);
            this.pendingResult = null;
            res.send("success");
            console.log(`Send command: ${fullCommand}`);
        } else {
            console.error("No subscribing process registered. Please call '/subscribe' first!");
            res.send("failure");
        }
    };

    register = (req, res) => {
        const list = req.params.list;
        this.list = list.replace(/,/g, '\n');  // Replace commas with newlines
        res.send("success");
    };

    getList = (req, res) => {
        const listArray = this.list.split('\n');  // Split the list into an array
        const listObjects = [];
    
        for (let i = 0; i < listArray.length; i += 2) {
            const command = listArray[i];
            const note = listArray[i + 1] || "None";  // Use "None" if there's no note
    
            if (command !== "__Init") {
                listObjects.push({ command, note });
            }
        }
    
        res.json(listObjects);  // Send the array of objects as a JSON object
    };

    kill = (req, res) => {
        console.log("Shutting down server...");
        process.exit(0);
    };

    setup() {
        console.log("Starting server...");
        this.router.get("/subscribe", this.subscribe);
        this.router.get("/send/*", this.send);
        this.router.get("/kill", this.kill);
        this.router.get("/register/:list", this.register);
        this.router.get("/list", this.getList);
        this.app.use('/', this.router);
        this.app.listen(this.serverPort, () => {
            console.log(`Server running on port ${this.serverPort}.`);
            console.log("Please use the '/subscribe' endpoint first!");
        });
    }
}

module.exports = HotkeylessAHKServer;