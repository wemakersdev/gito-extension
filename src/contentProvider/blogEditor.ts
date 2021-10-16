import * as vscode from 'vscode';
import { getExtensionContext, getGitoContext } from './../helpers/context';
// import { IGitoRecordingItem } from './recorder';


let emitter = new vscode.EventEmitter();

function registerBlogEditorContentProvider() {

	const extensionContext = getExtensionContext();

	const myScheme = "blog-editor";
	const myProvider = new class implements vscode.FileSystemProvider {
		onDidChangeFile(...args:any):any{}
		readDirectory(...args:any):any{}
		createDirectory(...args:any):any{}
		writeFile(...args:any):any{}
		delete(...args:any):any{}
		rename(...args:any):any{}
		// (...args:any):any{}

		watch(uri: vscode.Uri, {exclude, recursive}:any): any{
			return new vscode.Disposable(() => {});
		}

		stat(uri: vscode.Uri): vscode.FileStat{
			return {
				ctime: Date.now(),
				mtime: Date.now(),
				size: 10000,
				type: vscode.FileType.File
			};
		}

		readFile(uri: vscode.Uri): Uint8Array {

			return Buffer.from("helllof rom lsakdsad");
		}
	};

	extensionContext.subscriptions.push(vscode.workspace.registerFileSystemProvider(myScheme, myProvider));
}

export {
	registerBlogEditorContentProvider
}