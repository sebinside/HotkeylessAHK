import * as express from "express";

const SERVER_PORT = 42703;

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

    let releaseNow = false;

    // Register handling functions
    router.get("/trigger", function (req, res) {
        if (releaseNow) {
            res.send("jo!");
            releaseNow = false;
        }
    });

    // Register handling functions
    router.get("/release", function (req, res) {
        releaseNow = true;
    });

    // Start server
    app.use('/', router);
    app.listen(SERVER_PORT);
    console.log(`Server running on port ${SERVER_PORT}.`);
}