
import * as vscode from 'vscode';
const CHANNEL_NAME = "gito-broadcast-channel"

export const broadcastMessageHandler = (context: vscode.ExtensionContext) => {
	const channel = new BroadcastChannel(CHANNEL_NAME);
	channel.addEventListener('message', (event) => {
		switch(event.data){
			case "open-dashboard":{
				vscode.commands.executeCommand("gito-new.start-cat-coding");
				return;
			}
		}
	});
 
};