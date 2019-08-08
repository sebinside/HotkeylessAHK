import * as express from "express";
import {RequestHandler, Response} from "express";

export class HotkeylessAHKServer {

    // Setup server
    private app = express();
    private router = express.Router();

    private pendingResult: Response = null;

    /**
     * Handles the subscriber aka. redirecting ahk script
     */
    private subscriberFunction: RequestHandler = (req, res) => {
        if (this.pendingResult !== null) {
            console.error("Already subscribed an AHK script with '/subscribe'. Please check your processes!");
            res.send("");
        } else {
            this.pendingResult = res;
            console.log("Received subscriber.");
        }
    };

    /**
     * Handles the sender aka the caller e.g. a stream deck
     */
    private sendFunction: RequestHandler = (req, res) => {
        if (this.pendingResult !== null) {
            const command = req.params.command;
            this.pendingResult.send(command);
            this.pendingResult = null;
            res.send("success");
            console.log(`Send command: ${command}`);
            if(command === "kill") {
                process.exit(0);
            }
        } else {
            console.error("No subscribing process registered. Please call '/subscribe' first!");
            res.send("failure");
        }
    };

    constructor(private serverPort: number) {
    }

    setup() {
        console.log("Starting server...");

        this.router.get("/subscribe", this.subscriberFunction);

        this.router.get("/send/:command", this.sendFunction);

        // Start server
        this.app.use('/', this.router);
        this.app.listen(this.serverPort);
        console.log(`Server running on port ${this.serverPort}.`);
        console.log("Please use the '/subscribe endpoint first!");
    }
}
