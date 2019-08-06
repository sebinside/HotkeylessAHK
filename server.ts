import * as express from "express";
import {RequestHandler} from "express";

export class HotkeylessAHKServer {

    // Setup server
    private app = express();
    private router = express.Router();

    private triggerRes : express.Response = null;


    constructor(private serverPort: number) {
    }

    setup() {
        console.log("Starting server...");

        // Register handling functions
        // /trigger only called once
        this.router.get("/trigger", this.triggerFunction);

        // Register handling functions
        // /release called with value
        this.router.get("/release/:command", this.releaseFunction);

        // Start server
        this.app.use('/', this.router);
        this.app.listen(this.serverPort);
        console.log(`Server running on port ${this.serverPort}.`);
    }

    private triggerFunction : RequestHandler = (req, res) => {
        // TODO: Handle an already existing trigger
        this.triggerRes = res;
    };

    private releaseFunction : RequestHandler = (req, res) => {
        if(this.triggerRes !== null) {
            this.triggerRes.send(`ok: ${req.params.command}`);
            this.triggerRes = null;
        }
        res.send("ok.")
    }
}