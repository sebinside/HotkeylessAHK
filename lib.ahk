SetupServer() {
    ; This snippet disables flashing console windows
    DllCall("AllocConsole")
    WinHide % "ahk_id " DllCall("GetConsoleWindow", "ptr")

    ; Starts the server using node js
    Run node ""index.js""
}

RunClient() {
    shell := ComObjCreate("WScript.Shell")
    server := "curl http://localhost:42800/subscribe"

    ; Go in subscriber mode and wait for commands.
    ; You can trigger these commands by calling "localhost:42800/send/commandNameGoesHere"
    Loop {
        exec := shell.Exec(ComSpec " /C " server)
        command := exec.StdOut.ReadAll()
        
        ; TODO: Change using func()

        ; Your custom code goes here!
        if(command == "helloworld") {
            MsgBox, Hello World

        } else if(command == "test123") {
            MsgBox, working  

        } else if(command == "kill") {
            Run curl ""http://localhost:42800/kill""
            break
        }
    }
}