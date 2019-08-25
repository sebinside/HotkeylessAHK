#NoEnv
SendMode Input
SetWorkingDir %A_ScriptDir%
#Include lib.ahk

; HotkeylessAHK by sebinside
; ALL INFORMATION: https://github.com/sebinside/HotkeylessAHK
; Please place this script in the same folder as the js files of HotkeylessAHK!
; Make sure that you have nodeJS installed.

SetupServer()
RunClient()

; Your custom functions go here! 
; You can then call them by using the URL ""localhost:42800/send/yourFunctionName"
; The funciton name "kill" is reserved to end the script execution.

HelloWorld() {
    MsgBox, Hello World
}