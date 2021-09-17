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




async function initEditor({fileName, fileContent}:any):Promise<vscode.TextEditor | undefined>{
	const uri = vscode.Uri.file(fileName);
	const doc = await openDocument({uri, fileContent});
	const editor = await vscode.window.showTextDocument(doc);
	return editor;
}


async function openDocument({uri, fileContent}: any):Promise<any>{
	try{
		const newUri = vscode.Uri.from({path: uri.path, scheme: "gito", fragment: uri.fragment, query: uri.query});
		const doc = await vscode.workspace.openTextDocument(newUri);
		return doc;
	}catch(err){
		const doc = await vscode.workspace.openTextDocument({
			content: fileContent,
		});
		return doc;
	}
}


async function setRevealRange(range: any, editor: vscode.TextEditor| undefined){
	if(!range){
		return;
	}

	range = range[0];

	try{

		let _range:any;
		if(range instanceof vscode.Range){
			_range = range;
		}else if(range){
			const pos1 = new vscode.Position(range[0].line,range[0].character);
			const pos2 = new vscode.Position(range[1].line, range[1].character);
		
			_range = new vscode.Range(pos1, pos2);
			
		}
	
		
		await editor?.revealRange(_range);

	}catch(err:any){
		debugger
	}

}

export {
	setEditorText,
	setDocumentChange,
	initEditor,
	setRevealRange
}