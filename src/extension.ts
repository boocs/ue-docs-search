
import * as vscode from 'vscode';
import {exec} from 'child_process';
import { URL, URLSearchParams } from 'url';


const MAX_SEARCH_LENGTH = 50;
const DEFAULT_OFFSET = '0';

const searchUrlUE4Docs = "https://www.unrealengine.com/bing-search";

enum UE4QueryType {
	cpp = "C++ API",
	blueprints = "Blueprint API",
	documentation = "Documentation",
	answers = "Answers",
	forums = "Forums"
}


type UE4Query = {
	keyword: string,
	offset: string,
	filter: UE4QueryType
};


export function activate(context: vscode.ExtensionContext) {

	console.log('Extension "ue4-docs-search" is now active!');

	let disposable = vscode.commands.registerCommand('ue4-docs-search.documentation', (args: any[]) => {
		const test = args;
		search(UE4QueryType.documentation);
	});
	context.subscriptions.push(disposable);

	disposable = vscode.commands.registerCommand('ue4-docs-search.cppApi', (args: any[]) => {
		const test = args;
		search(UE4QueryType.cpp);
	});
	context.subscriptions.push(disposable);

	disposable = vscode.commands.registerCommand('ue4-docs-search.blueprintsApi', (args: any[]) => {
		const test = args;
		search(UE4QueryType.blueprints);
	});
	context.subscriptions.push(disposable);

	disposable = vscode.commands.registerCommand('ue4-docs-search.answers', (args: any[]) => {
		const test = args;
		search(UE4QueryType.answers);
	});
	context.subscriptions.push(disposable);

	disposable = vscode.commands.registerCommand('ue4-docs-search.forums', (args: any[]) => {
		const test = args;
		search(UE4QueryType.forums);
	});
	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }


async function search(queryType: UE4QueryType) {
	
	const searchText = getCurrentSelection();
	if(!searchText){
		return;
	}

	const ue4Query : UE4Query =  {
		keyword:searchText,
		offset:DEFAULT_OFFSET,
		filter:queryType 
	};

	const urlSearchParams = new URLSearchParams(ue4Query);
	const url = new URL(searchUrlUE4Docs);

	url.search = urlSearchParams.toString();

	openURL(url);
	
}


function getCurrentSelection(charLimit = MAX_SEARCH_LENGTH): string | undefined {
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


/**
 * ref: https://stackoverflow.com/questions/34205481/how-to-open-browser-from-visual-studio-code-api
 * @param url 
 * @returns 
 */
function openURL(url: URL) {
	let opener;
	let urlString = url.toString().replace(/"/g, '\\\"');  
	let app = "";

	switch (process.platform) {
	  case 'darwin':
		opener = 'open';
		break;
	  case 'win32':
		opener = 'start';
		app = `""`;
		break;
	  default:
		opener = 'xdg-open';
		break;
	}
  
	return exec(`${opener} ${app} "${urlString}"`);
}
