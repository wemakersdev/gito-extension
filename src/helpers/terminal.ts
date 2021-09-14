import * as vscode from 'vscode';
import { TERMINAL_SERVER_URL } from './constants';

function linkWebsocketToVscodeTerminal(ws: WebSocket): vscode.Terminal{
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


function requestTerminalFromServer():Promise<WebSocket>{
	return new Promise(async (res, rej) => {
		const response = await fetch(`${TERMINAL_SERVER_URL}/terminals`, {
			method: "POST"
		}).then(res => res.text()); 


		const terminalServerUrlWs = TERMINAL_SERVER_URL.replace("https", "ws");
		const ws = new WebSocket(`${terminalServerUrlWs}/terminals/${response}`);

		ws.onopen = () => res(ws);
		ws.onerror = () => rej(ws);
	});
}


function registerTerminalProfile():vscode.Disposable{
	return vscode.window.registerTerminalProfileProvider("gito-new.gito-terminal", {
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
							ws = await requestTerminalFromServer();
							ws.onmessage = (e:any) => writeEmitter.fire(e.data);
						}catch(err:any){
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
}

export {
	linkWebsocketToVscodeTerminal,
	requestTerminalFromServer,
	registerTerminalProfile
}