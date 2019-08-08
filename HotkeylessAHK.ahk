#NoEnv  ; Recommended for performance and compatibility with future AutoHotkey releases.
; #Warn  ; Enable warnings to assist with detecting common errors.
SendMode Input  ; Recommended for new scripts due to its superior speed and reliability.
SetWorkingDir %A_ScriptDir%  ; Ensures a consistent starting directory.

; This snippet disables flashing console windows
DllCall("AllocConsole")
WinHide % "ahk_id " DllCall("GetConsoleWindow", "ptr")

; Please place this script in the same folder as the js files of HotkeylessAHK!
; Make sure that you have nodeJS installed.

; First: Start the server using node js
Run node ""index.js""

; Second: go in subscriber mode and wait for commands.
; You can trigger these commands by calling "localhost:42800/send/commandNameGoesHere"
shell := ComObjCreate("WScript.Shell")
server := "curl http://localhost:42800/subscribe"
Loop {
    exec := shell.Exec(ComSpec " /C " server)
    command := exec.StdOut.ReadAll()
    
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
