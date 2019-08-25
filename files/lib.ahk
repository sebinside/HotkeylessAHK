SetupServer() {
    ; This snippet disables flashing console windows
    DllCall("AllocConsole")
    WinHide % "ahk_id " DllCall("GetConsoleWindow", "ptr")

    ; Starts the server using node js
    Run node ""files/index.js""
}

RunClient() {
    shell := ComObjCreate("WScript.Shell")
    server := "curl http://localhost:42800/subscribe -m 25"

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
            ; Calls a custom defined function in any included script.
            ; Does ignore wrong calls (not defined functions).
            fn := Func(command)
            if(fn != 0) {
                %fn%()
            }
        }
    }
}