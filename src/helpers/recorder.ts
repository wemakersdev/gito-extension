import { executeCommand } from "./commands";
import * as vscode from 'vscode';
import { upload } from "./upload";
import { uid } from 'uid';
import { delay } from "./utils";
import { initEditor, setDocumentChange, setEditorText, setRevealRange } from "./editor";
import { inform } from "./notifications";
import { getGlobalStoreContext, getPlaybackSpeedContext, getStatusBarItemsContext } from "./context";


interface IGitoRecordingItem {
	type: "TEXT_CHANGE" | "EDITOR_CHANGE" | "INITIAL_STATE"
	text?: string
	timestamp?: number
	fileName?: string
	fileContent?: string
	scrollPosition?: string
	cursorPosition?: string
	selection?: string
	visibleRange?: vscode.Range
	changes?: vscode.TextDocumentContentChangeEvent[]
}

interface IGitoRecording {
	recording?: IGitoRecordingItem[] | any[]
	browserUrl?: string|undefined
	audio?: string
	id?: string
	name?: string

	readonly createdBy?: string
	readonly createdAt?: number
	editedBy?: string
	editedAt?: number
}

interface IGitoMetaData{
	id: string
	name: string
	timestamp: number
	createdBy: string
	size: number
	hasAudio: boolean
	recording: IGitoRecordingItem[] | any[],
	audio?: string
}

class GitoRecording {

	recording: IGitoRecordingItem[] | any[] = [];
	audio: string = "";
	changes:vscode.Range[] = [];
	browserUrl: string|undefined;
	id:string = uid();
	name: string = "untitled";

	private activeTextEditor: vscode.TextEditor | undefined = vscode.window.activeTextEditor;
	private _dispose: Function[] = [];
	private _isPaused: boolean = false;


	constructor(options: IGitoRecording) {
		Object.assign(this, options);

		if(this.changes){

		}
	}


	async start() {
		try {
			await this._startAudioRecording();

			this.activeTextEditor = vscode.window.activeTextEditor;

			this.addInitialState();

			const disposableEditorChange = vscode.window.onDidChangeActiveTextEditor((editor) => {
				!this._isPaused && this.handleTextEditorChange(editor);
			});

			const disposableTextChange = vscode.workspace.onDidChangeTextDocument((event) => {
				!this._isPaused && this.handleTextChange(event, this.activeTextEditor);
			});


			this._dispose.push(disposableEditorChange.dispose);
			this._dispose.push(disposableTextChange.dispose);

		} catch (err: any) {
			debugger;
		}
	}

	addInitialState() {
		const state = this.getEditorState(this.activeTextEditor)
		const obj = {
			type: "INITIAL_STATE",
			...state
		} as IGitoRecordingItem;

		this.recording.push(obj);

	}
	async stop(): Promise<GitoRecording> {

		inform(`Stopped recording`);
		this._dispose.forEach(item => item());
		this.audio = await this._stopAudioRecording();
		this.browserUrl = await this.getBrowserUrl();
		return this;
	}

	async getBrowserUrl(): Promise<string>{
		const url = await executeCommand("github1s.vscode.get-browser-url");
		return (url || "") as string;
	}
	async upload(): Promise<string> {
		inform(`Starting uploading Gito`)
		const url = await upload({
			...this
		}, {
			fileName: this.id,
			folder: "data"
		});

		const _url = new URL(url);
		const newUrl = _url.pathname.replace("/data/", "");

		inform(`Gito Url: gito.dev/${newUrl}`, [{
			string: "Copy url",
			callback: async () =>{
				await executeCommand("gito-new.copy-to-clipboard", `gito.dev/${newUrl}`);	
				inform(`Copied!`);
			}
		}]);

		await this.saveGitoInformation();

		return newUrl;
	}

	get size(){
		const blob = new Blob([JSON.stringify(this)]);
		return blob.size;
	}

	async saveGitoInformation(gitoMetaData: IGitoMetaData = {
		id: this.id,
		name: this.name,
		createdBy: "sadasd",
		timestamp: Date.now(),
		size: this.size,
		hasAudio: !!this.audio,
		audio: this.audio,
		recording: this.recording,
	}){
		const globalStore = getGlobalStoreContext();
		await globalStore.setData(this.id, gitoMetaData);
	}

