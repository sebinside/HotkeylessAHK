"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var server_1 = require("./server");
var SERVER_PORT = 42800;
console.log("HotkeylessAHK by sebinside.");
var server = new server_1.HotkeylessAHKServer(SERVER_PORT);
server.setup();
