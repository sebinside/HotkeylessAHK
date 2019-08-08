import * as express from "express";
import {RequestHandler, Response} from "express";

export class HotkeylessAHKServer {

    // Setup server
    private app = express();
    private router = express.Router();

    private pendingResult: Response = null;

    /**
     * Handles the waiting aka. subscriber/redirecting ahk script
     */
    private waitFunction: RequestHandler = (req, res) => {
        if (this.pendingResult !== null) {
            console.error("Already waiting for an AHK script with '/wait'. Please check your processes!");
            res.send("");
        } else {
            this.pendingResult = res;
            console.log("Received subscriber.");
        }
    };

    /**
     * Handles the noitifier aka the caller e.g. a stream deck
     */
    private notifyFunction: RequestHandler = (req, res) => {
        if (this.pendingResult !== null) {
            const command = req.params.command;
            this.pendingResult.send(command);
            this.pendingResult = null;
            res.send("success");
            console.log(`Send command: ${command}`);
        } else {
            console.error("No waiting process registered. Please call '/wait' first!");
            res.send("failure");
        }
    };

    constructor(private serverPort: number) {
    }

    setup() {
        console.log("Starting server...");

        this.router.get("/wait", this.subscriberFunction);

        this.router.get("/notify/:command", this.sendFunction);

        // Start server
        this.app.use('/', this.router);
        this.app.listen(this.serverPort);
        console.log(`Server running on port ${this.serverPort}.`);
        console.log("Please use the '/subscribe endpoint first!");
    }
}
