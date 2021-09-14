
import * as vscode from 'vscode';
import {uid} from "uid";
import { setExtensionContext } from './helpers/context';
import { upload } from './helpers/upload';
import { linkWebsocketToVscodeTerminal, registerTerminalProfile, requestTerminalFromServer } from './helpers/terminal';
import { setEditorText } from './helpers/editor';
import { executeCommand, registerCommand } from './helpers/commands';
import axios from 'axios';

let recording:any;
let audio: any;
let event:vscode.Disposable;

export function activate(context: vscode.ExtensionContext) {
	setExtensionContext(context);

	registerCommand('gito-new.startRecording', async () => {
		try{
			if(recording){
				throw new Error("Recording is already active");
			}
			await executeCommand("gito-new.start-audio-recording");
			
			const activeTextEditor = vscode.window.activeTextEditor;
			const text = activeTextEditor?.document.getText();
			const fileName = activeTextEditor?.document.fileName;
			const visibleRange = activeTextEditor?.visibleRanges;
			recording = [];

			recording.push({
				text, fileName, timestamp: Date.now(),visibleRange
			});

			event = vscode.workspace.onDidChangeTextDocument((event) => {
				const changes = event.contentChanges;
				const fileName = event.document.fileName;
				const visibleRange = activeTextEditor?.visibleRanges;
				recording.push({
					changes, 
					fileName,
					timestamp: Date.now(),
					visibleRange
				});
			});
			vscode.window.showInformationMessage(`Info: Started Recording`);
			
		}catch(err:any){
			vscode.window.showInformationMessage(`Error: ${err.message}`);
		}
	});

	registerCommand("gito-new.playRecording", async () => {

		try{
			const string:any = await vscode.window.showInputBox({
				placeHolder: "Enter gito url"
			});
			const data = await axios.get(string).then(res => res.data);
	
			recording = data.recording;
			audio = data.audio

		}catch(err){
			console.error(err)
		}

		if(!recording){
			return null;
		}
		event.dispose();
		const delay = (ms:any) => new Promise((res) => setTimeout(res, ms));
		vscode.window.showInformationMessage(`Info: Playing recording`);

		try{
			await vscode.commands.executeCommand("gito-new.play-audio", audio)
	
			for(let i = 0; i < recording.length; i++){
				const item:any = recording[i];
	
				if(item.text){
					setEditorText(item.text, vscode.window.activeTextEditor);
				}
	
				if(item.changes){
					item.changes.forEach((item:any) => {
						vscode.window.activeTextEditor?.edit((editor)=> {
							editor.replace(item.range, item.text);
						});
					});
				}
				if(i > 1){
					const prevItem:any = recording[i-1];
					await delay(item.timestamp - prevItem.timestamp);
				}
			}
	
			recording = null;
	
			vscode.window.showInformationMessage(`Info: Completed Playing`);

		}catch(err: any){
			console.log(`error: ${err.message}`)
		}

	});

	registerCommand("gito-new.stopRecording", async () => {
		try{
			audio = await executeCommand("gito-new.stop-audio-recording");
	
			const temp:any = {
				recording,
				audio
			};
	
			const res = await upload(temp, {
				fileName: uid(16),
				folder: "data"
			});
	
			vscode.window.showInformationMessage(`Stopped Recording URL: ${res}`);
		}catch(err:any){
			debugger
		}
	});


	handleTerminal(context);
}

export function deactivate() {



}

function chunkString(str:any, length:any) {
  return str.match(new RegExp('.{1,' + length + '}', 'g'));
}

function handleTerminal(context:vscode.ExtensionContext){
	const terminalProfile = registerTerminalProfile();
	terminalProfile && context.subscriptions.push(terminalProfile);
	
	registerCommand("gito-new.createTerminal", async () => {
		const ws = await requestTerminalFromServer();
		const terminal = linkWebsocketToVscodeTerminal(ws);
		terminal.show();
	});
}




