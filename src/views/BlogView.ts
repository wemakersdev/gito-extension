import * as vscode from 'vscode';
import { ExtensionContext } from 'vscode';
import dayjs, {extend} from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import path from 'path';
import btoa from 'btoa';

extend(localizedFormat);
extend(relativeTime);

export class BlogViewProvider implements vscode.TreeDataProvider<BlogItem> {
	constructor(private context: ExtensionContext) { }

	getTreeItem(element: BlogItem): vscode.TreeItem {

		return element;
	}

	getChildren(element?: BlogItem): Thenable<BlogItem[]> {
		if(!element){
			return Promise.resolve(this.getDays(0, 16));
		}else{
			return Promise.resolve([]);
		}
	}

	getDays(start: number, end: number){

		let days = [];

		for(let i = start ; i< end; i++){
			const d = dayjs().subtract(i, "d").format("LL");
			days.push(d);
		}
		return days.map(day => {
			return new BlogItem({
				label: day + ".md",
				tooltip: `Blob created at ${day}`,
				collapsibleState: vscode.TreeItemCollapsibleState.None
			});
		});
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