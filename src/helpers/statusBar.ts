import  * as vscode from 'vscode';


let statusBarItems:any= [];


function addStatusBarItem({
	 name,
	 tooltip,
	 command,
	 autoshow
}:any){
	if(getStatusBarItem(name)){
		debugger
	}else{

		const titleItem = vscode.window.createStatusBarItem(
			vscode.StatusBarAlignment.Left,
			0
		);
		titleItem.text  = name;
		titleItem.tooltip = tooltip;
		titleItem.command = command;

		if(autoshow){
			titleItem.show();
		}

		statusBarItems.push({
			name: name,
			instance: titleItem
		});
	}
}

function removeStatusBarItem(name: string){
	const item = getStatusBarItem(name);
	
	if(item){
		item.instance.hide();
		item.instance.dispose();
		statusBarItems = statusBarItems.filter((item: any) => item.name !== name);
	}
}

function getStatusBarItem(name: string){
	return statusBarItems.find((item:any) => item.name === name)
}



function handleGitoStatusBar(){

	addStatusBarItem({
		name: "gito record",
		tooltip: "Start gito recording",
		command: {
			title: "gito-new",
			command: "gito-new.startRecording"
		},
		autoshow: true
	});
}

export default handleGitoStatusBar;