const express = require("express");
const SERVER_PORT = 42703;
let interval;
let releaseNow = false;

main();

function main() {
    console.log("HotkeylessAHK by sebinside.");
    setupServer();
}

function setupServer() {
    console.log("Starting server...");

    // Setup server
    const app = express();
    const router = express.Router();

    // Register handling functions
    // /trigger only called once
    router.get("/trigger", (req, res) => {
        interval = setInterval(trigger, 1, req, res);
    });

    // Register handling functions
    // /release called with value
    router.get("/release", function (req, res) {
        releaseNow = true;
        res.send("ok.")
    });

    // Start server
    app.use('/', router);
    app.listen(SERVER_PORT);
    console.log(`Server running on port ${SERVER_PORT}.`);
}

const trigger = (req, res) => {
    if (releaseNow) {
        res.send("jo!");
        releaseNow = false;
        clearInterval(interval);
    }    
}