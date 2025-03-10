#Requires AutoHotkey v2.0

SendMode("Input")  ; Recommended for new scripts due to its superior speed and reliability.
SetWorkingDir(A_ScriptDir)  ; Ensures a consistent starting directory.

; Performance test 3
; This script simulates an HotkeylessAHK command. Please start the listener first!
; MY RESULT (mean of 11 runs): 104 ms

FileAppend("`nSTARTHotkeyless_AutoHotkey: " A_TickCount, A_ScriptDir "\timestamps.txt")
Run("curl `"`"http://localhost:42800/send/test`"`"")

