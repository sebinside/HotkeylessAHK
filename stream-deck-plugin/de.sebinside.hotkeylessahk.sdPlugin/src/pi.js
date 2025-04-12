const defaultActionId = "de.sebinside.hotkeylessahk.action";
const restartActionId = "de.sebinside.hotkeylessahk.kill";

const defaultSettings = {
  ip: "127.0.0.1",
  port: "42800",
  func: "",
  parameters: "",
};

let cachedSettings = defaultSettings;
let currentlySelectedFunction = "";
let websocket = null;
let pluginUUID = null;

const connectElgatoStreamDeckSocket = (inPort, inUUID, inRegisterEvent, inInfo, inActionInfo) => {
  setupPropertyInspector(inUUID, inActionInfo);
  setupWebSocket(inPort, inRegisterEvent, inActionInfo);
}

const setupPropertyInspector = (inUUID, inActionInfo) => {
  pluginUUID = inUUID;
  hideFunctionSelector(inActionInfo);
}

hideFunctionSelector = (inActionInfo) => {
  const { action } = JSON.parse(inActionInfo);
  if (action === restartActionId) {
    document.getElementById("FunctionSelector").style.display = "none";
    document.getElementById("ParametersSection").style.display = "none";
  }
}
const setupWebSocket = (inPort, inRegisterEvent) => {
  const websocketURL = `ws://localhost:${inPort}`;
  websocket = new WebSocket(websocketURL);

  websocket.onopen = () => onWebSocketOpen(inRegisterEvent);
  websocket.onmessage = (messageEvent) => onWebSocketMessage(messageEvent);
}

const onWebSocketOpen = (inRegisterEvent) => {
  callRegister(inRegisterEvent);
  callGetSettings();
}

const onWebSocketMessage = (messageEvent) => {
  const { event: eventType, payload: { settings } } = JSON.parse(messageEvent.data);

  if (eventType === "didReceiveSettings") {
    loadSettings(settings);
  }
}

const updateUI = () => {
  document.getElementById("field_ip").value = cachedSettings.ip;
  document.getElementById("field_port").value = cachedSettings.port;
  document.getElementById("field_parameters").value = cachedSettings.parameters;
  currentlySelectedFunction = cachedSettings.func;

  updateFunctionList();
}

const updateFunctionList = async () => {
  const infoMessage = createOptionElement(currentlySelectedFunction, true, "Please wait...");
  updateSelectElementHTML(infoMessage);

  const serverURL = generateServerURL();
  try {
    const response = await fetch(`${serverURL}/list`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    const innerHTML = generateFunctionListHTML(data);
    updateSelectElementHTML(innerHTML);
  } catch {
    const errorMessage = createOptionElement(currentlySelectedFunction, true, "An error occurred while reloading");
    updateSelectElementHTML(errorMessage);
  }
}

const updateSelectElementHTML = (innerHTML) => {
  const selectElement = document.getElementById("field_function");
  selectElement.innerHTML = innerHTML;
}

const generateFunctionListHTML = (data) => {
  return data.map(({ command: func }) => {
    const isSelected = func == currentlySelectedFunction ? "selected" : "";
    const truncatedFunc = func.length > 24 ? `${func.substring(0, 24)}...` : func;
    const displayFunc = truncatedFunc.replace(/[-_]/g, " ");
    return createOptionElement(func, isSelected, displayFunc);
  }).join('');
}

const createOptionElement = (value, isSelected, content) => {
  return `<option ${isSelected} value="${value}">${content}</option>`;
}

const fetchAndSaveSettings = () => {
  fetchSettings();
  callSaveSettings();
}

const fetchSettings = () => {
  cachedSettings.ip = document.getElementById("field_ip").value;
  cachedSettings.port = document.getElementById("field_port").value;
  cachedSettings.func = document.getElementById("field_function").value;
  cachedSettings.parameters = document.getElementById("field_parameters").value;
}

function loadSettings(settings) {
  if (!settings.ip || !settings.port || !settings.func) {
      console.log("No settings found. Init with default settings.");
      updateFunctionList().then(() => {
        fetchAndSaveSettings();
      });
  } else {
      cachedSettings.ip = settings.ip;
      cachedSettings.port = settings.port;
      cachedSettings.func = settings.func;
      if (settings.parameters) cachedSettings.parameters = settings.parameters;
  }

  updateUI();
}

const callRegister = (inRegisterEvent) => {
  const json = {
    event: inRegisterEvent,
    uuid: pluginUUID,
  };
  sendJSON(json);
}

const callGetSettings = () => {
  const json = {
    event: "getSettings",
    context: pluginUUID,
  };
  sendJSON(json);
}

const callSaveSettings = () => {
  const json = {
    event: "setSettings",
    context: pluginUUID,
    payload: cachedSettings,
  };
  sendJSON(json);
}

const sendJSON = (json) => {
  websocket.send(JSON.stringify(json));
}

const generateServerURL = () => {
  fetchSettings();
  return `http://${cachedSettings.ip}:${cachedSettings.port}`;
}
