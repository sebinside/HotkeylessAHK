let websocket = null,
    pluginUUID = null;
    makerkey = "";

function connectElgatoStreamDeckSocket(inPort, inPluginUUID, inRegisterEvent, inInfo)
{
    pluginUUID = inPluginUUID;

    // Open the web socket
    websocket = new WebSocket("ws://localhost:" + inPort);

    websocket.onopen = function()
    {
        // WebSocket is connected, register the plugin
        const json = {
            "event": inRegisterEvent,
            "uuid": inPluginUUID
        };
    
        websocket.send(JSON.stringify(json));
    };

    websocket.onmessage = function (evt)
    {
        // Received message from Stream Deck
        const jsonObj = JSON.parse(evt.data);
        console.log(jsonObj);
        
        if(jsonObj['event'] == "keyUp")
        {            
            let functionname = "",
                ip = "",
                port = "";
            jsonObj.payload.settings.hasOwnProperty('function') && (functionname = jsonObj.payload.settings["function"]);
            jsonObj.payload.settings.hasOwnProperty('ip') && (ip = jsonObj.payload.settings["ip"]);
            jsonObj.payload.settings.hasOwnProperty('port') && (port = jsonObj.payload.settings["port"]);

            if(functionname == "" || ip == "" || port == "") {
                const json = {
                    "event": "showAlert",
                    "context": jsonObj.context,
                };
                websocket.send(JSON.stringify(json));
            } else {
                const request = new XMLHttpRequest();
                request.open("GET", 'http://'+ ip + ':' + port + '/send/' + functionname);
                request.send();
            };

        }
    };
};