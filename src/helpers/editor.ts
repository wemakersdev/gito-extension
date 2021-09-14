import * as vscode from 'vscode';

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



export {
	setEditorText
}