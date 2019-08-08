#NoEnv  ; Recommended for performance and compatibility with future AutoHotkey releases.
; #Warn  ; Enable warnings to assist with detecting common errors.
SendMode Input  ; Recommended for new scripts due to its superior speed and reliability.
SetWorkingDir %A_ScriptDir%  ; Ensures a consistent starting directory.

; Performance test 1
; This script simulates exeucting a AHK script like windows does it when a file is opened
; MY RESULT (mean of 11 runs): 780 ms

FileAppend, `nSTART: %A_TickCount%, %A_ScriptDir%\timestamps.txt
Run test1_nativestart_function.ahk