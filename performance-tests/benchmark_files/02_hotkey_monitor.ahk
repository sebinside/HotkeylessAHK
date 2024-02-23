#Requires AutoHotkey v2.0
#SingleInstance Force
SendMode("Input")  ; Recommended for new scripts due to its superior speed and reliability.
SetWorkingDir(A_ScriptDir)  ; Ensures a consistent starting directory.

; Start the listener first, then run test2_hotkeystart.ahk

^+!g::
{
    FileAppend("`nSTOPKey_Combinations : " A_TickCount, A_ScriptDir "\timestamps.txt")
    ExitApp
}
