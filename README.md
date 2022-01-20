# VSCode extension: Unreal Engine docs search

[https://github.com/boocs/ue-docs-search](https://github.com/boocs/ue-docs-search)

Opens web browser and searches hightlighted VSCode document text in the Unreal Engine docs, answers, or forums.

---
### Contents
[OS Support](#OS-support)

[Requirements](#Requirements)

[Installation](#Installation)

[How to use](#How-to-use)

[Settings](#Settings)

[Known Issues](#Known-Issues)

[Request browser](#Request-browser)

[VSCode API](#VSCode-API)

---

## OS support
#### Windows 10 Tested
##### Browsers Supported:
Firefox, Chrome, MSEdge,  default browser

###### Default setting:
[openType](#Settings): extension (default browser)

###### Uses terminal command: (start app "url")

#### Linux (Ubuntu 20.04 Tested)
##### Browsers Supported:
Chromium Browser, Firefox(**[see Known issues](##Ubuntu-20.04)**), Chrome, Opera, default browser

###### Default setting:
[openType](#Settings): extension (Chromium Browser)

Use the **openType**: xdg-open to use your default browser (**[see Known issues](##Ubuntu-20.04)**)

###### Uses terminal command: (app "url") and (xdg-open "url")

#### Mac (Not tested so let me know of any strange behaviour)

##### Browsers Supported:
Safari, Firefox, Chrome, default browser

###### Default setting:
[openType](#Settings): extension (default browser)

###### Uses terminal command: (open "url") and (open -a app "url")

## Requirements
1. Unreal Engine project
2. Supported Web browser

## Installation
1. Download the VSIX file from Releases on this GitHub (**note:** file version may differ)

![](https://gist.githubusercontent.com/boocs/f59bdd017ca4ab55e83c7cba24ee4a4d/raw/d33e95c92dc586ece3d2e5386c314b8904ea43cb/download.gif)

2. Click VSCode's Extensions icon
3. Click the elipse (3 dots) in upper right of left panel
4. Choose Install from VSIX...

![](https://gist.githubusercontent.com/boocs/f59bdd017ca4ab55e83c7cba24ee4a4d/raw/dd8acf46e900055b4b7356ab23ba79de855d76c3/install.gif)

5. Choose the VSIX file you downloaded


## How to use

1. Highlight text
2. Right click, on the selection, for context menu (**note:** menu won't appear unless text is highlighted)
3. Choose any search option

![](https://gist.githubusercontent.com/boocs/f59bdd017ca4ab55e83c7cba24ee4a4d/raw/87b5aea1a084309fe5c77654d68af0ccc216364e/instructions.gif)

4. It should open a search in your default browser

![](https://gist.githubusercontent.com/boocs/f59bdd017ca4ab55e83c7cba24ee4a4d/raw/87b5aea1a084309fe5c77654d68af0ccc216364e/searchedInDefaultBrowser.JPG)

## Settings

1. Max search length is 50 characters (larger searches will be reduced)
2. The **Open Type** can be set in User settings:
![](https://gist.githubusercontent.com/boocs/f59bdd017ca4ab55e83c7cba24ee4a4d/raw/53d41c4db28a577b061af4161f1f5cf39472bdcb/settings.gif)
## Known Issues

#### Ubuntu 20.04
1. Firefox will crash if not already open. Please use another browser if you experience this.
  **Tested using Firefox version** (87.0+build3-0ubuntu0.20.04.2)

2. This could be my system but if the browser, you're using, hadn't ever been opened it was slow to load. **Every time after was fine.**

## Release Notes

### v1.0.1
- Fix extension startup bug

### v1.0.0
- Added openType setting which allows you to select a specific web browser to use
- linux: changed default openType to chromium-browser (because of Firefox crash)

### v0.9.0

- Initial beta release

## Request browser
#### Feel free to request a specific OS/Web Browser

Remember that the **openType** setting will allow you to use your default browser.

For Windows/Mac use **openType**: extension

For Linux use **openType**: xdg-open

## VSCode API

I'm not using the VSCode API to open web browsers because of the known double encoding URL issue in the VSCode API. It affected this extension.

---
[Back To Top](#Contents)
