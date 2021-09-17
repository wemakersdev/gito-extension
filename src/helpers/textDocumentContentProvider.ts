import * as vscode from 'vscode';
import { getExtensionContext, getGitoContext } from './context';
import { IGitoRecordingItem } from './recorder';


let emitter = new vscode.EventEmitter();

function registerTextDocumentContentProvider() {

	const extensionContext = getExtensionContext();

	const myScheme = "gito";

	// const myProvider = new class implements vscode.TextDocumentContentProvider {
	// 	onDidChangeEmitter = new vscode.EventEmitter<vscode.Uri>();
	// 	onDidChange = this.onDidChangeEmitter.event;

	// 	provideTextDocumentContent(uri: vscode.Uri): string {
	// 		const context = getGitoContext();
	// 		const item = context.recording.find((recordingItem: IGitoRecordingItem) => {
	// 			if (uri && uri.path && uri.path === recordingItem.fileName && recordingItem.type === "EDITOR_CHANGE" || "INITIAL_STATE") {
	// 				return true;
	// 			} else {
	// 				return false;
	// 			}
	// 		});
	// 		// debugger

	// 		if (item && item.fileContent) {
	// 			return item.fileContent;
	// 		}

	// 		return `Problem in creating file`;
	// 	}
	// };

	const myProvider = new class implements vscode.FileSystemProvider {
		onDidChangeFile(...args:any):any{}
		readDirectory(...args:any):any{}
		createDirectory(...args:any):any{}
		writeFile(...args:any):any{}
		delete(...args:any):any{}
		rename(...args:any):any{}
		// (...args:any):any{}

		watch(uri: vscode.Uri, {exclude, recursive}:any): any{
			return new vscode.Disposable(() => {})
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
			const context = getGitoContext();
			const item = context.recording.find((recordingItem: IGitoRecordingItem) => {
				if (uri && uri.path && uri.path === recordingItem.fileName && recordingItem.type === "EDITOR_CHANGE" || "INITIAL_STATE") {
					return true;
				} else {
					return false;
				}
			});
			// debugger

			let str: string;

			if (item && item.fileContent) {
				str = item.fileContent;
			}else{

				str= `Problem in creating file`;
			}

			return Buffer.from(str);
		}
	};

	extensionContext.subscriptions.push(vscode.workspace.registerFileSystemProvider(myScheme, myProvider));
}

export {
	registerTextDocumentContentProvider
}