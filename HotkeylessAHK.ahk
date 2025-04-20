#Requires AutoHotkey v2.0
SendMode("Input")
SetWorkingDir(A_ScriptDir)
TraySetIcon("files\icon.ico")
A_IconTip := "HotkeylessAHK"
#SingleInstance force
#Include files\lib.ahk

; HotkeylessAHK by sebinside
; ALL INFORMATION: https://github.com/sebinside/HotkeylessAHK
; Make sure that you have downloaded everything, especially the "/files" folder.
; Make sure that you have NodeJS installed and available in the PATH variable.

functionClassNames := ["OtherFunctions"] ; this can be expanded to allow for OTHER function classes, I.E PersonalFunctions, WorkFunctions and so on. Note that duplicate function names may hide each other as there is no handling for scopes!

debug := false ; set to true to see the console output of the node server. This will also show the console window, which is hidden by default.

SetupServer(debug)
RunClient(functionClassNames)

; Your custom functions go into the 'CustomFunctions' class.
; You can then call them by using the URL "localhost:42800/send/yourFunctionName"
; The function name "kill" is reserved.

Class CustomFunctions {
    HelloWorld() {
        MsgBox "Hello, World!"
    }

    OpenExplorer() {
        Run "explorer.exe"
    }
}