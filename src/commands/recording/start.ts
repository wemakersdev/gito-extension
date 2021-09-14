import * as vscode from 'vscode';
import recording from '../../stores/recording';

function startRecording(context: vscode.ExtensionContext) {
	try {
		if (recording.isRecording) {
			throw new Error("Recording is already active");
		}


		const activeTextEditor = vscode.window.activeTextEditor;
		const text = activeTextEditor?.document.getText();
		const fileName = activeTextEditor?.document.fileName;
		const visibleRange = activeTextEditor?.visibleRanges;


		recording.audioData.push({
			text, fileName, timestamp: Date.now(), visibleRange
		});

		recording.event = vscode.workspace.onDidChangeTextDocument((event) => {
			const changes = event.contentChanges;
			const fileName = event.document.fileName;
			const visibleRange = activeTextEditor?.visibleRanges;
			recording.push({
				changes,
				fileName,
				timestamp: Date.now(),
				visibleRange
			});
		});
		vscode.window.showInformationMessage(`Info: Started Recording`);

	} catch (err: any) {
		vscode.window.showInformationMessage(`Error: ${err.message}`);
	}
}

export default startRecording;