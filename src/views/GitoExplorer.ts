import * as vscode from 'vscode';
import { ExtensionContext } from 'vscode';
import { getGlobalStoreContext } from '../helpers/context';
import { IGitoMetaData } from '../helpers/recorder';

export class GitoExplorerProvider implements vscode.TreeDataProvider<GitoItem> {
	constructor(private context: ExtensionContext) { }

	getTreeItem(element: GitoItem): vscode.TreeItem {
		return element;
	}

	getChildren(element?: GitoItem): Thenable<GitoItem[]> {
		return Promise.resolve(this.getAllGitos());
	}

	/**
	 * Given the path to package.json, read all its dependencies and devDependencies.
	 */

	private getAllGitos(): GitoItem[] {
		const globalState = getGlobalStoreContext();

		let gitos: GitoItem[] = [];

		for (let [key, value] of globalState.values) {
			let _value = value as IGitoMetaData;
			const gito = new GitoItem(_value.id, _value.name, vscode.TreeItemCollapsibleState.Collapsed)

			gitos.push(gito);
		}
		return gitos;	
	}
}

class GitoItem extends vscode.TreeItem {
	constructor(
		public readonly label: string,
		private version: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState
	) {
		super(label, collapsibleState);
		this.tooltip = `${this.label}-${this.version}`;
		this.description = this.version;
	}

}
