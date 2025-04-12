#Requires AutoHotkey v2.0
class MyWebRequest {
    __New(method, url) {
        this.whr := ComObject("WinHttp.WinHttpRequest.5.1")
        this.method := method
        this.url := url
    }

    SendRequest() {
        try {
            ; send the first request and wait for a response
            this.whr.Open(this.method, this.url, true)
            this.whr.Send()
            this.whr.WaitForResponse()
            ; append the end timestamp to the file after the second request
            FileAppend("`nSTOPHotkeyless_AutoHotkey: " A_TickCount, A_ScriptDir "\timestamps.txt")
        } catch error {
            ; handle error
        }
    }
}

BASE_URL := "http://localhost:42800"
HTTP_METHOD := "GET"
ENDPOINT := "/subscribe"

webRequest := MyWebRequest(HTTP_METHOD, BASE_URL . ENDPOINT)
webRequest.SendRequest()