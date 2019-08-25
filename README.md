

## Hotkeyless AutoHotkey

The **AutoHotkey** (AHK) environment is a *powerful tool* to enhance your productivity and *speed up your workflow*. There are so many possibilities and use cases that sometimes... you might *run out of hotkeys*. Or you might want to *combine* AHK-scripts or trigger them from different sources.

Until now, you had only *two possible solutions*:

- **Exotic key combinations**, like... `CTRL + ALT + F13`. This solution is **fast**, but not very scalable. You might not remember, which hotkeys are still available and sometimes encounter bad side effects with your favorite software
- **Single AHK-scripts**, which you run directly from AHK or the explorer window. This solution is **scalable**, but how can you life with about *one second* delay, while the AHK-process is starting up?

**Hotkeyless AutoHotkey** combines the best of both worlds. It's an easy way to expand your AHK-possibilites and both **fast** and **scalable**. But don't take my word for it, here are some numbers:

| Approach                | Delay    | Fast | Scalable |
| ----------------------- | :------- | :--: | :------: |
| Key combinations        | ~ 10 ms  |  ✔   |    🞭     |
| Single AHK scripts      | ~ 800 ms |  🞭   |    ✔     |
| *Hotkeyless AutoHotkey* | ~ 100 ms |  ✔   |    ✔     |

You can make your own *performance tests*. Just have a look at the `performance-tests`-folder!

## Functionality

The **Hotkeyles AHK** script does launch a lightwight web server. It listens to the endpoint `localhost:42800/send/*` for http requests and redirects these to the `HotkeylessAHK.ahk` script. To be more precise, if you call `localhost:42800/send/HelloWorld`, the `HelloWorld()`-function inside the AHK-file is executed:

```ahk
HelloWorld() {
    MsgBox, Hello World
}
```

You can include your own AHK-scripts there and define custom functionality in a nice and clean way - without loosing to much performance. You can use your web browser, shortcuts or utility hardware like the [Stream Deck](https://www.elgato.com/gaming/stream-deck), like this:

![Stream Deck example](streamdeck.PNG)

*(Elgato does not provide a language option? Someone please upload an english version, lol)*

## Installation

TODO: Explain functionality, installation

## Usage

TODO: Explain usage

## More

Additional resources, incl. taran and ahk2premiere