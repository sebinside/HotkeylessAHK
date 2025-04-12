"use strict";
const HotkeylessAHKServer = require("./server");
const SERVER_PORT = 42800;
console.log("HotkeylessAHK by sebinside.");
const server = new HotkeylessAHKServer(SERVER_PORT);
server.setup();