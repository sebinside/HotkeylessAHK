let websocket = null;

const defaultActionId = "de.sebinside.hotkeylessahk.action";
const restartActionId = "de.sebinside.hotkeylessahk.kill";

function connectElgatoStreamDeckSocket(inPort, inPluginUUID, inRegisterEvent) {
    setupWebSocket(inPort, inPluginUUID, inRegisterEvent);
}

function setupWebSocket(inPort, inPluginUUID, inRegisterEvent) {
    const websocketURL = `ws://localhost:${inPort}`
    websocket = new WebSocket(websocketURL);

    websocket.onopen = () => onWebSocketOpen(inPluginUUID, inRegisterEvent);
    websocket.onmessage = (messageEvent) => onWebSocketMessage(messageEvent);
}

function onWebSocketOpen(inPluginUUID, inRegisterEvent) {
    const json = {
        "event": inRegisterEvent,
        "uuid": inPluginUUID
    };

    sendJSON(json);
}

function onWebSocketMessage(messageEvent) {
    const eventData = JSON.parse(messageEvent.data);
    const eventType = eventData["event"];

    if (eventType === "keyUp") {
        const action = eventData["action"];
        const context = eventData["context"];
        const settings = eventData["payload"]["settings"];

        executeKeyUpAction(context, settings, action);
    }
}

function executeKeyUpAction(context, settings, action) {
    const ip = settings.ip;
    const port = settings.port;
    const functionToCall = (action === defaultActionId) ? settings.func : "kill";
    const url = `http://${ip}:${port}/send/${functionToCall}`;

    fetchAndShowResult(url, context);
}

function fetchAndShowResult(url, context) {
    fetch(url)
        .then(() => {
            showOK(context);
        }).catch(() => {
            showAlert(context);
        });
}

function showOK(context) {
    const eventType = "showOK";
    sendSimpleEvent(eventType, context);
}

function showAlert(context) {
    const eventType = "showAlert";
    sendSimpleEvent(eventType, context);
}

function sendSimpleEvent(event, context) {
    const json = {
        "event": event,
        "context": context,
    };

    sendJSON(json);
}

function sendJSON(json) {
    websocket.send(JSON.stringify(json));
}