	async pause() {
		try{
			await this._pauseAudioRecording();
			this._isPaused = true

		}catch(err){
			console.error(err);
		}
	}
	async resume() {

		try{
			await this._resumeAudioRecording();
			this._isPaused = false;
		}catch(err){
			console.error(err);
		}
	}

	async play() {
		try {

			let editor;

			const statusBarItems = getStatusBarItemsContext();
			statusBarItems.show(["speed" ,"pause", "stop"]);
			statusBarItems.hide(["record"]);

			inform(`Started playing gito`);

			await this._playAudioRecording(this.audio);
			
			inform(`Playing audio from gito`);
			editor = vscode.window.activeTextEditor;

			let i = 0;
			for (let recordingItem of this.recording as IGitoRecordingItem[]) {
				switch (recordingItem.type) {
					case "EDITOR_CHANGE": {
						editor = await initEditor({fileName: recordingItem.fileName});
						await setRevealRange(recordingItem.visibleRange, editor);
						await setEditorText(recordingItem.fileContent, editor);
						await delay(500);
						break;
					}

					case 'TEXT_CHANGE': {
						await setRevealRange(recordingItem.visibleRange, editor);
						await setDocumentChange(recordingItem.changes, editor);
						break;
					}

					case "INITIAL_STATE": {
						editor = await initEditor({fileName: recordingItem.fileName, fileContent: recordingItem.fileContent});
						await setRevealRange(recordingItem.visibleRange, editor);
						await setEditorText(recordingItem.fileContent, editor);
						break;
					}
				}


				if (i > 1) {
					const prevItem: IGitoRecordingItem = this.recording[i - 1];
					if (prevItem) {
						const t1: number = recordingItem.timestamp || 0;
						const t2: number = prevItem.timestamp || 0;
						await delay((t1 - t2)/getPlaybackSpeedContext());
					}
				}
				i++;
			}

			inform(`Playback complete!`);
			
			statusBarItems.hide(["speed" ,"pause", "stop"]);
			statusBarItems.show(["record"]);

		} catch (err:any) {
			inform(err.message);
			debugger;
		}
	}

	handleTextEditorChange(editor: vscode.TextEditor | undefined) {
		this.activeTextEditor = editor;
		const state = this.getEditorState(editor);

		const obj = {
			type: "EDITOR_CHANGE",
			timestamp: Date.now(),
			...state
		} as IGitoRecordingItem;

		this.recording.push(obj);
	}

	handleTextChange(
		event: vscode.TextDocumentChangeEvent,
		editor: vscode.TextEditor | undefined
	) {

		const changes = event.contentChanges;
		const state = this.getEditorState(editor, true);

		const obj = {
			type: "TEXT_CHANGE",
			changes,
			timestamp: Date.now(),
			...state
		} as IGitoRecordingItem;
		this.recording.push(obj);
	}

	async _startAudioRecording() {
		await executeCommand("gito-new.start-audio-recording");
	}

	async _stopAudioRecording():Promise<string> {
		return (await executeCommand("gito-new.stop-audio-recording")|| "") as string;
	}

	async _pauseAudioRecording(){
		await executeCommand("gito-new.pause-audio-recording");
	}

	async _resumeAudioRecording(){
		await executeCommand("gito-new.resume-audio-recording");
	}
	async _playAudioRecording(audio: string) {
		await executeCommand("gito-new.play-audio-recording", audio);
	}


	getEditorState(textEditor: vscode.TextEditor | undefined, excludeFileContent?: boolean) {
		const fileContent = !excludeFileContent && textEditor?.document.getText();
		const fileName = textEditor?.document.uri.path;
		const visibleRange = textEditor?.visibleRanges;

		return {
			fileContent,
			fileName,
			visibleRange
		};
	}

	setEditorState(textEditor: vscode.TextEditor) {
		return null;
	}


	

}

async function recordGito(options: Partial<IGitoRecording> = {}) {
	try {
		const gitoRecording = new GitoRecording({
			recording: [],
			...options
		});
		gitoRecording.start();

		return gitoRecording;
	} catch (err: any) {
		console.error(err);
		throw new Error(`Error while starting to recording gito; ${err.message}`)
	}
}


export {
	GitoRecording,
	IGitoRecording,
	IGitoRecordingItem,
	IGitoMetaData,
	recordGito,
};