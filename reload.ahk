; This file can be used to quickly restart the HotkeylessAHK server and client.
#Requires AutoHotkey v2.0
SendMode("Input")
SetWorkingDir(A_ScriptDir)
TraySetIcon("files\icon.ico")
A_IconTip := "Reloading HotkeylessAHK..."
#SingleInstance force

; Shutdown the server if it is running
if (isHotkeylessAHKRunning()) {
    whr := ComObject("WinHttp.WinHttpRequest.5.1")
    KILL_URL := "http://localhost:42800/send/kill"

    try {
        whr.Open("GET", KILL_URL, false)
        whr.Send()
    } catch error {
    }
}

; Restart the script once the server is down
loop 50 {
    Sleep(100)
    if (!isHotkeylessAHKRunning()) {
        Run("HotkeylessAHK.ahk")
        return
    }
}

MsgBox("Unable to start HotkeylessAHK. Please reload it manually.")
return

isHotkeylessAHKRunning() {
    SetTitleMatchMode(2)
    DetectHiddenWindows(1)
    return !!WinExist("HotkeylessAHK.ahk")
}
