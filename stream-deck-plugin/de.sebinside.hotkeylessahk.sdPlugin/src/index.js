var websocket = null;
var pluginUUID = null;
var settingsCache = {};

const defaultActionId = "de.sebinside.hotkeylessahk.action";
const restartActionId = "de.sebinside.hotkeylessahk.restart";

function connectElgatoStreamDeckSocket(inPort, inPluginUUID, inRegisterEvent, inInfo) {
    pluginUUID = inPluginUUID

    websocket = new WebSocket("ws://localhost:" + inPort);

    websocket.onopen = function () {
        var json = {
            "event": inRegisterEvent,
            "uuid": inPluginUUID
        };

        websocket.send(JSON.stringify(json));
    };

    websocket.onmessage = function (evt) {
        // Received message from Stream Deck
        console.log("Received data: " + JSON.stringify(evt.data));

        var jsonObj = JSON.parse(evt.data);
        var event = jsonObj['event'];
        var action = jsonObj['action'];
        var context = jsonObj['context'];
        var jsonPayload = jsonObj['payload'] || {};

        if (event == "keyUp") {
            var settings = jsonPayload['settings'];
            var coordinates = jsonPayload['coordinates'];
            var userDesiredState = jsonPayload['userDesiredState'];
            executeAction(context, settings, coordinates, action, userDesiredState);
        }
        else if (event == "sendToPlugin") {

            // TODO: call save Settings
            console.log("Received a call!");
            
        }
    };

    websocket.onclose = function () {
        // Websocket is closed
    };
};

function executeAction(context, settings, coordinates, action, userDesiredState) {
    console.log(action);
}

function saveSettings(context, settings) {
    var json = {
        "event": "setSettings",
        "context": context,
        "payload": settings
    };

    websocket.send(JSON.stringify(json));
}
