
import * as vscode from 'vscode';
import * as chP from 'child_process';
import { URL, URLSearchParams } from 'url';

import * as consts from "./consts";
import { OpenType, Win32UrlCommand, Win32App, Win32Opener, DarwinApp, DarwinOpener, DarwinUrlCommand, DefaultApp, DefaultOpener, DefaultUrlCommand } from "./consts";

import * as console from "./console";

export function activate(context: vscode.ExtensionContext) {

	console.createOutputChannel(consts.OUTPUT_CHANNEL_NAME);
	console.log('Extension "UE Docs Search" is now active!');

	let disposable = vscode.commands.registerCommand('ueDocsSearch.documentation', (args: any[]) => {
		search(consts.UE4QueryType.documentation);
	});
	context.subscriptions.push(disposable);

	disposable = vscode.commands.registerCommand('ueDocsSearch.cppApi', (args: any[]) => {
		search(consts.UE4QueryType.cpp);
	});
	context.subscriptions.push(disposable);

	disposable = vscode.commands.registerCommand('ueDocsSearch.blueprintsApi', (args: any[]) => {
		search(consts.UE4QueryType.blueprints);
	});
	context.subscriptions.push(disposable);

	disposable = vscode.commands.registerCommand('ueDocsSearch.answers', (args: any[]) => {
		search(consts.UE4QueryType.answers);
	});
	context.subscriptions.push(disposable);

	disposable = vscode.commands.registerCommand('ueDocsSearch.forums', (args: any[]) => {
		search(consts.UE4QueryType.forums);
	});
	context.subscriptions.push(disposable);

}

// this method is called when your extension is deactivated
export function deactivate() { 
	console.disposeOutputChannel();
}


async function search(queryType: consts.UE4QueryType) {

	const searchText = getCurrentSelection();
	if (!searchText) {
		return;
	}

	const ue4Query: consts.UE4Query = {
		keyword: searchText,
		offset: consts.DEFAULT_OFFSET,
		filter: queryType
	};

	const urlSearchParams = new URLSearchParams(ue4Query);
	const url = new URL(consts.searchUrlUE4Docs);

	url.search = urlSearchParams.toString();

	openURL(url, getOpenTypeSetting());
}


function getCurrentSelection(charLimit = consts.MAX_SEARCH_LENGTH): string | undefined {
	const activeTextEditor = vscode.window.activeTextEditor;

	if (!activeTextEditor) {
		return;
	}

	const selectionRange = activeTextEditor.selection;

	if (!selectionRange || selectionRange.isEmpty) {
		return;
	}

	let selectionText = activeTextEditor.document.getText(selectionRange);

	if (selectionText.length > charLimit) {
		selectionText = selectionText.substr(0, charLimit);
	}

	return selectionText;
}

function getOpenTypeSetting(): OpenType {
	let openType: OpenType | null | undefined = vscode.workspace.getConfiguration("ueDocsSearch")?.get("openType");


	if (openType === null || openType === undefined) {
		console.log("Error: Couldn't get openType setting! Using defaults.");
		console.show();
		openType = OpenType.extension;
	}

	return openType;
}

/**
 * ref: https://stackoverflow.com/questions/34205481/how-to-open-browser-from-visual-studio-code-api
 * @param url 
 * @returns 
 */
