#Requires AutoHotkey v2.0
SendMode("Input")  ; Recommended for new scripts due to its superior speed and reliability.
SetWorkingDir(A_ScriptDir)  ; Ensures a consistent starting directory.

; Performance test 1
; This script simulates executing a AHK script like windows does it when a file is opened
; MY RESULT (mean of 11 runs): 780 ms

FileAppend("`nSTARTNatively_Calling_AHK_file: " A_TickCount, A_ScriptDir "\timestamps.txt")
Run("00_IGNORE_nativestart_function.ahk")