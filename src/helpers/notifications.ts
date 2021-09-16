
import * as vscode from 'vscode';

function inform(text: string): Thenable<string|undefined>{
	return vscode.window.showInformationMessage(text);
}

export {
	inform
}