#NoEnv  ; Recommended for performance and compatibility with future AutoHotkey releases.
; #Warn  ; Enable warnings to assist with detecting common errors.
SendMode Input  ; Recommended for new scripts due to its superior speed and reliability.
SetWorkingDir %A_ScriptDir%  ; Ensures a consistent starting directory.

; test 1: trigger different command                 0-16ms delay           fast
^+!h::
    StartTime := A_TickCount
    Send, ^+!g
    Return

^+!g::
    StopTime := A_TickCount
    Difference = %StopTime% - %StartTime%
    MsgBox, %Difference%
    Return

; test 2: trigger different ahk script              700-800ms delay        scalable
^+!j::
    StartTime := A_TickCount
    Run function.ahk
    MsgBox, %StartTime%
    Return

; test 3: respond to curl with HotkeylessAHK        70-110ms delay         scalable, fast
^+!k::
    RunWait curl ""http://localhost:42703/trigger"",,hide
    StopTime := A_TickCount
    MsgBox, %StopTime%
    ; Here comes the logic part
    Return