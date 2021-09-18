import * as vscode from 'vscode';


let statusBarItems: any = [];
let recordButton: any;
let pauseButton: any;
let stopButton: any;
let timer: any;
let _stopTimer;

function _startTimer({ precision = 0.1 }:any = {}) {
	const id = setInterval(() => {
		timer += precision;
	}, precision * 1000);

	return () => clearInterval(id);
}


function addStatusBarItem({
	name,
	tooltip,
	command,
	autoshow
}: any) {
	if (getStatusBarItem(name)) {
		debugger
	} else {

		const titleItem = vscode.window.createStatusBarItem(
			vscode.StatusBarAlignment.Left,
			0
		);
		titleItem.text = name;
		titleItem.tooltip = tooltip;
		titleItem.command = command;

		if (autoshow) {
			titleItem.show();
		}

		statusBarItems.push({
			name: name,
			instance: titleItem
		});

		return titleItem
	}
}

function removeStatusBarItem(name: string) {
	const item = getStatusBarItem(name);

	if (item) {
		item.instance.hide();
		item.instance.dispose();
		statusBarItems = statusBarItems.filter((item: any) => item.name !== name);
	}
}

function getStatusBarItem(name: string) {
	return statusBarItems.find((item: any) => item.name === name)
}



function handleGitoStatusBar() {
	recordButton = addStatusBarItem({
		name: "$(debug-start) Record Gito",
		tooltip: "Start gito recording",
		command: {
			title: "gito-new",
			command: "gito-new.startRecording"
		},
		autoshow: true
	});

	stopButton = addStatusBarItem({
		name: "$(debug-stop) Stop Recording",
		tooltip: "Stop gito recording",
		command: {
			title: "gito-new",
			command: "gito-new.stopRecording"
		},
		autoshow: false
	});

}


function startedRecordingUpdate() {
	recordButton.hide();
	stopButton.show();
}


function stoppedRecordingUpdate() {
	recordButton.show();
	stopButton.hide();
}


function startTimer() {
	if (!timer) {
		timer = addStatusBarItem({
			name: "$(refactor-preview-view-icon) 00:00",
			tooltip: "Timer",
			autoshow: false
		});
	}

	timer.show();

}

function stopTimer() {

}


export default handleGitoStatusBar;

export {
	stoppedRecordingUpdate,
	startedRecordingUpdate
};