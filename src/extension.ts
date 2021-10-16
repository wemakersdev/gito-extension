
import * as vscode from 'vscode';
import { uid } from "uid";
import { getPlaybackSpeedContext, setExtensionContext, setStatusBarItemsContext, setPlaybackSpeedContext, setGlobalStoreContext } from './helpers/context';
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
import { GlobalStore } from './helpers/globalStore';
import { getUserInput } from './helpers/userInput';
import { CatCodingPanel, getWebviewOptions } from './helpers/webview';
import { BlogViewProvider } from './views/BlogView';
import { registerBlogEditorContentProvider } from './contentProvider/blogEditor';

let recording: any;

export function activate(context: vscode.ExtensionContext) {

	setExtensionContext(context);
	registerTextDocumentContentProvider();
	registerBlogEditorContentProvider();
	const statusBarItems = initStatusBar();
	const globalStore = new GlobalStore(context);
	setStatusBarItemsContext(statusBarItems);
	setGlobalStoreContext(globalStore);

	vscode.window.registerTreeDataProvider("workspace-gitos", new GitoExplorerProvider(context));
	vscode.window.registerTreeDataProvider("blog-view", new BlogViewProvider(context));


	registerCommand('gito-new.startRecording', async () => {
		try {
			if(!recording){
				const name = await getUserInput("Enter a name for your gito", "name for gito");
				recording = await recordGito({
					name 
				});
				statusBarItems.handleRecordingStartUpdate();
				vscode.window.showInformationMessage(`Info: Started Recording`);
			}else{
				await recording.stop();
				await recording.upload();
				statusBarItems.handleRecordingStopUpdate();
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
		await recording.upload();
		recording = undefined;
	});
	
	registerCommand('gito-new.start-cat-coding', async () => {
		CatCodingPanel.createOrShow(context.extensionUri);
	});

	registerCommand('gito-new.do-refactor', async () => {
		if (CatCodingPanel.currentPanel) {
			CatCodingPanel.currentPanel.doRefactor();
		}
	});

	if (vscode.window.registerWebviewPanelSerializer) {
		// Make sure we register a serializer in activation event
		vscode.window.registerWebviewPanelSerializer(CatCodingPanel.viewType, {
			async deserializeWebviewPanel(webviewPanel: vscode.WebviewPanel, state: any) {
				console.log(`Got state: ${state}`);
				webviewPanel.webview.options = getWebviewOptions(context.extensionUri);
				CatCodingPanel.revive(webviewPanel, context.extensionUri);
			}
		});
	}
	
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




