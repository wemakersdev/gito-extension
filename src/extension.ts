
import * as vscode from 'vscode';
import fetch from "node-fetch";
import {WebSocket} from 'websocket-polyfill/lib/WebSocket';

let recording:any;
let event:vscode.Disposable;

export function activate(context: vscode.ExtensionContext) {

	let startRecording = vscode.commands.registerCommand('gito-new.startRecording', async () => {
		try{
			if(recording){
				throw new Error("Recording is already active");
			}	

			const canRecordAudio = await vscode.commands.executeCommand("gito-new.can-record-audio");

			if(canRecordAudio){
				const audio = await vscode.commands.executeCommand("gito-new.start-audio-recording");

			}
			
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
			
		}catch(err){
			vscode.window.showInformationMessage(`Error: ${err.message}`);
		}
	});

	let playRecording = vscode.commands.registerCommand("gito-new.playRecording", async () => {

		const string = await vscode.window.showInputBox({
			placeHolder: "Enter gito url"
		});
		if(!recording){
			return null;
		}
		event.dispose();
		const delay = (ms:any) => new Promise((res) => setTimeout(res, ms));
		vscode.window.showInformationMessage(`Info: Playing recording`);

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

	});

	let stopRecording = vscode.commands.registerCommand("gito-new.stopRecording", () => {
		vscode.window.showInformationMessage(`Stopped Recording URL: https://bz-upload.xn--lkv.com/bcjh2321/data/232nndfds`);
	});
	handleTerminal(context);

	context.subscriptions.push(startRecording);
	context.subscriptions.push(playRecording);
	context.subscriptions.push(stopRecording);
}

export function deactivate() {


}


function handleTerminal(context:vscode.ExtensionContext){
	vscode.window.onDidOpenTerminal(terminal => {
		console.log("Terminal opened. Total count: " + (<any>vscode.window).terminals.length);
	});
	vscode.window.onDidOpenTerminal((terminal: vscode.Terminal) => {
		vscode.window.showInformationMessage(`onDidOpenTerminal, name: ${terminal.name}`);
	});

	vscode.window.onDidChangeActiveTerminal(e => {
		console.log(`Active terminal changed, name=${e ? e.name : 'undefined'}`);
	});

	const terminalProfile = vscode.window?.registerTerminalProfileProvider("gito-new.gito-terminal", {
		provideTerminalProfile: (cancelationToken: vscode.CancellationToken) => {
			const writeEmitter = new vscode.EventEmitter<string>();
			let terminal:any;
			let ws:any;
			return new vscode.TerminalProfile({
				name: "gito-terminal",
				pty: {
					onDidWrite: writeEmitter.event,
					open: async () => {
						try{
							ws = await createNewTerminal();
							ws.onmessage = (e:any) => writeEmitter.fire(e.data);
						}catch(err){
							writeEmitter.fire(`ERROR! ${err.message}`);
						}
					},
					close: () => {},
					handleInput: (data: string) => {
						if(ws){
							ws.send(data);
						}
					}
				}
			});
		}
	});
	
	context.subscriptions.push(vscode.commands.registerCommand("gito-new.createTerminal", async () => {
		const ws:any = await createNewTerminal();
		const terminal = handleCreateTerminal(ws);
		terminal.show();
	}));

	if(terminalProfile){
		context.subscriptions.push(terminalProfile);
	}
}

function handleCreateTerminal(ws: WebSocket): vscode.Terminal{
	const writeEmitter = new vscode.EventEmitter<string>();
		let line = '';
		ws.onmessage = e => writeEmitter.fire(e.data);
		const pty = {
			onDidWrite: writeEmitter.event,
			open: () => {},
			close: () => { /* noop*/ },
			handleInput: (data: string) => {
				ws.send(data);
			}
		};
		const terminal = (vscode.window).createTerminal({ name: `gito-new`, pty });
		return terminal;
}


function createNewTerminal(){
	return new Promise(async (res, rej) => {
		const response = await fetch("http://localhost:8333/terminals", {
			method: "POST"
		}).then(res => res.text()); 
		const ws = new WebSocket("ws://localhost:8333/terminals/" + response);;

		ws.onopen = () => res(ws);
		ws.onerror = () => rej(ws);
	});
}

function setEditorText(text: string, editor: vscode.TextEditor | undefined) {
    editor?.edit(editBuilder => {
        const pos = new vscode.Position(0, 0);
        const nxt = new vscode.Position(editor?.document.lineCount || 1000, 1000);
        const selections = editor?.selections;
        editBuilder.delete(new vscode.Range(pos, nxt));
        editBuilder.insert(pos, text);
        if (editor && selections) {
            editor.selections = selections;
        }
    });
}
