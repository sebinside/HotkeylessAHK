#NoEnv  ; Recommended for performance and compatibility with future AutoHotkey releases.
; #Warn  ; Enable warnings to assist with detecting common errors.
SendMode Input  ; Recommended for new scripts due to its superior speed and reliability.
SetWorkingDir %A_ScriptDir%  ; Ensures a consistent starting directory.

; Start the listener first, then run test3_hotkeylessAHK.ahk
; Make sure that you have started the server using "node index.js" in the /files folder
Loop {
    RunWait curl ""http://localhost:42800/subscribe"",,hide
    FileAppend, `nSTOP : %A_TickCount%, %A_ScriptDir%\timestamps.txt
}
