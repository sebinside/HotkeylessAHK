let websocket = null,
    uuid = null,
    actionInfo = {};

function connectElgatoStreamDeckSocket(inPort, inPropertyInspectorUUID, inRegisterEvent, inInfo, inActionInfo) {
    
    uuid = inPropertyInspectorUUID;
    actionInfo = JSON.parse(inActionInfo);

    websocket = new WebSocket('ws://localhost:' + inPort);

    websocket.onopen = function() {
        // WebSocket is connected, register the Property Inspector
        let json = {
            "event": inRegisterEvent,
            "uuid": inPropertyInspectorUUID
        };
        websocket.send(JSON.stringify(json));

        json = {
            "event": "getSettings",
            "context": uuid,
        };
        websocket.send(JSON.stringify(json));
    };

    websocket.onmessage = function (evt) {
        // Received message from Stream Deck
        const jsonObj = JSON.parse(evt.data);
        if (jsonObj.event === 'didReceiveSettings') {
            const payload = jsonObj.payload.settings;

            document.getElementById('function').value !== undefined ? document.getElementById('function').value = payload.function : document.getElementById('function').value = "";
            document.getElementById('ip').value !== undefined ? document.getElementById('ip').value = payload.ip : document.getElementById('ip').value = "127.0.0.1";
            document.getElementById('port').value !== undefined ? document.getElementById('port').value = payload.function : document.getElementById('port').value = "42800";

            const el = document.querySelector('.sdpi-wrapper');
            el && el.classList.remove('hidden');
        }
    };
}

function update() {
    if (websocket && (websocket.readyState === 1)) {
        let payload = {};
        payload.function = document.getElementById('function').value;
        payload.ip = document.getElementById('ip').value;
        payload.port = document.getElementById('port').value;
        const json = {
            "event": "setSettings",
            "context": uuid,
            "payload": payload
        };
        websocket.send(JSON.stringify(json));
        console.log(json)
    }    
}

function openPage(site) {
    if (websocket && (websocket.readyState === 1)) {
        const json = {
            'event': 'openUrl',
            'payload': {
                'url': 'https://' + site
            }
        };
        websocket.send(JSON.stringify(json));
    }
}