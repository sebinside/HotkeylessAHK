let websocket = null;
let pluginUUID = null;

const defaultActionId = "de.sebinside.hotkeylessahk.action";
const restartActionId = "de.sebinside.hotkeylessahk.kill";

const defaultSettings = {
    ip: "127.0.0.1",
    port: "42800",
    func: ""
}

let cachedSettings = defaultSettings;
let currentlySelectedFunction = "";


function connectElgatoStreamDeckSocket(inPort, inUUID, inRegisterEvent, inInfo, inActionInfo) {
    setupPropertyInspector(inUUID, inActionInfo);
    setupWebSocket(inPort, inRegisterEvent, inActionInfo);
}


function setupPropertyInspector(inUUID, inActionInfo) {
    pluginUUID = inUUID;
    hideFunctionSelector(inActionInfo);
}

function hideFunctionSelector(inActionInfo) {
    const actionId = JSON.parse(inActionInfo);
    if (actionId.action === restartActionId) {
        document.getElementById("FunctionSelector").style.display = 'none';
    }
}

function setupWebSocket(inPort, inRegisterEvent) {
    const websocketURL = `ws://localhost:${inPort}`
    websocket = new WebSocket(websocketURL);

    websocket.onopen = () => onWebSocketOpen(inRegisterEvent);
    websocket.onmessage = (messageEvent) => onWebSocketMessage(messageEvent);

}

function onWebSocketOpen(inRegisterEvent) {
    callRegister(inRegisterEvent);
    callGetSettings();
}

function onWebSocketMessage(messageEvent) {
    const eventData = JSON.parse(messageEvent.data);
    const eventType = eventData['event'];

    if (eventType === "didReceiveSettings") {
        const settings = eventData["payload"]["settings"];
        loadSettings(settings);
    }
}


function updateUI() {
    document.getElementById("field_ip").value = cachedSettings.ip;
    document.getElementById("field_port").value = cachedSettings.port;
    currentlySelectedFunction = cachedSettings.func;

    updateFunctionList();
}

function updateFunctionList() {
    const infoMessage = createOptionElement(currentlySelectedFunction, true, "Please wait...");
    updateSelectElementHTML(infoMessage);

    const serverURL = generateServerURL();
    fetch(`${serverURL}/list`)
        .then(response => response.text())
        .then(data => {
            const innerHTML = generateFunctionListHTML(data);
            updateSelectElementHTML(innerHTML)

        }).catch(() => {
            const errorMessage = createOptionElement(currentlySelectedFunction, true, "An error occurred while reloading");
            updateSelectElementHTML(errorMessage);
        });
}

function updateSelectElementHTML(innerHTML) {
    const selectElement = document.getElementById("field_function");
    selectElement.innerHTML = innerHTML;
}

function generateFunctionListHTML(data) {
    let innerHTML = "";
    const availableFunctions = data.split(",");

    for (let func of availableFunctions) {
        const isSelected = func == currentlySelectedFunction ? "selected" : "";
        innerHTML += createOptionElement(func, isSelected, func);
    }

    return innerHTML;
}

function createOptionElement(value, isSelected, content) {
    return `<option ${isSelected} value="${value}">${content}</option>`;
}


function fetchAndSaveSettings() {
    fetchSettings();
    callSaveSettings();
}

function fetchSettings() {
    cachedSettings.ip = document.getElementById("field_ip").value;
    cachedSettings.port = document.getElementById("field_port").value;
    cachedSettings.func = document.getElementById("field_function").value;
}

function loadSettings(settings) {
    if (!settings.ip || !settings.port || !settings.func) {
        console.log("No settings found. Init with default settings.");
        callSaveSettings();
    } else {
        cachedSettings = settings;
    }

    updateUI();
}


function callRegister(inRegisterEvent) {
    const json = {
        event: inRegisterEvent,
        uuid: pluginUUID
    };
    sendJSON(json);
}

function callGetSettings() {
    const json = {
        "event": "getSettings",
        "context": pluginUUID
    };
    sendJSON(json);
}

function callSaveSettings() {
    var json = {
        "event": "setSettings",
        "context": pluginUUID,
        "payload": cachedSettings
    };
    sendJSON(json);
}


function sendJSON(json) {
    websocket.send(JSON.stringify(json));
}

function generateServerURL() {
    fetchSettings();
    const protocol = "http://";
    return `${protocol}${cachedSettings.ip}:${cachedSettings.port}`;
}
