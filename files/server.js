"use strict";

const express = require("express");

class HotkeylessAHKServer {
  constructor(serverPort) {
    this.serverPort = serverPort;
    this.app = express();
    this.router = express.Router();
    this.pendingResult = null;
    this.list = "";
    this.functionClassMap = {};
  }

  subscribe = (req, res) => {
    this.pendingResult = res;
    console.log("Received subscriber.");
  };

  send = (req, res) => {
    if (this.pendingResult !== null) {
      const fullCommand = req.originalUrl.substring(6);
      const [functionName, ...params] = fullCommand.split("?");

      if (functionName === "kill") {
        const command = `kill${params.length > 0 ? "?" + params.join("?") : ""}`;
        this.pendingResult.send(command);
        this.pendingResult = null;
        res.send("success");
        console.log(`Send command: ${command}`);
        this.kill(req, res);
        return;
      }

      const functionClass = this.findFunctionClass(functionName);

      if (functionClass) {
        const command = `${functionClass}.${functionName}${
          params.length > 0 ? "?" + params.join("?") : ""
        }`;
        this.pendingResult.send(command);
        this.pendingResult = null;
        res.send("success");
        console.log(`Send command: ${command}`);
      } else {
        console.error(`Function '${functionName}' not found in any class.`);
        res.send("failure");
      }
    } else {
      console.error(
        "No subscribing process registered. Please call '/subscribe' first!"
      );
      res.send("failure");
    }
  };

  register = (req, res) => {
    const list = req.params.list;
    this.list = list.replace(/,/g, "\n");
    const listArray = this.list.split("\n");
    for (let i = 0; i < listArray.length; i += 2) {
      const fullFunctionName = listArray[i];
      const [functionClass, functionName] = fullFunctionName.split(".");
      if (functionName !== "__Init") {
        this.functionClassMap[functionName] = functionClass;
      }
    }
    res.send("success");
  };

  getList = (req, res) => {
    const listObjects = [];
    for (const functionName in this.functionClassMap) {
      if (
        functionName !== "undefined"
      ) {
        const note = "None";
        listObjects.push({ command: functionName, note });
      }
    }
    res.json(listObjects);
  };
  kill = (req, res) => {
    console.log("Shutting down server...");
    process.exit(0);
  };

  findFunctionClass(functionName) {
    return this.functionClassMap[functionName] || null;
  }

  setup() {
    console.log("Starting server...");
    this.router.get("/subscribe", this.subscribe);
    this.router.get("/send/*", this.send);
    this.router.get("/kill", this.kill);
    this.router.get("/register/:list", this.register);
    this.router.get("/list", this.getList);
    this.app.use("/", this.router);
    this.app.listen(this.serverPort, () => {
      console.log(`Server running on port ${this.serverPort}.`);
      console.log("Please use the '/subscribe' endpoint first!");
    });
  }
}

module.exports = HotkeylessAHKServer;