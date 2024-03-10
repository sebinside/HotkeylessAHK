#Requires AutoHotkey v2.0

SendMode("Input")  ; Recommended for new scripts due to its superior speed and reliability.
SetWorkingDir(A_ScriptDir)  ; Ensures a consistent starting directory.

FileAppend("`nSTOPNatively_Calling_AHK_file : " A_TickCount, A_ScriptDir "\timestamps.txt")