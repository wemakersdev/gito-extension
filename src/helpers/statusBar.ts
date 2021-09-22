import * as vscode from 'vscode';
export interface IStatusBarItem{
	id: string
	item: vscode.StatusBarItem

}
export class StatusBarItems{
	constructor(
		public items: IStatusBarItem[]
	){}

	add(statusBarItem: IStatusBarItem){
		this.items.push(statusBarItem);
	}

	remove(id:string){
		this.items = this.items.filter(item => item.id !== id)
	}

	static create(alignment: vscode.StatusBarAlignment | undefined, priority?: number|undefined){
		return vscode.window.createStatusBarItem(alignment, priority);
	}

	find(id: string): IStatusBarItem | undefined{
		return this.items.find(item => item.id === id);
	}

	get(id: string):  vscode.StatusBarItem | undefined{
		return this.find(id)?.item;
	}

	set(id: string, options: Partial<vscode.StatusBarItem>): vscode.StatusBarItem{
		const item = this.get(id);
		
		if(!item) {
			throw new Error(`Item for passed id doesn't exists`)
		}else{	
			for(let key in options){
				(item as any)[key] = (options as any)[key];
			}
		}

		return item;
	}

	update(
		id: string, 
		callback: (item: vscode.StatusBarItem) => Partial<vscode.StatusBarItem>
	): vscode.StatusBarItem{
		const item = this.get(id);
		
		if(item){
			const data = callback(item);
			this.set(id, data);

			return item;
		}else{
			throw new Error(`Item for passed id doesn't exists`);
		}
	}

	hide(id: string | string[]): vscode.StatusBarItem| vscode.StatusBarItem[] | undefined{

		const hide = (id:string):vscode.StatusBarItem | undefined => {
			const item = this.get(id);
			item?.hide();
			return item;
		}; 
		
		return Array.isArray(id) 
			? id.map(_id => hide(_id)).filter(_item => !!_item) as vscode.StatusBarItem[]
			: hide(id);
	}	

	show(id: string | string[]): vscode.StatusBarItem| vscode.StatusBarItem[] | undefined{

		const show = (id:string):vscode.StatusBarItem | undefined => {
			const item = this.get(id);
			item?.show();
			return item;
		}; 
		
		return Array.isArray(id) 
			? id.map(_id => show(_id)).filter(_item => !!_item) as vscode.StatusBarItem[]
			: show(id);
	}

	handleRecordingStartUpdate(){
		this.hide("record");
		this.show(["stop", "pause"]);
	}

	handleRecordingStopUpdate(){
		this.show("record");
		this.hide(["stop", "pause"]);
	}

}



export function initStatusBar(){

	const items: IStatusBarItem[] = ["record", "pause", "resume", "timer", "play", "stop", "speed"].map((id:string) => {
		return {
			id,
			item: StatusBarItems.create(vscode.StatusBarAlignment.Left,0)
		};
	});


	const statusBarItems: StatusBarItems = new StatusBarItems(items);

	statusBarItems.set("record", {
		text: "$(debug-start) Record Gito",
		tooltip: "Start gito recording",
		command: {
			title: "gito-new",
			command: "gito-new.startRecording"
		},
	})

	statusBarItems.set("stop", {
		text: "$(debug-stop) Stop Recording",
		tooltip: "Stop gito recording",
		command: {
			title: "gito-new",
			command: "gito-new.stopRecording"
		},
	});

	statusBarItems.set("pause", {
		text: "$(debug-pause) Pause Recording",
		tooltip: "Pause gito recording",
		command: {
			title: "gito-new",
			command: "gito-new.pauseRecording"
		},
	});

	statusBarItems.set("speed", {
		text: "speed: 1x",
		tooltip: "Increase playback speed",
		command: {
			title: "gito-new",
			command: "gito-new.increasePlaybackSpeed"
		},
	});


	statusBarItems.show("record");

	return statusBarItems;
}
