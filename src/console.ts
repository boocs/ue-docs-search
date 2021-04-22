/**
 * Override for console so it shows console messages for both developer and user
 */

import * as vscode from 'vscode';

// If debugging set this to true;
const IS_DEBUG = false;

let outputChannel: vscode.OutputChannel;


export function log(message: string) {

    if(IS_DEBUG){  console.log(message); }

    outputChannel?.appendLine(message);
}

export function error(message: string) {

    if(IS_DEBUG){  console.error(message); }

    outputChannel?.appendLine("*** Error: ".concat(message));
    outputChannel?.show();
}

export function createOutputChannel(name: string){
    outputChannel = vscode.window.createOutputChannel(name);
}

export function disposeOutputChannel(){
    outputChannel?.dispose();
}

export function show(preserveFocus = true) {
    outputChannel?.show(preserveFocus);
}
