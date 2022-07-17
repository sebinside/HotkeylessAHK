var websocket = null,
    uuid = null,
    actionInfo = {};

let selectedFunction = "";

function connectElgatoStreamDeckSocket(inPort, inUUID, inRegisterEvent, inInfo, inActionInfo) {
    uuid = inUUID;
    actionInfo = JSON.parse(inActionInfo);
    websocket = new WebSocket('ws://localhost:' + inPort);

    websocket.onopen = function () {
        const registerJSON = {
            event: inRegisterEvent,
            uuid: inUUID
        };
        websocket.send(JSON.stringify(registerJSON));

        const getSettingsJSON = {
            "event": "getSettings",
            "context": inUUID
        };
        websocket.send(JSON.stringify(getSettingsJSON));
    }

    websocket.onmessage = function (evt) {
        var jsonObj = JSON.parse(evt.data);
        var event = jsonObj['event'];
        var payload = jsonObj['payload'] || {};

        if (event == "didReceiveSettings") {
            loadSettings(payload.settings);
        }
    }
}

function refreshFunctionList() {
    const selectElement = document.getElementById("field_function");
    selectElement.innerHTML = `<option selected value="${selectedFunction}">Please wait...</option>`;
    const serverURL = getServerURL();

    fetch(`${serverURL}/list`)
     .then(response => response.text())
     .then(data => {
        console.log("Retrieved new function data.");
        const availableFunctions = data.split(",");
        let innerHTML = "";

        for(let func of availableFunctions) {
            const isSelected = func == selectedFunction ? "selected" : "";
            innerHTML += `<option ${isSelected} value="${func}">${func}</option>`
        }

        selectElement.innerHTML = innerHTML;

     }).catch(() => {
        selectElement.innerHTML = `<option selected value="${selectedFunction}">An error occurred while reloading</option>`
     });
}

function getServerURL() {
    const protocol = "http://";
    const ip = document.getElementById("field_ip").value;
    const port = document.getElementById("field_port").value;
    return `${protocol}${ip}:${port}`;
}

function saveSettings() {

    const ip = document.getElementById("field_ip").value;
    const port = document.getElementById("field_port").value;
    const func = document.getElementById("field_function").value;

    var json = {
        "event": "setSettings",
        "context": uuid,
        "payload": {
            ip: ip,
            port: port,
            func: func
        }   
    };

    websocket.send(JSON.stringify(json));
}

function loadSettings(settings) {
    console.log(settings);
    document.getElementById("field_ip").value = settings.ip;
    document.getElementById("field_port").value = settings.port;
    selectedFunction = settings.func;

    refreshFunctionList();
}