var websocket = null;
var pluginUUID = null;
var settingsCache = {};

const defaultActionId = "de.sebinside.hotkeylessahk.action";
const restartActionId = "de.sebinside.hotkeylessahk.kill";

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
    };

    websocket.onclose = function () {
        // Websocket is closed
    };
};

function executeAction(context, settings, coordinates, action, userDesiredState) {
    const ip = settings.ip;
    const port = settings.port;
    const functionToCall = (action === defaultActionId) ? settings.func : "kill";

    const url = `http://${ip}:${port}/send/${functionToCall}`;

    fetch(url)
        .then(response => {
            var json = {
                "event": "showOk",
                "context": context,
            };

            websocket.send(JSON.stringify(json));
        }).catch(() => {
            var json = {
                "event": "showAlert",
                "context": context,
            };

            websocket.send(JSON.stringify(json));
        });
}