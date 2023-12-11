#Requires AutoHotkey v2.0
SendMode("Input")
SetWorkingDir(A_ScriptDir)
TraySetIcon("shell32.dll","147")
#SingleInstance force

#Include files\lib.ahk

; HotkeylessAHK by sebinside
; ALL INFORMATION: https://github.com/sebinside/HotkeylessAHK
; Make sure that you have downloaded everything, especially the "/files" folder.
; Make sure that you have NodeJS installed and available in the PATH variable.

SetupServer()
RunClient()

; Your custom functions go into the 'CustomFunctions' class.
; You can then call them by using the URL "localhost:42800/send/yourFunctionName"
Class CustomFunctions {

    HelloWorld() {
        MsgBox "Hello World"
    }

    OpenExplorer() {
        Run "explorer.exe"
    }

    kill() {
        Run("curl `"`"http://localhost:42800/kill`"`"")
        ExitApp
    }
}