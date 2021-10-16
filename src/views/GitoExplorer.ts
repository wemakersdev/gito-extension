import * as vscode from 'vscode';
import { ExtensionContext } from 'vscode';
import { getGlobalStoreContext } from '../helpers/context';
import { IGitoMetaData } from '../helpers/recorder';

const gitoIconUrl = require('!url-loader!!./../../resources/icons/gito-logo-light.svg');	

export class GitoExplorerProvider implements vscode.TreeDataProvider<GitoItem> {
	constructor(private context: ExtensionContext) { }

	getTreeItem(element: GitoItem): vscode.TreeItem {
		// debugger
		return element;
	}

	getChildren(element?: GitoItem): Thenable<GitoItem[]> {
		// debugger
		if(!element){
			return Promise.resolve(this.getAllGitos());
		}else{
			// debugger
			return Promise.resolve(this.getGitoFiles(element._version));
		}
	}


	getGitoFiles(id: string | undefined): GitoItem[]{
		if(!id){
			return [];
		}
		return [
			new GitoItem("package.json", "", vscode.TreeItemCollapsibleState.Collapsed),
			new GitoItem("main.dev.ts", "", vscode.TreeItemCollapsibleState.Collapsed),
			new GitoItem("constants.ts", "", vscode.TreeItemCollapsibleState.Collapsed)
		];
	}
	private getAllGitos(): GitoItem[] {
		const globalState = getGlobalStoreContext();

		let gitos: GitoItem[] = [];

		for (let [key, value] of globalState.values) {
			if(value){
				// debugger
				let _value = value as IGitoMetaData;
				const gito = new GitoItem(_value.name, _value.id, vscode.TreeItemCollapsibleState.Collapsed, _value);

				gito.iconPath = gitoIconUrl.default;
				gitos.push(gito);
			}
		}
		return gitos;	
	}
}

class GitoItem extends vscode.TreeItem {
	constructor(
		public readonly label: string,
		private version: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public data?: IGitoMetaData
	) {
		super(label, collapsibleState);
		this.tooltip = `${this.label}-${this.version}`;
		this.description = this.version;
	}

	get _version(): string{
		return this.version;
	}

}