function openURL(url: URL, openType: consts.OpenType) {


	let urlString = url.toString().replace(/"/g, '\\\"');

	let urlCommand: consts.URLCommand | undefined;

	switch (process.platform as consts.OS) {
		case consts.OS.darwin:
			urlCommand = getUrlCommand(consts.OS.darwin, openType);
			break;
		case consts.OS.win32:
			urlCommand = getUrlCommand(consts.OS.win32, openType);
			break;
		default:
			urlCommand = getUrlCommand(consts.OS.default, openType);
			if (hasInvalidLinuxOpener(urlCommand?.opener as DefaultOpener | undefined)) {
				return;
			}
			break;
	}

	if (!urlCommand) {
		console.error(`Couldn't get url command for ${process.platform}/${openType}!`);
		console.error("Please tell the developer if you get this message.");
		console.log("Trying a different openType, in the settings, can workaround this bug.");
		console.show();
		return;
	}


	const execLine = `${urlCommand.opener} ${urlCommand.app} "${urlString}"`;
	try {
		return chP.exec(execLine, (stdout, stderr) => {
			if (stdout?.message || stderr) {

				console.log("\nDetails:");
				if(stdout?.message){
					console.log(`${stdout.message}`);
				}
				console.log(`Error: Browser is most likely not installed: (${urlCommand?.opener} ${urlCommand?.app})`);
				console.log("Choose a different browser in the settings.");
				console.show();
			}
		});
	} catch (error) {
		console.error(`Exception handled: ${error.message}`);
		console.error(execLine);
		console.error("Let the developer know if you get this message.");
		console.log("Trying a different openType, in the settings, can workaround this bug.");
		console.show();
		return;
	}

}

function getUrlCommand(os: consts.OS, openType: OpenType): consts.URLCommand | undefined {

	let urlCommand: consts.URLCommand;

	if (os === consts.OS.win32) {
		const win32UrlCommand: Win32UrlCommand = {
			[OpenType.extension]: { opener: Win32Opener.start, app: Win32App.none },
			[OpenType.chrome]: { opener: Win32Opener.start, app: Win32App.chrome },
			[OpenType.firefox]: { opener: Win32Opener.start, app: Win32App.firefox },
			[OpenType.chromiumBrowser]: { opener: Win32Opener.start, app: Win32App.none },
			[OpenType.opera]: { opener: Win32Opener.start, app: Win32App.none },
			[OpenType.msedge]: { opener: Win32Opener.start, app: Win32App.msedge },
			[OpenType.xdgOpen]: { opener: Win32Opener.start, app: Win32App.none },
			[OpenType.safari]: { opener: Win32Opener.start, app: Win32App.none }
		};


		urlCommand = win32UrlCommand[openType];
	}
	else if (os === consts.OS.darwin) {

		const darwinUrlCommand: DarwinUrlCommand = {
			[OpenType.extension]: { opener: DarwinOpener.open, app: DarwinApp.none },
			[OpenType.chrome]: { opener: DarwinOpener.open, app: DarwinApp.chrome },
			[OpenType.firefox]: { opener: DarwinOpener.open, app: DarwinApp.firefox },
			[OpenType.chromiumBrowser]: { opener: DarwinOpener.open, app: DarwinApp.none },
			[OpenType.opera]: { opener: DarwinOpener.open, app: DarwinApp.none },
			[OpenType.msedge]: { opener: DarwinOpener.open, app: DarwinApp.none },
			[OpenType.xdgOpen]: { opener: DarwinOpener.open, app: DarwinApp.none },
			[OpenType.safari]: { opener: DarwinOpener.open, app: DarwinApp.safari }
		};

		urlCommand = darwinUrlCommand[openType];
	}
	else {

		const defaultUrlCommand: DefaultUrlCommand = {
			[OpenType.extension]: { opener: DefaultOpener.chromiumBrowser, app: DefaultApp.none },
			[OpenType.chrome]: { opener: DefaultOpener.chrome, app: DefaultApp.none },
			[OpenType.firefox]: { opener: DefaultOpener.firefox, app: DefaultApp.none },
			[OpenType.chromiumBrowser]: { opener: DefaultOpener.chromiumBrowser, app: DefaultApp.none },
			[OpenType.opera]: { opener: DefaultOpener.opera, app: DefaultApp.none },
			[OpenType.msedge]: { opener: DefaultOpener.chromiumBrowser, app: DefaultApp.none },
			[OpenType.xdgOpen]: { opener: DefaultOpener.xdgOpen, app: DefaultApp.none },
			[OpenType.safari]: { opener: DefaultOpener.chromiumBrowser, app: DefaultApp.none }
		};

		urlCommand = defaultUrlCommand[openType];
	}

	return urlCommand;
}


/**
 * 
 * @param opener 
 * @returns 
 */
function hasInvalidLinuxOpener(opener: consts.DefaultOpener | undefined): boolean {
	if(!opener){
		return false;  // we handle a invalid opener elsewhere
	}

	let buffer: Buffer | undefined;
	try {
		buffer = chP.execSync(`command -v ${opener}`);
	}
	catch (error) {
		buffer = undefined;
	}

	if (!buffer) {
		console.log(`Error: ${opener} not found.`);
		console.log("Choose a different open type in the settings.");
		console.show();

		return true;
	}
	
	return false;
}
