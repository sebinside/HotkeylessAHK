SetupServer() {
    ; This snippet disables flashing console windows
    DllCall("AllocConsole")
    WinHide % "ahk_id " DllCall("GetConsoleWindow", "ptr")

    ; Starts the server using node js
    Run node ""files/dist/index.js""
}

RunClient() {
    shell := ComObjCreate("WScript.Shell")
    server := "curl http://localhost:42800/subscribe -m 25"

    allFunctions := GetAvailableFunctions()
    sendListToServer := "curl http://localhost:42800/register/" . allFunctions
    shell.Exec(ComSpec " /C " sendListToServer)

    ; Go in subscriber mode and wait for commands.
    ; You can trigger these commands by calling "localhost:42800/send/commandNameGoesHere"
    Loop {
        exec := shell.Exec(ComSpec " /C " server)
        command := exec.StdOut.ReadAll()
        
        ; Special case: kill. Reserved to terminate the script.
        if(command == "kill") {
            Run curl ""http://localhost:42800/kill""
            Exit
        } else {
            CallCustomFunctionByName(command)
        }
    }
}

CallCustomFunctionByName(functionName) {
    CustomFunctionsInstance := New CustomFunctions
    if(IsFunctionAvailable(functionName)) {
        CustomFunctionsInstance[functionName]()
    }
}

IsFunctionAvailable(functionName) {
    CustomFunctionsFunctionName := "CustomFunctions." . functionName
    fn := Func(CustomFunctionsFunctionName)
    return (fn != 0)
}

GetAvailableFunctions() {
    CustomFunctionsInstance := New CustomFunctions
    For key,value in CustomFunctionsInstance.Base
        if((key != "__Class") && (GetFunctionParameterCount(key) <= 1)) {
            BaseMembers .= key ","	
        }
    return %BaseMembers%
}

GetFunctionParameterCount(functionName) {
    CustomFunctionsFunctionName := "CustomFunctions." . functionName
    fn := Func(CustomFunctionsFunctionName)
    return fn.MinParams
}