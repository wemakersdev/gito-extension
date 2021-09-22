/**
 * @file extension context
 * @author netcon
 */

import * as vscode from 'vscode';
import { GITHUB_OAUTH_TOKEN } from './constants';
import { GitoRecording } from './recorder';
import { StatusBarItems } from './statusBar';

let extensionContext: vscode.ExtensionContext | null = null;
let gitoContext: GitoRecording | null = null
let statusBarItemsContext: StatusBarItems | null = null;
let playbackSpeedContext: number = 1;

export const setExtensionContext = (
	_extensionContext: vscode.ExtensionContext
) => {
	extensionContext = _extensionContext;
};

export const getExtensionContext = (): vscode.ExtensionContext => {
	if (!extensionContext) {
		throw new Error('extension context initialize failed!');
	}

	return extensionContext;
};

export const setPlaybackSpeedContext = (
	_playbackSpeedContext: number
) => {
	playbackSpeedContext = _playbackSpeedContext;
};

export const getPlaybackSpeedContext = (): number=> {
	if (!playbackSpeedContext) {
		throw new Error('playbackSpeed context initialize failed!');
	}

	return playbackSpeedContext;
};


export const setStatusBarItemsContext = (
	_statusBarItemsContext: StatusBarItems
) => {
	statusBarItemsContext = _statusBarItemsContext;
};

export const getStatusBarItemsContext = (): StatusBarItems => {
	if (!statusBarItemsContext) {
		throw new Error('extension context initialize failed!');
	}

	return statusBarItemsContext;
};

export const setGitoContext = (
	_gitoContext: GitoRecording
) => {
	gitoContext = _gitoContext;
};

export const getGitoContext = (): GitoRecording => {
	if (!gitoContext) {
		throw new Error('gito context initialize failed!');
	}

	return gitoContext;
};

export const getOAuthToken = () => {
	const context = getExtensionContext();
	return (context.globalState.get(GITHUB_OAUTH_TOKEN) as string) || '';
};



export const hasValidToken = () => getOAuthToken() !== '';

