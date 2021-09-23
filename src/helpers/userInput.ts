import * as vscode from 'vscode';
const randomWords = require("random-words");

export async function getUserInput(title:string, placeHolder: string){
	try{
		return await vscode.window.showInputBox({
			placeHolder,
			value: randomWords(3, {exactly: 3}).join("-"),
			title
		});

	}catch(err){
		throw err;
	}
}