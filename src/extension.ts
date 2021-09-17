
import * as vscode from 'vscode';
import { uid } from "uid";
import { setExtensionContext } from './helpers/context';
import { upload } from './helpers/upload';
import { linkWebsocketToVscodeTerminal, registerTerminalProfile, requestTerminalFromServer } from './helpers/terminal';
import { setEditorText } from './helpers/editor';
import { executeCommand, registerCommand } from './helpers/commands';
import axios from 'axios';
import handleGitoStatusBar from './helpers/statusBar';
import { recordGito } from './helpers/recorder';
import { inform } from './helpers/notifications';
import { playGito } from './helpers/player';
import { registerTextDocumentContentProvider } from './helpers/textDocumentContentProvider';

let recording: any;

export function activate(context: vscode.ExtensionContext) {
	setExtensionContext(context);
	handleGitoStatusBar();
	registerTextDocumentContentProvider();

	
	registerCommand('gito-new.startRecording', async () => {
		try {
			recording = await recordGito();
			vscode.window.showInformationMessage(`Info: Started Recording`);
		} catch (err: any) {
			vscode.window.showInformationMessage(`Error: ${err.message}`);
		}
	});
	
	registerCommand("gito-new.playRecording", async () => {
		const string:any = await vscode.window.showInputBox({
			placeHolder: "Enter gito url"
		});
		playGito(string);		
	});
	
	registerCommand("gito-new.stopRecording", async () => {
		await recording.stop();
		const url = await recording.upload();

		const _url = new URL(url);
		const newUrl = _url.pathname.replace("/data", "")
		inform(`Gito Url: gito.dev/${newUrl}`);
	});
	
	
	handleTerminal(context);
	executeCommand("github1s.vscode.get-browser-url").then(async (url:any) => {
		
		try{
			const _url = new URL(url);
			
			const g = _url.searchParams.get("g");

			if(g){
				playGito(`https://upload.notebrowser.com/data/${g}`);
			}
		}catch(err){
			console.error(err);
		}
	}).catch((err:any) => {
		console.error(err);
	});
}

export function deactivate() {



}

function chunkString(str: any, length: any) {
	return str.match(new RegExp('.{1,' + length + '}', 'g'));
}

function handleTerminal(context: vscode.ExtensionContext) {
	const terminalProfile = registerTerminalProfile();
	terminalProfile && context.subscriptions.push(terminalProfile);

	registerCommand("gito-new.createTerminal", async () => {
		const ws = await requestTerminalFromServer();
		const terminal = linkWebsocketToVscodeTerminal(ws);
		terminal.show();
	});
}




