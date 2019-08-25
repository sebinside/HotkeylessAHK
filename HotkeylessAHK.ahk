#NoEnv
SendMode Input
SetWorkingDir %A_ScriptDir%
#Include files/lib.ahk

; HotkeylessAHK by sebinside
; ALL INFORMATION: https://github.com/sebinside/HotkeylessAHK
; Make sure that you have downloaded everything, especially the "/files" folder.
; Make sure that you have nodeJS installed and available in the PATH.

SetupServer()
RunClient()

; Your custom functions go here! 
; You can then call them by using the URL "localhost:42800/send/yourFunctionName"
; The funciton name "kill" is reserved to end the script execution.

HelloWorld() {
    MsgBox, Hello World
}

OpenExplorer() {
    Run, explorer.exe
}