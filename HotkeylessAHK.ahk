#Requires AutoHotkey v2.0
SendMode("Input")
SetWorkingDir(A_ScriptDir)
#SingleInstance force
#Include files\lib.ahk

; HotkeylessAHK by sebinside
; ALL INFORMATION: https://github.com/sebinside/HotkeylessAHK
; Make sure that you have downloaded everything, especially the "/files" folder.
; Make sure that you have NodeJS installed and available in the PATH variable.


; (can be either global OR local)
seb := "seb is a friend"
global exampleString := "This is a string variable"
exampleInteger := 123
exampleFloat := 12.34
exampleBoolean := true
exampleArray := ["element1", "element2", "element3"]
exampleObject := { key1: "value1", key2: "value2" }
exampleNull := ""

; variables end

SetupServer()
RunClient()

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