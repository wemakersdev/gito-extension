import * as vscode from 'vscode';
import { GlobalStore } from '../helpers/globalStore';
import { getExtensionContext, getGitoContext } from './../helpers/context';
import btoa from 'btoa';
import atob from 'atob'
import { inform } from '../helpers/notifications';


interface BlogData{
	content: string,
	created: number,
	updated: number,
	authorId: string
}

class DayStore extends GlobalStore{

	public day:string;
	public key: string;
	public content: string;

	constructor({
		day
	}: {day: string}){
		const extensionContext = getExtensionContext();
		super(extensionContext);

		this.day = day;
		this.key = btoa(day);
	}


	async save(){
		await this.setData(this.key, this.content);
	}

	async load(){
		const data = this.getData(this.key);
		if(data){
			this.content = data as string;
			return this;
		}else{
			throw new Error(`No data found for the day ${this.day}`);
		}
	}
}


let emitter = new vscode.EventEmitter();

const getPathFromUri = (uri: vscode.Uri) => uri.path.replace(/^\//, "");

function registerBlogEditorContentProvider() {

	const extensionContext = getExtensionContext();

	const myScheme = "blog-editor";
	const myProvider = new class implements vscode.FileSystemProvider {
		onDidChangeFile(...args:any):any{}
		readDirectory(...args:any):any{}
		createDirectory(...args:any):any{}
		// writeFile(...args:any):any{}
		delete(...args:any):any{}
		rename(...args:any):any{}
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

	 	async writeFile(uri: vscode.Uri, content: Buffer, {
			create,
			overwrite
		}): Promise<any>{
			try{
				const path = getPathFromUri(uri);
				const store = new DayStore({day: path});
				store.content = content.toString();
				await store.save();
			}catch(err){
				inform(`${err.message}`);
			}
		}

		async readFile(uri: vscode.Uri): Promise<Uint8Array> {
			try{
				const path = uri.path.replace(/^\//, "");
				const store = new DayStore({day: path});
				await store.load();

				if(!store.content){
					throw new Error("empty file");
				}
				return Buffer.from(store.content);
			}catch(err){
				console.error(err);
				// debugger
				return Buffer.from(`Start writing your blog post...`)
			}
		}
	};

	extensionContext.subscriptions.push(vscode.workspace.registerFileSystemProvider(myScheme, myProvider));
}

export {
	registerBlogEditorContentProvider
}