#NoEnv
SendMode Input
SetWorkingDir %A_ScriptDir%
Menu, Tray, Icon, shell32.dll, 147
#singleinstance force

#Include files\lib.ahk
#Include D:\Drive\autohotkey\source\lib\StreamDeckFunctions.ahk

; HotkeylessAHK by sebinside
; ALL INFORMATION: https://github.com/sebinside/HotkeylessAHK
; Make sure that you have downloaded everything, especially the "/files" folder.
; Make sure that you have nodeJS installed and available in the PATH variable.

SetupServer()
RunClient()

; Your custom functions go here!
; You can then call them by using the URL "localhost:42800/send/yourFunctionName"
; The funciton name "kill" is reserved.
