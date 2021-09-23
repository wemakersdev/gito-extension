
import * as vscode from 'vscode';
import { uid } from "uid";
import { getPlaybackSpeedContext, setExtensionContext, setStatusBarItemsContext, setPlaybackSpeedContext } from './helpers/context';
import { upload } from './helpers/upload';
import { linkWebsocketToVscodeTerminal, registerTerminalProfile, requestTerminalFromServer } from './helpers/terminal';

import { executeCommand, registerCommand } from './helpers/commands';

import {initStatusBar} from './helpers/statusBar';
import { recordGito } from './helpers/recorder';
import { inform } from './helpers/notifications';
import { playGito } from './helpers/player';
import { registerTextDocumentContentProvider } from './helpers/textDocumentContentProvider';
import startRecording from './commands/recording/start';
import { GitoExplorerProvider } from './views/GitoExplorer';

let recording: any;

export function activate(context: vscode.ExtensionContext) {

	setExtensionContext(context);
	registerTextDocumentContentProvider();
	const statusBarItems = initStatusBar();
	setStatusBarItemsContext(statusBarItems);

	vscode.window.registerTreeDataProvider("gito-files", new GitoExplorerProvider("asdas"));


	registerCommand('gito-new.startRecording', async () => {
		try {
			if(!recording){

				recording = await recordGito();
				statusBarItems.handleRecordingStartUpdate();
				vscode.window.showInformationMessage(`Info: Started Recording`);
			}else{
				await recording.stop();
				const url = await recording.upload();
				statusBarItems.handleRecordingStopUpdate()
				const _url = new URL(url);
				const newUrl = _url.pathname.replace("/data/", "")
				inform(`Gito Url: gito.dev/${newUrl}`, [{
					string: "Copy url",
					callback: async () =>{
						await executeCommand("gito-new.copy-to-clipboard", `gito.dev/${newUrl}`);	
						inform(`Copied!`);
					}
				}]);
				recording = undefined;
			}
		} catch (err: any) {
			vscode.window.showInformationMessage(`Error: ${err.message}`);
		}
	});
	
	registerCommand("gito-new.playRecording", async () => {
		let string:any = await vscode.window.showInputBox({
			placeHolder: "Enter gito url"
		});

		if(string && string.includes("gito.dev/")){
			string = string.replace("gito.dev/", "upload.notebrowser.com/data/");
			if(!string.includes("https://")){
				string = `https://${string}`;
				
			}
		}


		playGito(string);		
	});

	registerCommand("gito-new.create-gito-voice-room", async () => {
		const roomId = uid();
		inform(`Successfully created room: ${roomId}`, [{
			string: "Copy Room ID",
			callback: async () =>{
				await executeCommand("gito-new.copy-to-clipboard", roomId);	
				inform(`Copied!`);
			}
		}]);
		
		executeCommand(`gito-new.create-room`, roomId);
	});

	registerCommand("gito-new.increasePlaybackSpeed", async () => {
		let speed = getPlaybackSpeedContext();
		speed = speed*2 > 32 ? 1 : speed*2;
		setPlaybackSpeedContext(speed);
		
		const item = statusBarItems.get("speed")

		if(item){
			item.text = `speed: ${speed}x`;
		}
	});

	registerCommand("gito-new.join-gito-voice-room", async () => {
		const roomId:any = await vscode.window.showInputBox({
			placeHolder: "Enter Room ID"
		});
		executeCommand(`gito-new.join-room`, roomId);
		inform(`Joining room: ${roomId}`);
	});

	registerCommand("gito-new.leave-gito-voice-room", async () => {
		const roomId:any = await vscode.window.showInputBox({
			placeHolder: "Enter Room ID"
		});	
		executeCommand(`gito-new.leave-room`, roomId);

		inform(`Leaving gito voice room: ${roomId}`, [{
			string: "confirm",
			callback: () => {
				inform(`left gito voice room`)
			}
		}]);
	});
	
	registerCommand("gito-new.stopRecording", async () => {
		statusBarItems.handleRecordingStopUpdate();
		await recording.stop();
		const url = await recording.upload();

		const _url = new URL(url);
		const newUrl = _url.pathname.replace("/data/", "")
		inform(`Gito Url: gito.dev/${newUrl}`, [{
			string: "Copy url",
			callback: async () =>{
				await executeCommand("gito-new.copy-to-clipboard", `gito.dev/${newUrl}`);	
				inform(`Copied!`);
			}
		}]);

		recording = undefined
	});
	
	
	handleTerminal(context);
	executeCommand("github1s.vscode.get-browser-url").then(async (url:any) => {	
		try{
			if(!url) {
				return;
			}
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




