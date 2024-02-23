#Requires AutoHotkey v2.0

SendMode("Input")  ; Recommended for new scripts due to its superior speed and reliability.
SetWorkingDir(A_ScriptDir)  ; Ensures a consistent starting directory.

; Performance test 2
; This script simulates the performance of native hotkeys. Please start the listener first!
; MY RESULT (mean of 11 runs): 6 ms

FileAppend("`nSTARTKey_Combinations: " A_TickCount, A_ScriptDir "\timestamps.txt")
Send("^+!g")