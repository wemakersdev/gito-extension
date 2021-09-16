import * as vscode from 'vscode';

function setEditorText(text: string | undefined, editor: vscode.TextEditor | undefined = vscode.window.activeTextEditor) {

	if (!editor?.edit) {
		debugger;

	} else {
		editor?.edit(editBuilder => {
			try {
				const pos = new vscode.Position(0, 0);
				const nxt = new vscode.Position(editor?.document.lineCount || 1000, 1000);
				const selections = editor?.selections;
				editBuilder.delete(new vscode.Range(pos, nxt));
				if (text) {
					editBuilder.insert(pos, text);
				}
				if (editor && selections) {
					editor.selections = selections;
				}
			} catch (err: any) {
				debugger
			}
		});
	}
}

async function setDocumentChange(changes: any, editor: vscode.TextEditor | undefined) {
	try {
		if (changes) {
			for (let change of changes) {
				if (editor?.edit) {
					await editor?.edit((editor) => {
						const pos1 = new vscode.Position(change.range[0].line, change.range[0].character);
						const pos2 = new vscode.Position(change.range[1].line, change.range[1].character);

						const range = new vscode.Range(pos1, pos2);
						editor.replace(range, change.text);

					});
				}
			}
		}
	} catch (err) {
		debugger
	}
}




async function initEditor({fileName}:any):Promise<vscode.TextEditor | undefined>{
	const doc = await vscode.workspace.openTextDocument(fileName);
	const editor = await vscode.window.showTextDocument(doc);
	return editor;
}

export {
	setEditorText,
	setDocumentChange,
	initEditor
}