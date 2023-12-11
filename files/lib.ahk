SetupServer() {
    ; This snippet disables flashing console windows
    DllCall("AllocConsole")
    WinHide("ahk_id " DllCall("GetConsoleWindow", "ptr"))

    ; Starts the server using node js
    Run("node `"`"files/dist/index.js`"`"")
}

RunClient() {
    shell := ComObject("WScript.Shell")
    server := "curl http://localhost:42800/subscribe -m 25"

    allFunctions := GetAvailableFunctions()
    sendListToServer := "curl http://localhost:42800/register/" . allFunctions
    shell.Exec(A_ComSpec " /C " sendListToServer)

    ; Go in subscriber mode and wait for commands.
    ; You can trigger these commands by calling "localhost:42800/send/commandNameGoesHere"
    Loop{
        exec := shell.Exec(A_ComSpec " /C " server)
        command := exec.StdOut.ReadAll()
        CallCustomFunctionByName(command)
    }
}

CallCustomFunctionByName(functionName) {
    methodString := "CustomFunctions." . functionName
    method := GetMethodFromString(methodString)
    if (functionName != "") {
        method()  ; Execute the method if it's not null
    }
}
; Adapted GetMethodFromString function
GetMethodFromString(str) {
    ; Split the string by '.'
    arr := StrSplit(str, '.')
    method := arr.Pop()

    ; Instantiate the CustomFunctions class
    obj := CustomFunctions()

    ; Return a bound method
    return ObjBindMethod(obj, method)
}

GetAvailableFunctions() {
    CustomFunctionsInstance := CustomFunctions()
    BaseMembers := ""  ; Initialize the variable to ensure it's not undefined
    for key in CustomFunctionsInstance.Base.OwnProps() {
        if CustomFunctionsInstance.Base.HasMethod(key) {
            func := CustomFunctionsInstance.Base.GetMethod(key)
            ;if (func.MinParams <= 1) ; used to use this, tbh i dont know why i need this, if it is needed then just moved the "BaseMembers .= key . "," so its under its check
            BaseMembers .= key . ","
        }
    }
    return BaseMembers
}
