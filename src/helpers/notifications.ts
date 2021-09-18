
import * as vscode from 'vscode';

interface InformMessageActions{
	string: string
	callback: Function
}

function inform(text: string, items?:InformMessageActions[]): any{
	const _items: string[] = (items && items?.map(item => item.string)) || [];
	vscode.window.showInformationMessage(text, ..._items).then((item: string|undefined) => {
		if(item){
			items?.forEach(_item => _item.string  === item && _item.callback());
		}
	});
}

export {
	inform
}