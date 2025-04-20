"use strict";
const HotkeylessAHKServer = require("./server");
const DEFAULT_SERVER_PORT = 42800;
console.log("HotkeylessAHK by sebinside.");

let serverPort = DEFAULT_SERVER_PORT;
if(process.argv.length < 3) {
    console.log("No port provided. Using default port " + DEFAULT_SERVER_PORT + ".");
} else {
    serverPort = parseInt(process.argv[2]);
    if(isNaN(serverPort) || serverPort < 0 || serverPort > 65535) {
        console.log("Invalid port provided. Using default port " + DEFAULT_SERVER_PORT + ".");
        serverPort = DEFAULT_SERVER_PORT;
    } else {
        console.log("Using provided port " + serverPort + ".");
    }
}

const server = new HotkeylessAHKServer(serverPort);
server.setup();