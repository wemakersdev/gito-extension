
import * as vscode from 'vscode';
const CHANNEL_NAME = "gito-broadcast-channel"

export const broadcastMessageHandler = (context: vscode.ExtensionContext) => {
	try{
		const channel = new BroadcastChannel(CHANNEL_NAME);
		channel.addEventListener('message', (event) => {
			console.log({eventData: event.data});
			switch(event.data){
				case "open-dashboard":{
					vscode.commands.executeCommand("gito-new.start-cat-coding");
					return;
				}
			}
		});

	}catch(err){
		console.error(err)
	}
};