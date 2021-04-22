
export const OUTPUT_CHANNEL_NAME = "UE Docs Search";

export const MAX_SEARCH_LENGTH = 50;
export const DEFAULT_OFFSET = '0';

export const searchUrlUE4Docs = "https://www.unrealengine.com/bing-search";

export enum UE4QueryType {
	cpp = "C++ API",
	blueprints = "Blueprint API",
	documentation = "Documentation",
	answers = "Answers",
	forums = "Forums"
}


export type UE4Query = {
	keyword: string,
	offset: string,
	filter: UE4QueryType
};

export enum OS {
    win32 = "win32",
    darwin = "darwin",
    default = "default"
}


export enum OpenType {
    extension = "extension",
    chrome = "chrome",
    firefox = "firefox",
    chromiumBrowser = "chromium-browser",
    opera = "opera",
    msedge = "msedge",
    xdgOpen = "xdg-open",
    safari = "safari"
};


export type OpenSetting = {
	keyword: string,
	offset: string,
	filter: UE4QueryType
};


export enum Win32Opener {
    start = "start"
}

export enum DarwinOpener {
    open = "open"
}

// ref https://askubuntu.com/questions/234663/what-command-should-i-type-to-run-chrome-from-the-terminal
export enum DefaultOpener {
    xdgOpen = "xdg-open",
    chrome = "google-chrome",
    chromiumBrowser = "chromium-browser",
    opera = "opera",
    firefox = "firefox"
}

export enum Win32App {
    none = `""`,
    firefox = "firefox",
    chrome = "chrome",
    msedge = "msedge",
}

// ref https://stackoverflow.com/questions/5721528/terminal-command-to-open-safari
export enum DarwinApp {
    none = "",
    safari = `-a Safari`,
    chrome = `-a "Google Chrome"`,
    firefox = `-a firefox`
}

export enum DefaultApp {
    none = ""
}

export type URLCommand<O = Win32Opener|DarwinOpener|DefaultOpener, A = Win32App|DarwinApp|DefaultApp> = {
    opener: O,
    app: A
};

export type Win32UrlCommand = Record<OpenType, URLCommand<Win32Opener, Win32App>>;
export type DarwinUrlCommand = Record<OpenType, URLCommand<DarwinOpener, DarwinApp>>;
export type DefaultUrlCommand = Record<OpenType, URLCommand<DefaultOpener, DefaultApp>>;
