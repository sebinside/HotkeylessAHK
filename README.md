<p align="center">
  <h3 align="center"><a href="https://github.com/sebinside/HotkeylessAHK/releases"><img src = "hotkeylessahk-logo.png"/></a><br>
  <a href="https://github.com/sebinside/HotkeylessAHK/releases">🔗 Download Release</a></h3>
</p>
<p>&nbsp;</p>

## Hotkeyless AutoHotkey

The **AutoHotkey** (AHK) environment is a *powerful tool* to enhance your productivity and *speed up your workflow*. There are so many possibilities and use cases that sometimes... you might *run out of hotkeys*. Or you might want to *combine* AHK-scripts or trigger them from different sources or even from other computers in your local network.

Until now, you had only *two possible solutions*:

- **Exotic key combinations**, like... `CTRL + ALT + F13`. This solution is **fast**, but not very scalable. You might not remember, which hotkeys are still available and sometimes encounter bad side effects with your favorite software
- **Single AHK-scripts**, which you run directly from AHK or the explorer window. This solution is **scalable**, but how can you live with the delay of the AHK-process starting up?

**Hotkeyless AutoHotkey** combines the best of both worlds. It's an easy way to expand your AHK-capabilities, both **fast** and **scalable**. But don't take my word for it, here are some numbers:

| Approach                | Delay    | Fast | Scalable |
| ----------------------- | :------- | :--: | :------: |
| Key combinations        | ~ 10 ms  |  ✔   |    🞭    |
| Single AHK scripts      | ~ 92 ms  |  🞭   |    ✔    |
| *Hotkeyless AutoHotkey* | ~ 55 ms  |  ✔   |    ✔    |

You can make your own *performance tests*. Just have a look at the `performance-tests`-folder!

Also, **Hotkeyless AutoHotkey** enables the execution of AutoHotkey code from other computers in the same local network. And we also provide a **Stream Deck** plugin, that enables calling AHK code by simply pressing a button (and without cluttering up your shortcut list).

## Functionality

**Hotkeyless AHK** launches a lightweight web server. Per default, it listens to the endpoint `localhost:42800/send/*` for http requests and redirects them to the `HotkeylessAHK.ahk` script. Simply put, if you call `localhost:42800/send/HelloWorld`, the `HelloWorld()`-function inside the AHK-file is executed:

```ahk
HelloWorld() {
    MsgBox, Hello World
}
```

Also, you can include your AHK-scripts and define custom functionality in a nice and clean way - without loosing too much performance. You can use your web browser, shortcuts or the [Elgato Stream Deck](https://www.elgato.com/gaming/stream-deck) with the **HotkeylessAHK** plugin. This plugin automatically crawls existing functions and lets you call them easily.

![Stream Deck example](streamdeck.PNG)

## Installation

### HotkeylessAHK

*Note: Requires Windows 10 or newer*

1. Install [AutoHotkey](https://www.autohotkey.com/). Well... if you're reading this, you probably already have.
2. Install node. You can download it from https://nodejs.org/. Make sure that node is in the PATH-variable and available from the console. You can test this by executing `node -v`
3. Clone or download this repository. You can also just head over to [releases](https://github.com/sebinside/HotkeylessAHK/releases)
4. Open a console window and enter the `files` folder. Then, execute `npm i` to install all web server dependencies.
5. Start *Hotkeyless AutoHotkey* by executing the `HotkeylessAHK.ahk`-file.
6. Open your web browser and navigate to `http://localhost:42800/send/HelloWorld`. This should open a message dialog, triggered by the `HotkeylessAHK.ahk`-file.
7. Now, you're ready to go.

*Troubleshooting*: If anything does not work, disable console window hiding by deleting lines 3 and 4 in the `SetupServer()`-method in the `files/lib.ahk`-file and restart the process. This might give you more information.

```
DllCall("AllocConsole")
WinHide % "ahk_id " DllCall("GetConsoleWindow", "ptr")
```

### Elgato Stream Deck Plugin

1. Clone or download this repository or a release of it. You probably already have done this during the installation of **HotkeylessAHK** explained above.
2. Make sure you are using a [Elgato Stream Deck](https://www.elgato.com/gaming/stream-deck) and have the Stream Deck Software installed.
3. Identify the Stream Deck Software plugin folder. On windows, it should be located here: `%appdata%\Elgato\StreamDeck\Plugins\`. Find more information in the [developer documentation](https://developer.elgato.com/documentation/stream-deck/sdk/create-your-own-plugin/).
4. Copy everything inside of the `stream-deck-plugin` folder into the plugin folder of the Stream Deck Software. It should look like this: `%appdata%\Elgato\StreamDeck\Plugins\de.sebinside.hotkeylessahk.sdPlugin`.
5. Restart the Stream Deck Software. The new plugin should appear in your plugin list.

## Usage

Once installed, the usage of **Hotkeyless AutoHotkey** is easy: Write your methods inside the `HotkeylessAHK.ahk`-file (or include other scripts) and call them with your web browser, the `curl`-console command, a stream deck, ...

The endpoint is always the same: `http://localhost:42800/send/YourFunctionNameGoesHere`.

To terminate the running tool, call `http://localhost:42800/send/kill`.

If you're using the [Elgato Stream Deck](https://www.elgato.com/gaming/stream-deck) plugin, you will not have to deal with the internals.

## More

This is yet another small tool to enhance the power of AHK. Some more links, you might find interesting:

- **[AHK2PremiereCEP](https://github.com/sebinside/AHK2PremiereCEP)**, another utility tool from me which helps you connect AutoHotkey with the Adobe Premiere CEP scripting environment. A very helpful tool for video production.
- Taran Van Hemert, a macro specialist: https://www.youtube.com/user/TaranVH
- And my own twitch channel, where I develop with these techniques: https://www.twitch.tv/skate702

If there are more questions, you can contact me on [Twitter](https://twitter.com/skate702) or via [mail](mailto:hi@sebinside.de).
