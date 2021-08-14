
import * as vscode from 'vscode';
let recording:any;

export function activate(context: vscode.ExtensionContext) {
	let startRecording = vscode.commands.registerCommand('gito-new.startRecording', () => {
		try{
			if(recording){
				throw new Error("Recording is already active");
			}	
			const activeTextEditor = vscode.window.activeTextEditor;
			const text = activeTextEditor?.document.getText();
			const fileName = activeTextEditor?.document.fileName;
			const visibleRange = activeTextEditor?.visibleRanges;
			recording = [];

			recording.push({
				text, fileName, timestamp: Date.now(),visibleRange
			});

			vscode.workspace.onDidChangeTextDocument((event) => {
				const text = event.document.getText();
				const fileName = event.document.fileName;
				const visibleRange = activeTextEditor?.visibleRanges;
				recording.push({
					text, 
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
		if(!recording){
			return null;
		}
		const delay = (ms:any) => new Promise((res) => setTimeout(res, ms));
		vscode.window.showInformationMessage(`Info: Playing recording`);

		for(let i = 0; i < recording.length; i++){
			const item:any = recording[i];
			setEditorText(item.text, vscode.window.activeTextEditor);

			if(i > 1){
				const prevItem:any = recording[i-1];
				await delay(item.timestamp - prevItem.timestamp);
			}
		}

		recording = null;

		vscode.window.showInformationMessage(`Info: Completed Playing`);

	});

	let stopRecording = vscode.commands.registerCommand("gito-new.stopRecording", () => {
		recording = null;
		vscode.window.showInformationMessage(`Stopped Recording`);
	});


	context.subscriptions.push(startRecording);
	context.subscriptions.push(playRecording);
	context.subscriptions.push(stopRecording);
}

export function deactivate() {


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