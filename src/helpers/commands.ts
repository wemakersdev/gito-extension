
import {commands, Disposable} from 'vscode';
import { getExtensionContext } from './context';

function registerCommand(command: string, callback: () => {}): Disposable {
	const context = getExtensionContext();
	const disposable = commands.registerCommand(command, callback);

	context.subscriptions.push(disposable);
	return disposable;
}

async function hasCommand(command: string): Promise<boolean>{
	const result:string|undefined = await findCommand(command);
	return !!result;
}

async function findCommand(command: string): Promise<string|undefined>{
	const _commands = await commands.getCommands();
	return _commands.find((commandStr: string) => commandStr === command);
}

async function executeCommand(command: string, ...args:any): Promise<unknown|null>{
	try{
		return await commands.executeCommand(command, ...args);
	}catch(err: any){
		console.log(err.message);
		return null;
	}
}

export {
	registerCommand,
	executeCommand
};