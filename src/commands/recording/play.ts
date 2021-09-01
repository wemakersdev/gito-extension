import * as vscode from 'vscode';
import recording from '../../stores/recording';

async function playRecording(){
	if (!recording.isRecording) {
			return null;
		}
		recording.event.dispose();
		const delay = (ms: any) => new Promise((res) => setTimeout(res, ms));
		vscode.window.showInformationMessage(`Info: Playing recording`);

		const audioData = recording.audioData

		for (let i = 0; i < recording.audioData.length; i++) {
			const item: any = recording[i];

			if (item.text) {
				setEditorText(item.text, vscode.window.activeTextEditor);
			}

			if (item.changes) {
				item.changes.forEach((item: any) => {
					vscode.window.activeTextEditor?.edit((editor) => {
						editor.replace(item.range, item.text);
					});
				});
			}
			if (i > 1) {
				const prevItem: any = recording[i - 1];
				await delay(item.timestamp - prevItem.timestamp);
			}
		}
		vscode.window.showInformationMessage(`Info: Completed Playing`);
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