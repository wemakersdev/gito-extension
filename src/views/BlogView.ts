import * as vscode from 'vscode';
import { ExtensionContext } from 'vscode';
import dayjs, {extend} from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import path from 'path';
import { getGlobalStoreContext } from './../helpers/context';
import atob from 'atob'

extend(localizedFormat);
extend(relativeTime);

export type ViewProvider = "week" | "daily" | "monthly";
export class BlogViewProvider implements vscode.TreeDataProvider<BlogItem> {
	constructor(private context: ExtensionContext, private type?: ViewProvider) { }

	getTreeItem(element: BlogItem | CollapsibleItem): vscode.TreeItem {

		if(element instanceof CollapsibleItem){

		}

		return element;
	}

	getChildren(element?: BlogItem | CollapsibleItem): Thenable<BlogItem[]> {
		if(!element){

			return Promise.resolve(this.getDays(0, 16));
		}else{
			return Promise.resolve([]);
		}
	}

	getAllDaysWithContent(){
		const store = getGlobalStoreContext();
		return store.keys.map(item =>{
			try{
				return atob(item)
			}catch(err){
				return false
			}
		}).filter(item =>item.match(/.md$/));
	}

	getDays(start: number, end: number){

		let days = this.getAllDaysWithContent();
	
		if(!days[0] || !days[0].includes(this.getTodayStr())){
			days = [this.getTodayStr, ...days];
		}
		return days.map(day => {
			return new BlogItem({
				label: day,
				tooltip: `Blob created at ${day}`,
				collapsibleState: vscode.TreeItemCollapsibleState.None
			});
		});
	}

	getTodayStr(){
		return dayjs().format("LL") + ".md";
	}

	getRoot(){
		switch(this.type){
			case "daily": return this.getAllDays();
			case "monthly": return this.getMonthly();
		}
	}

	getAllDays(){

	}

	getMonthly(){

	}

	getWeekly(){

	}
}

class CollapsibleItem extends vscode.TreeItem {

	public type: string;
	constructor({
		label,
		description,
		collapsibleState = vscode.TreeItemCollapsibleState.Collapsed,
		tooltip = "tooltip",
		type
	}: {
		label: string,
		description?: string,
		collapsibleState: vscode.TreeItemCollapsibleState,
		tooltip?: string,
		type?: string
	}) {
		super(label, collapsibleState);
		this.tooltip = tooltip;
		this.description = description;
		this.type = type;
	}
}

class BlogItem extends vscode.TreeItem {
	constructor({
		label,
		description,
		collapsibleState,
		tooltip = "tooltip",
		iconPath
	}: {
		label: string,
		description?: string,
		collapsibleState: vscode.TreeItemCollapsibleState,
		tooltip?: string,
		iconPath?: vscode.ThemeIcon,
	}) {
		super(label, collapsibleState);

		this.tooltip = tooltip;
		this.description = description;

		this.command = {
			title: "open blog editor file",
			command: "vscode.open",
			arguments: [this.uri]
		};

		this.iconPath = iconPath || {
			light: path.join(__dirname,"..", "resources",'icons', 'blog-explorer-dark.svg'),
			dark: path.join(__dirname,"..", "resources",'icons', 'blog-explorer-light.svg'),
		};
	}

	get uri(){
		const uri = vscode.Uri.from({
			scheme: "blog-editor",
			path: "/" + this.label.toString()
		});
		return uri;
	}
}