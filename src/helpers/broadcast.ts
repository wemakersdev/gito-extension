
import { ExtensionContext } from 'vscode';
const CHANNEL_NAME = "gito-broadcast-channel"

export const broadcastMessageHandler = (context: ExtensionContext) => {
	const channel = new BroadcastChannel(CHANNEL_NAME);
	channel.addEventListener('message', (event) => {
		console.log({event});
		console.log("homepage button triggered");
	});
};