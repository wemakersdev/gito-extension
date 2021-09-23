import * as vscode from 'vscode';

export class GitoExplorerProvider implements vscode.TreeDataProvider<GitoItem> {
  constructor(private workspaceRoot: string) {}

  getTreeItem(element: GitoItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: GitoItem): Thenable<GitoItem[]> {
    // if (!this.workspaceRoot) {
    //   vscode.window.showInformationMessage('No gito currently recorded');
    //   return Promise.resolve([]);
    // }

    return Promise.resolve(this.getDepsInPackageJson("sadb"));
  }

  /**
   * Given the path to package.json, read all its dependencies and devDependencies.
   */
  private getDepsInPackageJson(packageJsonPath: string): GitoItem[] {
		return [
			new GitoItem("abc", "def", vscode.TreeItemCollapsibleState.None),
			new GitoItem("askdsad", "sadasd", vscode.TreeItemCollapsibleState.None)
		];
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
